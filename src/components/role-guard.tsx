"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, getDashboardPath, type Role } from "@/lib/auth";
import { FullPageSpinner } from "@/components/ui/spinner";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: Role[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      router.replace(getDashboardPath(user.role));
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router]);

  if (isLoading) return <FullPageSpinner />;
  if (!isAuthenticated || !user) return <FullPageSpinner />;
  if (!allowedRoles.includes(user.role)) return <FullPageSpinner />;

  return <>{children}</>;
}
