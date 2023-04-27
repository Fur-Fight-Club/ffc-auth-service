import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import * as fs from "fs"
import { AuthModule as AuthApiModule } from 'src/api/auth/auth.module';
import { AuthApiProvider } from 'src/api/auth/auth.service';
import { UserApiProvider } from 'src/api/auth/user/user.service';

@Module({
  imports: [ConfigModule, JwtModule.register({
    global: true,
  }), AuthApiModule],
  controllers: [AuthController],
  providers: [AuthService, AuthApiProvider, UserApiProvider]
})
export class AuthModule { }
