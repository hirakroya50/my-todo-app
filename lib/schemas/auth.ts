import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(128),
  name: z.string().trim().min(1).max(120).optional(),
});

export const credentialsLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});
