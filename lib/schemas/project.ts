import { z } from "zod";

import { nameSchema, reorderSchema } from "@/lib/schemas/common";

export const createProjectSchema = z.object({
  name: nameSchema,
});

export const updateProjectSchema = z.object({
  name: nameSchema.optional(),
});

export const updateProjectNotesSchema = z.object({
  notes: z.string().max(50_000).nullable(),
});

export const reorderProjectsSchema = reorderSchema;
