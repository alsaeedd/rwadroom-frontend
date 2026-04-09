"use client";

import { useAuthStore } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Clock, GraduationCap } from "lucide-react";

export default function MentorDashboardPage() {
  const user = useAuthStore((s) => s.user);

  if (user?.status === "PENDING") {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Pending Approval</h1>
        </div>
        <Card>
          <div className="text-center py-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-accent/15 to-accent/5 shadow-[0_0_30px_rgba(252,203,10,0.12)]">
              <Clock className="h-7 w-7 text-accent" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your account is pending approval</h2>
            <p className="text-muted text-sm max-w-md mx-auto leading-relaxed">
              An administrator will review your application shortly.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Mentor Dashboard</h1>
        <p className="text-muted mt-1">Welcome back, {user?.firstName}.</p>
      </div>

      <Card>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-primary/10 to-primary/5">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <p className="text-muted">Your mentor dashboard is coming soon.</p>
        </div>
      </Card>
    </div>
  );
}
