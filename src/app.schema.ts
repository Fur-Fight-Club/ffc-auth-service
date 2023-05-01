import { z } from "nestjs-zod/z";

export const serverHealthcheckSchema = z.object({
  server_status: z.number(),
  prisma_status: z.number(),
  timestamp: z.date(),
});

export type ServerHealthcheck = z.infer<typeof serverHealthcheckSchema>;
