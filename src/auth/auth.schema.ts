import { z } from "nestjs-zod/z";
import { userRoleSchema } from "src/user/users.schema";

const sub = z.enum([
  "ffc-analytics-service",
  "ffc-auth-service",
  "ffc-main-service",
  "ffc-notifications-service",
  "ffc-payments-service",
]);

const JWTServicePayloadSchema = z.object({
  iss: z.string(), // Issuer
  aud: z.string(), // Audience
  sub: sub, // Authorized services
});

const JWTUserPayloadSchema = z.object({
  iss: z.string(), // Issuer
  aud: z.string(), // Audience
  sub: z.number(), // User id
  // Add more properties ?
  role: userRoleSchema,
});

export type JWTServicePayload = z.infer<typeof JWTServicePayloadSchema>;

export type JWTUserPayload = z.infer<typeof JWTUserPayloadSchema>;
