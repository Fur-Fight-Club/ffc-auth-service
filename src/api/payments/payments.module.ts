import { Module } from "@nestjs/common";
import { PaymentsApiProvider } from "./payments.service";
import { AuthService } from "src/auth/auth.service";

@Module({
  providers: [
    PaymentsApiProvider,
    AuthService
  ],
  exports: [],
})
export class PaymentsModule { }