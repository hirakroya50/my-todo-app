"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { authErrorMessage } from "@/lib/auth-errors";

export function LoginAuthNotice({ authError }: { authError?: string }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const handled = useRef(false);

  useEffect(() => {
    if (!authError || handled.current) return;
    handled.current = true;

    const text = authErrorMessage(authError);
    if (!text) return;

    setMessage(text);
    toast.error(text, { duration: 8000 });

    router.replace("/login", { scroll: false });
  }, [authError, router]);

  if (!message) return null;

  return (
    <div
      role="alert"
      className="mb-4 rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2.5 text-sm leading-snug text-destructive"
    >
      {message}
    </div>
  );
}
