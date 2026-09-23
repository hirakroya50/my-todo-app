"use client";

import { useEffect } from "react";

function isExtensionNoise(reason: unknown): boolean {
  const message =
    reason instanceof Error
      ? reason.message
      : typeof reason === "string"
        ? reason
        : "";
  const stack = reason instanceof Error && reason.stack ? reason.stack : "";
  const combined = `${message}\n${stack}`;
  return (
    combined.includes("chrome-extension://") ||
    combined.includes("moz-extension://") ||
    /metamask/i.test(combined) ||
    /failed to connect to metamask/i.test(combined)
  );
}

/** Stops wallet extensions (e.g. MetaMask) from surfacing as app errors on unrelated pages. */
export function SuppressExtensionErrors() {
  useEffect(() => {
    const onRejection = (event: PromiseRejectionEvent) => {
      if (isExtensionNoise(event.reason)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const onError = (event: ErrorEvent) => {
      if (
        isExtensionNoise(event.error) ||
        (event.filename?.includes("chrome-extension://") ?? false)
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener("unhandledrejection", onRejection);
    window.addEventListener("error", onError, true);
    return () => {
      window.removeEventListener("unhandledrejection", onRejection);
      window.removeEventListener("error", onError, true);
    };
  }, []);

  return null;
}
