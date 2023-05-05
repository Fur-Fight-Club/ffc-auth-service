import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

/**
 * CONFIRM ACCOUNT TYPES
 */
export const confirmAccount = z.object({
  email_token: z.string(),
})

export class ConfirmAccountDto extends createZodDto(confirmAccount) { }
export type ConfirmAccountType = z.infer<typeof confirmAccount>;