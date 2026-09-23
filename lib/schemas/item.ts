import { z } from "zod";

import { linkUrlSchema, titleSchema } from "@/lib/schemas/common";

export const createItemSchema = z.object({
  title: titleSchema,
});

export const updateItemSchema = z.object({
  title: titleSchema.optional(),
  linkUrl: z.union([linkUrlSchema(), z.null()]).optional(),
});

export const setCheckedSchema = z.object({
  checked: z.boolean(),
});
