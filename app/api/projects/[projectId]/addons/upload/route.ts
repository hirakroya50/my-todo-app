import { NextResponse } from "next/server";

import { toActionError } from "@/lib/errors";
import * as addonService from "@/lib/services/project-addon.service";
import { requireUserId } from "@/lib/session";

export async function POST(
  request: Request,
  context: { params: Promise<{ projectId: string }> },
) {
  const userId = await requireUserId();
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
