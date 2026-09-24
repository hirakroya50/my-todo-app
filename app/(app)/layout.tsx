import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SidebarNav } from "@/components/sidebar-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PanelLeftIcon } from "lucide-react";
import { APP_DISPLAY_NAME } from "@/lib/constants/app";
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
      <aside className="hidden w-44 shrink-0 flex-col border-r border-primary/10 bg-gradient-to-b from-primary/5 to-card/50 md:flex">
        <div className="flex h-10 shrink-0 items-center gap-1.5 border-b border-primary/10 px-2">
          <span
            className="flex size-6 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-primary-foreground"
          >
            B
          </span>
          <span className="text-sm font-bold tracking-tight text-primary">
            {APP_DISPLAY_NAME}
          </span>
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
              <div className="border-b px-2 py-2 text-sm font-bold text-primary">
                {APP_DISPLAY_NAME}
              </div>
              <div className="h-[calc(100%-2.25rem)]">
                <SidebarNav projects={sidebarProjects} userLabel={userLabel} />
              </div>
            </SheetContent>
          </Sheet>
          <span className="ml-2 truncate text-sm font-bold text-primary">
            {APP_DISPLAY_NAME}
          </span>
        </div>
        <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
