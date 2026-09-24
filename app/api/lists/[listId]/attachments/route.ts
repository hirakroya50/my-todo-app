import { NextResponse } from "next/server";

import { toActionError } from "@/lib/errors";
import { requireUserId } from "@/lib/session";
import * as attachmentService from "@/lib/services/attachment.service";

export async function POST(
  request: Request,
  context: { params: Promise<{ listId: string }> },
) {
  const userId = await requireUserId();
  const { listId } = await context.params;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const todoItemId = formData.get("todoItemId");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "INVALID_FILE" }, { status: 400 });
    }

    const attachment = await attachmentService.uploadAttachment(
      userId,
      listId,
      file,
      typeof todoItemId === "string" && todoItemId.length > 0
        ? todoItemId
        : undefined,
    );

    return NextResponse.json({ attachment });
  } catch (error) {
    const body = toActionError(error);
    const status = body.error === "NOT_FOUND" ? 404 : 400;
    return NextResponse.json(body, { status });
  }
}
