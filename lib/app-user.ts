import { db } from "@/lib/db";

const SHARED_USER_EMAIL = "shared@workspace.local";

/** Owner id for new projects in the public, no-login workspace. */
export async function ensureAppUserId(): Promise<string> {
  const existing = await db.user.findFirst({
    where: { email: SHARED_USER_EMAIL },
    select: { id: true },
  });
  if (existing) return existing.id;

  const user = await db.user.create({
    data: {
      email: SHARED_USER_EMAIL,
      name: "Shared workspace",
    },
  });
  return user.id;
}
