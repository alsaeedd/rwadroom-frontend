"use client";

import type { ReactNode } from "react";
import { RoleGuard } from "@/components/role-guard";
import { DashboardShell } from "@/components/dashboard-shell";
import { PendingApprovalScreen } from "@/components/pending-approval";
import { useAuthStore } from "@/lib/auth";

function PartnerContent({ children }: { children: ReactNode }) {
  const status = useAuthStore((s) => s.user?.status);

  if (status === "PENDING") {
    return <PendingApprovalScreen />;
  }

  return <DashboardShell role="PARTNER">{children}</DashboardShell>;
}

export default function PartnerLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={["PARTNER"]}>
      <PartnerContent>{children}</PartnerContent>
    </RoleGuard>
  );
}
