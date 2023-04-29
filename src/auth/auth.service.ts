import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as fs from "fs";

import { UserRole } from "src/user/users.schema";
import { JWTUserPayload } from "./auth.model";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private config: ConfigService) {}

  signinService(): { access_token: string } {
    const payload = {
      iss: this.config.get<string>("issuer"),
      aud: "*",
      sub: this.config.get<string>("service"),
    };
    return {
      access_token: this.jwtService.sign(payload, {
        algorithm: "RS256",
        expiresIn: "60s",
        privateKey: fs.readFileSync("ssl/service-auth-private.pem"),
      }),
    };
  }

  generateUserToken(
    userId: number,
    userRole: UserRole
  ): { access_token: string } {
    const payload: JWTUserPayload = {
      iss: this.config.get<string>("issuer"),
      aud: "*",
      sub: userId,
      role: userRole,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        algorithm: "RS256",
        expiresIn: "7d",
        privateKey: fs.readFileSync("ssl/service-auth-private.pem"),
      }),
    };
  }
}
