import { Module } from "@nestjs/common";
import { AnalyticsApiProvider } from "./analytics.service";
import { AuthService } from "src/auth/auth.service";

@Module({
  providers: [
    AnalyticsApiProvider,
    AuthService
  ],
  exports: [],
})
export class AnalyticsModule { }