import { z } from "zod";

export const createTextAddonSchema = z.object({
  textContent: z.string().max(50_000).optional(),
});

export const createUrlAddonSchema = z.object({
  url: z.string().url().max(2048),
});

export const updateTextAddonSchema = z.object({
  textContent: z.string().max(50_000),
});

export const updateUrlAddonSchema = z.object({
  url: z.string().url().max(2048),
});
