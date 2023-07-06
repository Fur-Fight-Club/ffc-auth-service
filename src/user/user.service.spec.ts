import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { AuthService } from "src/auth/auth.service";
import { PrismaService } from "src/services/prisma.service";
import { UsersRepository } from "./user.repository";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

describe("UserService", () => {
  let service: UserService;

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
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
