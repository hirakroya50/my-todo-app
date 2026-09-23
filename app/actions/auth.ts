"use server";

import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { toActionError } from "@/lib/errors";
import { registerSchema } from "@/lib/schemas/auth";

export async function registerUser(input: unknown) {
  try {
    const data = registerSchema.parse(input);
    const existing = await db.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      return { error: "EMAIL_EXISTS" as const };
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    await db.user.create({
      data: {
        email: data.email,
        name: data.name ?? data.email.split("@")[0],
        passwordHash,
      },
    });
    return { success: true as const };
  } catch (error) {
    const prismaCode =
      error && typeof error === "object" && "code" in error
        ? String((error as { code: string }).code)
        : "";
    if (prismaCode === "P2022") {
      return {
        error: "DATABASE_SCHEMA" as const,
      };
    }
    return toActionError(error);
  }
}
