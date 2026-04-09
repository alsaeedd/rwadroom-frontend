"use client";

import { useAuthStore } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Building2 } from "lucide-react";

export default function PartnerDashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Partner Dashboard</h1>
        <p className="text-muted mt-1">Welcome back, {user?.firstName}.</p>
      </div>

      <Card>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-primary/10 to-primary/5">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <p className="text-muted">Your partner dashboard is coming soon.</p>
        </div>
      </Card>
    </div>
  );
}
