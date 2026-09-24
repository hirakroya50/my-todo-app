"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function SidebarFooter() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="shrink-0 border-t p-2">
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
    </div>
  );
}
