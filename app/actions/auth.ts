"use server";

import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { toActionError } from "@/lib/errors";
import { registerSchema } from "@/lib/schemas/auth";

export async function registerUser(input: unknown) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const message =
      issue?.path[0] === "email"
        ? "Invalid email address"
        : issue?.path[0] === "password"
          ? "Password must be at least 8 characters"
          : "Invalid sign-up details";
    return { error: "VALIDATION" as const, message };
  }

  try {
    const data = parsed.data;
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
