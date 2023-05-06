import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import * as fs from "fs";
import { JWTServicePayload } from "./auth.schema";

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException("Token not found");
    }

    try {
      const tokenPayload = (await this.jwtService.verifyAsync(token, {
        algorithms: ["RS256"],
        publicKey: fs.readFileSync("ssl/user-auth-public.pem"),
      })) as JWTServicePayload;

      request["user"] = tokenPayload;

      // TODO users checks ?

      return true;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
