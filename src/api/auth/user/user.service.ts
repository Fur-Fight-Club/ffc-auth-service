import { Inject, Injectable, Provider, UnauthorizedException } from "@nestjs/common";
import { AuthApi } from "../auth.interface";
import { User, UserApi } from "./user.interface";
import { checkApiResponse, handleApiResponse } from "src/utils/api.utils";

@Injectable()
class UserApiImpl implements UserApi {
  constructor(@Inject(AuthApi) private authApi: AuthApi) { }
  async login(email: string, password: string): Promise<User> {
    const response = await handleApiResponse<User | null>(
      await this.authApi.fetch(
        `login`,
        {
          method: "POST",
          body: JSON.stringify({
            email,
            password
          })
        },
      ),
    );

    checkApiResponse(response, { 401: () => new UnauthorizedException("Invalid credentials") });

    return response;
  }
  async register(firstname: string, lastname: string, email: string, password: string): Promise<User> {
    const response = await handleApiResponse<User>(
      await this.authApi.fetch(
        `register`,
        {
          method: "POST",
          body: JSON.stringify({
            firstname,
            lastname,
            email,
            password
          })
        },
      ),
    );

    checkApiResponse(response);

    return response;

  }
}

export const UserApiProvider: Provider = {
  provide: UserApi,
  useClass: UserApiImpl,
};