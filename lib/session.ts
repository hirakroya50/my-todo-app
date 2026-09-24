import { ensureAppUserId } from "@/lib/app-user";

/** @deprecated Use ensureAppUserId; kept for server actions that still pass an owner id. */
export async function requireUserId() {
  return ensureAppUserId();
}
