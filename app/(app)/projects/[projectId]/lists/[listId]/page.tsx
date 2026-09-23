import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { ChecklistPageClient } from "@/components/checklist/checklist-page";
import { getListForUser } from "@/lib/permissions";
import * as listService from "@/lib/services/todo-list.service";

export default async function ChecklistPage({
  params,
}: {
  params: Promise<{ projectId: string; listId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { projectId, listId } = await params;
  const list = await getListForUser(session.user.id, listId);
  if (!list || list.projectId !== projectId) notFound();

  const tree = await listService.getFullTree(session.user.id, listId);

  return <ChecklistPageClient projectId={projectId} tree={tree} />;
}
