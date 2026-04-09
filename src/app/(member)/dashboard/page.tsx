"use client";

import { useAuthStore } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Rocket } from "lucide-react";

export default function StartupDashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted mt-1">Welcome back, {user?.firstName}.</p>
      </div>

      <Card>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/8">
            <Rocket className="h-5 w-5 text-primary" />
          </div>
          <p className="text-muted">Your startup dashboard is coming soon.</p>
        </div>
      </Card>
    </div>
  );
}
