import { Module } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { PrismaService } from "src/services/prisma.service";
import { UserController } from "./user.controller";
import { UsersRepository } from "./user.repository";
import { UserService } from "./user.service";

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, AuthService, UsersRepository],
})
export class UserModule {}
