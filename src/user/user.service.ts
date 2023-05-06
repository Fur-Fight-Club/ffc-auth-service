import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { PrismaService } from "src/services/prisma.service";
import { generateUUID } from "src/utils/functions.utils";
import { password as passwordUtils } from "src/utils/password.utils";
import {
  AskResetPasswordResponse,
  ConfirmAccountResponse,
  CreateUserDto,
  GetUserDto,
  LoginUserDto,
  LoginUserResponseDto,
  UpdateUserDto,
  UserDto,
  UserRole,
} from "./users.schema";

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<LoginUserResponseDto> {
    const { email } = loginUserDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const isPasswordValid = await passwordUtils.verify(
      loginUserDto.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return this.authService.generateUserToken(user.id, user.role as UserRole);
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const { firstname, lastname, email, password: passwordDto } = createUserDto;
    const user = await this.prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: await passwordUtils.hash(password),
        role: "USER",
        email_token: generateUUID(),
      },
    });

    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role as UserRole,
      password: "redacted",
      email_token: user.email_token,
    };
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany();

    return users.map((user) => {
      return {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role as UserRole,
        password: "redacted",
        email_token: user.email_token,
      };
    });
  }

  async findOne(getUserDto: GetUserDto): Promise<UserDto> {
    const { id } = getUserDto;
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role as UserRole,
      password: "redacted",
      email_token: user.email_token,
    };
  }

  async update(updateUserDto: UpdateUserDto): Promise<UserDto> {
    const { id, firstname, lastname, email, password, role, email_token } =
      updateUserDto;
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
        role: role,
        email_token: email_token,
      },
    });

    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role as UserRole,
      password: "redacted",
      email_token: user.email_token,
    };
  }

  remove(id: number): boolean {
    const user = this.prisma.user.delete({
      where: {
        id: id,
      },
    });
    return true;
  }

  async confirmAccount(email_token: string): ConfirmAccountResponse {
    const user = await this.prisma.user.findUnique({
      where: {
        email_token: email_token,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const confirmedUser = await this.prisma.user.update({
      where: {
        email_token: email_token,
      },
      data: {
        email_token: null,
      },
    });

    if (!confirmedUser) {
      throw new InternalServerErrorException("Error while confirming user");
    }

    return true;
  }

  async askResetPassword(email: string): AskResetPasswordResponse {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        email: email,
      },
      data: {
        email_token: generateUUID(),
      },
    });

    if (!updatedUser) {
      throw new InternalServerErrorException(
        "Error while asking reset password"
      );
    }

    return {
      email_token: updatedUser.email_token,
    };
  }

  async resetPassword(
    email_token: string,
    updatedPassword: string
  ): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        email_token: email_token,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        email_token: email_token,
      },
      data: {
        password: await passwordUtils.hash(updatedPassword),
        email_token: null,
      },
    });

    if (!updatedUser) {
      throw new InternalServerErrorException("Error while reseting password");
    }

    return {
      id: updatedUser.id,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      email: updatedUser.email,
      role: updatedUser.role as UserRole,
      password: "redacted",
      email_token: updatedUser.email_token,
    };
  }
}
