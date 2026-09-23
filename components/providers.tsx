"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import { SuppressExtensionErrors } from "@/components/suppress-extension-errors";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SuppressExtensionErrors />
      {children}
      <Toaster richColors position="top-center" />
    </ThemeProvider>
  );
}
