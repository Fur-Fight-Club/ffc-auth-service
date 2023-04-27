import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  firstname: string;
  @ApiProperty({ type: 'string', format: 'binary' })
  lastname: string;
  @ApiProperty({ type: 'string', format: 'binary' })
  email: string;
  @ApiProperty({ type: 'string', format: 'binary' })
  password: string;
}