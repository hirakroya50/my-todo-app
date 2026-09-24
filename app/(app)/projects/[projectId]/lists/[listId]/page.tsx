import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { ChecklistPageClient } from "@/components/checklist/checklist-page";
import { getListForUser, getProjectForUser } from "@/lib/permissions";
import * as addonService from "@/lib/services/project-addon.service";
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

  const project = await getProjectForUser(session.user.id, projectId);
  if (!project) notFound();

  const tree = await listService.getFullTree(session.user.id, listId);
  const addons = await addonService.listProjectAddons(
    session.user.id,
    projectId,
  );

  return (
    <ChecklistPageClient
      projectId={projectId}
      projectAddons={addons.map((a) => ({
        id: a.id,
        type: a.type,
        sortOrder: a.sortOrder,
        textContent: a.textContent,
        url: a.url,
        imageUrl: a.imageUrl,
      }))}
      tree={tree}
    />
  );
}
