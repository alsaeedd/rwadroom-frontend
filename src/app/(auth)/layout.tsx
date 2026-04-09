"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, getDashboardPath } from "@/lib/auth";
import { Logo } from "@/components/logo";
import { FullPageSpinner } from "@/components/ui/spinner";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.replace(getDashboardPath(user.role));
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) return <FullPageSpinner />;
  if (isAuthenticated) return <FullPageSpinner />;

  return (
    <div className="bg-auth flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8">
        <Logo width={160} />
      </div>
      <div className="w-full max-w-md">{children}</div>

      <p className="mt-8 text-xs text-muted/60">
        Rwad Room — Pioneer your path.
      </p>
    </div>
  );
}
