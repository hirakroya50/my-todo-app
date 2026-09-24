"use client";

import { signOut } from "next-auth/react";
import { LogOutIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function SidebarFooter({ userLabel }: { userLabel: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="shrink-0 space-y-1 border-t p-2">
      <p className="truncate px-1 text-[10px] text-muted-foreground" title={userLabel}>
        {userLabel}
      </p>
      <div className="flex gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7"
          aria-label="Toggle theme"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <SunIcon className="size-3.5 dark:hidden" />
          <MoonIcon className="hidden size-3.5 dark:block" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7"
          aria-label="Log out"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOutIcon className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
