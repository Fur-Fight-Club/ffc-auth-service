import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

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
