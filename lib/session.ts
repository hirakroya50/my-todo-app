import { auth } from "@/auth";
import { ForbiddenError } from "@/lib/errors";

export async function requireUserId() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new ForbiddenError("Unauthorized");
  }
  return userId;
}
