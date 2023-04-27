import { Module } from "@nestjs/common";
import { NotificationsApiProvider } from "./notifications.service";
import { AuthService } from "src/auth/auth.service";

@Module({
  providers: [
    NotificationsApiProvider,
    AuthService
  ],
  exports: [],
})
export class NotificationsModule { }