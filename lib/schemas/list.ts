import { z } from "zod";

import { titleSchema } from "@/lib/schemas/common";

export const createListSchema = z.object({
  title: titleSchema,
  mode: z.enum(["template", "blank"]),
});

export const updateListSchema = z.object({
  title: titleSchema.optional(),
});
