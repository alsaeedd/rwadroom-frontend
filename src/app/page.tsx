"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, getDashboardPath } from "@/lib/auth";
import { FullPageSpinner } from "@/components/ui/spinner";

/**
 * Root entry point. Authenticated users go to their role-appropriate
 * dashboard; visitors land on the public site.
 */
export default function Home() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated && user) {
      router.replace(getDashboardPath(user.role));
    } else {
      router.replace("/about");
    }
  }, [isLoading, isAuthenticated, user, router]);

  return <FullPageSpinner />;
}
