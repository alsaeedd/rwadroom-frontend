"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Logo } from "@/components/logo";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("Render error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="px-5 sm:px-8 py-6">
        <Logo width={130} />
      </div>
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-6">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Something went wrong</h1>
          <p className="mt-3 text-muted">
            We&rsquo;ve been notified and we&rsquo;ll look into it. You can try again or head
            back home.
          </p>
          {error?.digest && (
            <p className="mt-3 text-xs text-muted">
              Error reference: <code className="font-mono">{error.digest}</code>
            </p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-all"
            >
              <RefreshCcw className="h-4 w-4" /> Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-white border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary/30 transition-all"
            >
              <Home className="h-4 w-4" /> Go home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
