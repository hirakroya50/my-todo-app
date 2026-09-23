import { z } from "zod";

export const idSchema = z.string().cuid();

export const nameSchema = z.string().trim().min(1).max(120);

export const titleSchema = z.string().trim().min(1).max(200);

export const sortOrderInputSchema = z.object({
  id: idSchema,
  sortOrder: z.number().int().min(0),
});

export const reorderSchema = z.object({
  orders: z.array(sortOrderInputSchema).min(1),
});

export function linkUrlSchema() {
  const isProd = process.env.NODE_ENV === "production";
  return z
    .string()
    .trim()
    .url()
    .refine(
      (url) => {
        if (!isProd) return true;
        return url.startsWith("https://");
      },
      { message: "HTTPS required in production" },
    );
}
