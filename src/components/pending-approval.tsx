"use client";

import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/lib/auth";
import { CheckCircle2, Clock, LogOut } from "lucide-react";

const pendingKeyframes = `
@keyframes pendingGlow {
  0%, 100% { transform: scale(1); opacity: 0.12; }
  50% { transform: scale(1.5); opacity: 0; }
}
@keyframes pendingOrbit {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes pendingOrbitReverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}
@keyframes pendingBreath {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.06); opacity: 0.85; }
}
`;

const steps = [
  { label: "Account Created", done: true },
  { label: "Email Verified", done: true },
  { label: "Under Review", active: true },
  { label: "You're In!", done: false },
];

export function PendingApprovalScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <div className="bg-auth flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <style dangerouslySetInnerHTML={{ __html: pendingKeyframes }} />
      <div className="mb-8">
        <Logo width={160} />
      </div>

      <Card className="w-full max-w-lg">
        {/* Branded mark with orbital animation */}
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center">
          <div className="relative flex h-24 w-24 items-center justify-center">
            {/* Glow pulse */}
            <div
              className="absolute h-24 w-24 rounded-full bg-primary/10"
              style={{ animation: "pendingGlow 3s cubic-bezier(0.4,0,0.2,1) infinite" }}
            />

            {/* Orbit dot */}
            <div
              className="absolute h-20 w-20"
              style={{ animation: "pendingOrbit 5s linear infinite" }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-primary/30" />
            </div>

            {/* Second orbit — counter, accent */}
            <div
              className="absolute h-16 w-16"
              style={{ animation: "pendingOrbitReverse 3.5s linear infinite" }}
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-accent/40" />
            </div>

            {/* The mark */}
            <div
              className="relative text-primary"
              style={{ animation: "pendingBreath 2.5s cubic-bezier(0.4,0,0.2,1) infinite" }}
            >
              <svg width="44" height="44" viewBox="0 0 120 120" fill="none">
                <path
                  d="M10 60C10 26.9 26.9 10 60 10H100C104.4 10 108 13.6 108 18V60C108 93.1 91.1 110 58 110H18C13.6 110 10 106.4 10 102V60Z"
                  fill="currentColor"
                />
                <path
                  d="M52 82V58.5C52 52.5 55.5 48 62.5 48C64.5 48 66 48.3 67.5 49L67 56C65.8 55.3 64.2 55 62.5 55C58 55 56 58 56 62V82H52Z"
                  fill="white" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                />
                <circle cx="55" cy="42" r="4" fill="white" />
              </svg>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-center text-2xl font-bold tracking-tight text-foreground">
          Application Received
        </h1>

        <p className="text-center text-sm leading-relaxed text-muted max-w-sm mx-auto mt-3">
          Welcome, <span className="font-semibold text-foreground">{user?.firstName}</span>.
          Your application is being reviewed. We&apos;ll have you up and running shortly.
        </p>

        {/* Progress steps */}
        <div className="mt-8 flex flex-col gap-0">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    step.done
                      ? "bg-primary/10 text-primary"
                      : step.active
                        ? ""
                        : "bg-muted/10 text-muted/30"
                  }`}
                  style={step.active ? { backgroundColor: "rgba(217,119,6,0.1)", color: "#D97706" } : undefined}
                >
                  {step.done ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : step.active ? (
                    <Clock className="h-4 w-4" style={{ animation: "pendingOrbit 6s linear infinite", color: "#D97706" }} />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-current" />
                  )}
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-px grow min-h-5 ${step.done ? "bg-primary/20" : "bg-border"}`} />
                )}
              </div>

              <p
                className={`pt-0.5 text-sm font-medium pb-4 ${
                  step.done
                    ? "text-primary"
                    : step.active
                      ? ""
                      : "text-muted/40"
                }`}
                style={step.active ? { color: "#D97706" } : undefined}
              >
                {step.label}
                {step.active && (
                  <span className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: "rgba(217,119,6,0.1)", color: "#D97706" }}>
                    In Progress
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Reassurance */}
        <div className="mt-4 rounded-xl bg-primary/3 px-5 py-4 border border-primary/8">
          <p className="text-[13px] leading-relaxed text-muted text-center">
            Most applications are reviewed within <span className="font-semibold text-foreground">24 hours</span>.
            We&apos;ll send you an email as soon as you&apos;re approved.
          </p>
        </div>

        {/* Sign out */}
        <div className="mt-8 flex justify-center">
          <Button variant="ghost" size="sm" className="text-muted hover:text-danger" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </Card>

      <p className="mt-8 text-xs text-muted/60">
        Rwad Room — Pioneer your path.
      </p>
    </div>
  );
}
