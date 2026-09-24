import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { toActionError } from "@/lib/errors";
import * as addonService from "@/lib/services/project-addon.service";

export async function POST(
  request: Request,
  context: { params: Promise<{ projectId: string }> },
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { projectId } = await context.params;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "INVALID_FILE" }, { status: 400 });
    }

    const addon = await addonService.uploadImageAddon(userId, projectId, file);
    return NextResponse.json({ addon });
  } catch (error) {
    const body = toActionError(error);
    const status = body.error === "NOT_FOUND" ? 404 : 400;
    return NextResponse.json(body, { status });
  }
}
