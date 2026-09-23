import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { getProjectForUser } from "@/lib/permissions";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";

export default async function ProjectHubPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { projectId } = await params;
  const project = await getProjectForUser(session.user.id, projectId);
  if (!project) notFound();

  const lists = await db.todoList.findMany({
    where: { projectId },
    orderBy: { sortOrder: "asc" },
  });

  if (lists.length === 1) {
    redirect(`/projects/${projectId}/lists/${lists[0].id}`);
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">{project.name}</h1>
      <p className="text-sm text-muted-foreground">Todo lists in this project</p>
      <ul className="space-y-2">
        {lists.map((list) => (
          <li key={list.id}>
            <Link href={`/projects/${projectId}/lists/${list.id}`}>
              <Button variant="outline">{list.title}</Button>
            </Link>
          </li>
        ))}
      </ul>
      {lists.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No lists yet. Create one from the sidebar.
        </p>
      )}
    </div>
  );
}
