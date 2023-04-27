import { Module } from "@nestjs/common";
import { AuthApiProvider } from "./auth.service";
import { UserApiProvider } from "./user/user.service";
import { UserApi } from "./user/user.interface";
import { AuthService } from "src/auth/auth.service";

@Module({
  providers: [
    AuthApiProvider,
    UserApiProvider,
    AuthService
  ],
  exports: [UserApi],
})
export class AuthModule { }