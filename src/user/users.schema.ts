import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

const userRoleSchema = z.enum(["ADMIN", "USER", "MONSTER_OWNER"]);

export const userSchema = z.object({
  id: z.number(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  password: z
    .password()
    .min(8)
    .atLeastOne("digit")
    .atLeastOne("lowercase")
    .atLeastOne("uppercase")
    .atLeastOne("special"),
  role: userRoleSchema,
  email_token: z.string(),
});

export class UserApiReponse {
  @ApiProperty({
    type: "integer",
  })
  id: number;
  @ApiProperty({
    type: "string",
  })
  firstname: string;
  @ApiProperty({
    type: "string",
  })
  lastname: string;
  @ApiProperty({
    type: "string",
    format: "email",
  })
  email: string;
  @ApiProperty({
    enum: ["ADMIN", "USER", "MONSTER_OWNER"],
    default: "USER",
  })
  role: UserRole;
  @ApiProperty({
    type: "string",
    default: "redacted",
  })
  password: string;
  @ApiProperty({
    type: "string",
    default: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  })
  email_token: string;
}

const createUserSchema = userSchema.pick({
  firstname: true,
  lastname: true,
  email: true,
  password: true,
});

const loginUserSchema = userSchema.pick({
  email: true,
  password: true,
});

const loginResponseUserSchema = z.object({
  access_token: z.string(),
});

const getUserSchema = userSchema.pick({
  id: true,
});

const updateUserSchema = userSchema.pick({
  id: true,
  firstname: true,
  lastname: true,
  email: true,
  password: true,
  role: true,
  email_token: true,
});

export class CreateUserDto extends createZodDto(createUserSchema) {}

export class LoginUserDto extends createZodDto(loginUserSchema) {}

export class LoginUserResponseDto extends createZodDto(
  loginResponseUserSchema
) {}

export class UpdateUserDto extends createZodDto(updateUserSchema) {}

export class GetUserDto extends createZodDto(getUserSchema) {}

export type UserRole = z.infer<typeof userRoleSchema>;

export type UserDto = z.infer<typeof userSchema>;

/**
 * CONFIRM ACCOUNT TYPES
 */
export const confirmAccount = z.object({
  email_token: z.string(),
});

export class ConfirmAccountDto extends createZodDto(confirmAccount) {}
export type ConfirmAccountType = z.infer<typeof confirmAccount>;

export class ConfirmAccountApiBody {
  @ApiProperty({
    type: "string",
    default: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  })
  email_token: string;
}

export type ConfirmAccountResponse = Promise<boolean>;

/**
 * ASK RESET PASSWORD TYPES
 */
export const askResetPassword = z.object({
  email: z.string().email(),
});

export class AskResetPasswordDto extends createZodDto(askResetPassword) {}
export type AskResetPasswordType = z.infer<typeof askResetPassword>;

export class AskResetPasswordApiBody {
  @ApiProperty({ type: "string", format: "email" })
  email: string;
}

export class AskResetPasswordApiResponse {
  @ApiProperty({
    type: "string",
    default: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  })
  email_token: string;
}

export type AskResetPasswordResponse = Promise<{
  email_token: string;
}>;

/**
 * RESET PASSWORD TYPES
 */

export const resetPassword = z.object({
  email_token: z.string(),
  password: z.string(),
});

export class ResetPasswordDto extends createZodDto(resetPassword) {}
export type ResetPasswordType = z.infer<typeof resetPassword>;

export class ResetPasswordApiBody {
  @ApiProperty({
    type: "string",
    default: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  })
  email_token: string;

  @ApiProperty({ type: "string", format: "password" })
  password: string;
}
