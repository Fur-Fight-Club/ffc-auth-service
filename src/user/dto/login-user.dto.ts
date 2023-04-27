import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  email: string;
  @ApiProperty({ type: 'string', format: 'binary' })
  password: string;
}

export class LoginUserResponseDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  access_token: string;
}