import { ApiProperty } from "@nestjs/swagger";

export interface UserApi {
  login(email: string, password: string): Promise<User>
  register(firstname: string, lastname: string, email: string, password: string): Promise<User>
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: UserRole;
  email_token: string;
}

export class LoginRequest {
  @ApiProperty({ type: 'string', format: 'binary' })
  email: string;
  @ApiProperty({ type: 'string', format: 'binary' })
  password: string;
}

export class RegisterRequest {
  @ApiProperty({ type: 'string', format: 'binary' })
  firstname: string;
  @ApiProperty({ type: 'string', format: 'binary' })
  lastname: string;
  @ApiProperty({ type: 'string', format: 'binary' })
  email: string;
  @ApiProperty({ type: 'string', format: 'binary' })
  password: string;
}

export class UserResponse {
  @ApiProperty({ type: 'number', format: 'binary' })
  id: number;
  @ApiProperty({ type: 'string', format: 'binary' })
  firstname: string;
  @ApiProperty({ type: 'string', format: 'binary' })
  lastname: string;
  @ApiProperty({ type: 'string', format: 'binary' })
  email: string;
  @ApiProperty({ type: 'string', format: 'binary' })
  password: string;
  @ApiProperty({ type: 'string', format: 'binary' })
  role: UserRole;
  @ApiProperty({ type: 'string', format: 'binary' })
  email_token: string;

}

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  ANIMAL_OWNER = "ANIMAL_OWNER"
}

export const UserApi = "UserApi";