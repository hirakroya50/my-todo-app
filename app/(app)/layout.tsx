import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SidebarNav } from "@/components/sidebar-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PanelLeftIcon } from "lucide-react";
import * as projectService from "@/lib/services/project.service";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const projects = await projectService.listProjects(session.user.id);
  const sidebarProjects = projects.map((p) => ({
    id: p.id,
    name: p.name,
    listId: p.todoLists[0]?.id ?? null,
  }));

  const userLabel = session.user.email ?? session.user.name ?? "Account";

  return (
    <div className="flex h-dvh overflow-hidden">
      <aside className="hidden w-44 shrink-0 flex-col border-r bg-card/40 md:flex">
        <div className="flex h-9 shrink-0 items-center border-b px-2">
          <span className="text-xs font-semibold tracking-tight">dev_todo</span>
        </div>
        <div className="min-h-0 flex-1">
          <SidebarNav projects={sidebarProjects} userLabel={userLabel} />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-9 shrink-0 items-center border-b px-2 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="size-8">
                <PanelLeftIcon className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-44 p-0">
              <div className="border-b px-2 py-2 text-xs font-semibold">dev_todo</div>
              <div className="h-[calc(100%-2.25rem)]">
                <SidebarNav projects={sidebarProjects} userLabel={userLabel} />
              </div>
            </SheetContent>
          </Sheet>
          <span className="ml-2 truncate text-xs font-semibold">dev_todo</span>
        </div>
        <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
