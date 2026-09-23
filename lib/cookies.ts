import { cookies } from "next/headers";

import { getProjectForUser } from "@/lib/permissions";

const LAST_PROJECT_COOKIE = "last_project_id";

/** Only call from Server Actions (not from Server Components). For pages, middleware sets the cookie. */
export async function setLastProjectId(userId: string, projectId: string) {
  const project = await getProjectForUser(userId, projectId);
  if (!project) return;
  const store = await cookies();
  store.set(LAST_PROJECT_COOKIE, projectId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function getLastProjectId(userId: string) {
  const store = await cookies();
  const projectId = store.get(LAST_PROJECT_COOKIE)?.value;
  if (!projectId) return null;
  const project = await getProjectForUser(userId, projectId);
  return project?.id ?? null;
}
