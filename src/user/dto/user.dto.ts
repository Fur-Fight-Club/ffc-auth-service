import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
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
  MONSTER_OWNER = "MONSTER_OWNER"
}