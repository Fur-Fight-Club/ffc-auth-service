import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { AuthService } from "src/auth/auth.service";
import { PrismaService } from "src/services/prisma.service";
import { UsersRepository } from "./user.repository";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { password as passwordUtils } from "src/utils/password.utils";
import { Roles, User } from "ffc-prisma-package/dist/client";
import { generateUUID } from "src/utils/functions.utils";
import { uuid as uuidv4User } from "uuidv4";

const user = {
  id: 1,
  email: "test@example.com",
  firstname: "John",
  lastname: "Doe",
  StripeAccount: [],
  email_token: null,
  is_email_verified: true,
  password: "hashed_password",
  role: Roles.USER,
} as User;

jest.mock("uuidv4");

describe("UserService", () => {
  let service: UserService;
  let prismaService: PrismaService;
  let authService: AuthService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        PrismaService,
        AuthService,
        UsersRepository,
        JwtService,
        ConfigService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("login", () => {
    it("should login a user and return an access token", async () => {
      const email = "test@example.com";
      const password = "password";
      const token = "access-token";

      jest.spyOn(usersRepository, "getUser").mockResolvedValueOnce(user);
      jest.spyOn(passwordUtils, "verify").mockResolvedValueOnce(true);
      jest
        .spyOn(authService, "generateUserToken")
        .mockReturnValueOnce({ access_token: token });

      const result = await service.login({ email, password });

      expect(usersRepository.getUser).toHaveBeenCalledWith({
        where: { email },
      });
      expect(passwordUtils.verify).toHaveBeenCalledWith(
        password,
        user.password
      );
      expect(authService.generateUserToken).toHaveBeenCalledWith(
        user.id,
        user.role
      );
      expect(result).toEqual({ access_token: token });
    });

    it("should throw UnauthorizedException if the provided password is incorrect", async () => {
      const email = "test@example.com";
      const password = "incorrect-password";

      jest.spyOn(usersRepository, "getUser").mockResolvedValueOnce(user);
      jest.spyOn(passwordUtils, "verify").mockResolvedValueOnce(false);

      await expect(service.login({ email, password })).rejects.toThrow(
        UnauthorizedException
      );
      expect(usersRepository.getUser).toHaveBeenCalledWith({
        where: { email },
      });
      expect(passwordUtils.verify).toHaveBeenCalledWith(
        password,
        user.password
      );
    });

    it("should throw NotFoundException if the user is not found", async () => {
      const email = "non-existing@example.com";

      jest.spyOn(usersRepository, "getUser").mockResolvedValueOnce(null);

      await expect(
        service.login({ email, password: "password" })
      ).rejects.toThrow(NotFoundException);
      expect(usersRepository.getUser).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it("should throw UnauthorizedException if the user email is not verified", async () => {
      const email = "test@example.com";
      const password = "password";

      jest.spyOn(usersRepository, "getUser").mockResolvedValueOnce(user);

      await expect(service.login({ email, password })).rejects.toThrow(
        UnauthorizedException
      );
      expect(usersRepository.getUser).toHaveBeenCalledWith({
        where: { email },
      });
    });
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      const createUserDto = {
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        password: "password",
      };

      // Mock generateUUID() function
      const generatedUUID = "generatedUUID";
      (uuidv4User as jest.Mock).mockReturnValue(generatedUUID);

      const passwordHash = "hashed-password";
      const emailToken = generateUUID();

      jest.spyOn(passwordUtils, "hash").mockResolvedValueOnce(passwordHash);
      jest.spyOn(usersRepository, "getUser").mockResolvedValueOnce(null);
      jest
        .spyOn(usersRepository, "createUser")
        .mockResolvedValueOnce({ ...user, email_token: emailToken });

      const result = await service.createUser(createUserDto);

      expect(passwordUtils.hash).toHaveBeenCalledWith(createUserDto.password);
      expect(usersRepository.getUser).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(usersRepository.createUser).toHaveBeenCalledWith({
        data: {
          firstname: createUserDto.firstname,
          lastname: createUserDto.lastname,
          email: createUserDto.email,
          password: passwordHash,
          role: "USER",
          email_token: emailToken,
          Wallet: {
            create: {
              amount: 0,
            },
          },
        },
      });
      expect(result).toEqual({ ...user, email_token: emailToken });
    });

    it("should throw ConflictException if the email is already used by another user", async () => {
      const createUserDto = {
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        password: "password",
      };

      jest.spyOn(usersRepository, "getUser").mockResolvedValueOnce(user);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        ConflictException
      );
      expect(usersRepository.getUser).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
    });
  });
});
