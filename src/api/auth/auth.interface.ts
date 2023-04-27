import { Fetch } from "src/utils/api.utils";

export interface AuthApi {
  fetch: Fetch;
}

export const AuthApi = "AuthApi";