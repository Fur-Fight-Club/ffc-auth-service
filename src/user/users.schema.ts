import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const userRoleSchema = z.enum(["ADMIN", "USER", "MONSTER_OWNER"]);

export const userSchema = z.object({
  id: z.number(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string().email().optional(),
  password: z
    .password()
    .min(8)
    .atLeastOne("digit")
    .atLeastOne("lowercase")
    .atLeastOne("uppercase")
    .atLeastOne("special")
    .optional(),
  role: userRoleSchema.optional(),
  email_token: z.string().nullable().optional(),
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
  email_token: string | null;
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

const deleteUserSchema = userSchema.pick({
  id: true,
});

const updateUserSchema = userSchema.pick({
  id: true,
  firstname: true,
  lastname: true,
  email: true,
  role: true,
  email_token: true,
});

const removeUserSchema = userSchema.pick({
  id: true,
});

const updatePasswordUserSchema = z.object({
  id: z.number(),
  oldPassword: z
    .password()
    .min(8)
    .atLeastOne("digit")
    .atLeastOne("lowercase")
    .atLeastOne("uppercase")
    .atLeastOne("special"),
  password: z
    .password()
    .min(8)
    .atLeastOne("digit")
    .atLeastOne("lowercase")
    .atLeastOne("uppercase")
    .atLeastOne("special"),
});

export class UpdatePasswordUserDto extends createZodDto(
  updatePasswordUserSchema
) {}

export class CreateUserDto extends createZodDto(createUserSchema) {}

export class LoginUserDto extends createZodDto(loginUserSchema) {}

export class LoginUserResponseDto extends createZodDto(
  loginResponseUserSchema
) {}

export class UpdateUserDto extends createZodDto(updateUserSchema) {}

export class RemoveUserDto extends createZodDto(removeUserSchema) {}

export class GetUserDto extends createZodDto(getUserSchema) {}

export class DeleteUserDto extends createZodDto(deleteUserSchema) {}

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
  email_token: string | null;
}

export type ConfirmAccountResponse = Promise<boolean>;

export type ConfirmChangePasswordResponse = Promise<boolean>;

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
  email_token: string | null;
}

export type AskResetPasswordResponse = Promise<{
  email_token: string | null;
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
  email_token: string | null;
  @ApiProperty({ type: "string", format: "password" })
  password: string;
}

/**
 * UPDATE EMAIL
 */

export const updateEmail = z.object({
  id: z.number(),
  email: z.string().email(),
});

export class UpdateEmailUserDto extends createZodDto(updateEmail) {}
export type ConfirmChangeEmailResponse = Promise<boolean>;
