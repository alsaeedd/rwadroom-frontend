"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import { INTRODUCTION_STATUS_LABEL } from "@/lib/enums";
import type {
  Introduction,
  PaginatedResponse,
  Resource,
  StartupProfile,
} from "@/lib/types";
import {
  ArrowRight,
  ArrowRightLeft,
  BookOpen,
  CheckCircle2,
  CreditCard,
  Gauge,
  Handshake,
  GraduationCap,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

interface SubscriptionStatus {
  subscriptionRequired: boolean;
  subscriptionActive?: boolean;
  subscription?: {
    id: string;
    status: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
  } | null;
}

const introStatusVariant: Record<string, "success" | "warning" | "info" | "danger" | "neutral"> = {
  PENDING: "warning",
  IN_PROGRESS: "info",
  COMPLETED: "success",
  DECLINED: "danger",
};

export default function StartupDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [profile, setProfile] = useState<StartupProfile | null>(null);
  const [subStatus, setSubStatus] = useState<SubscriptionStatus | null>(null);
  const [recentIntros, setRecentIntros] = useState<Introduction[]>([]);
  const [recentResources, setRecentResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      api<StartupProfile>("/users/profile"),
      api<SubscriptionStatus>("/subscriptions/status"),
      api<PaginatedResponse<Introduction>>("/introductions?limit=3"),
      api<PaginatedResponse<Resource>>("/resources?limit=3"),
    ])
      .then(([p, s, i, r]) => {
        if (p.status === "fulfilled") setProfile(p.value);
        if (s.status === "fulfilled") setSubStatus(s.value);
        if (i.status === "fulfilled") setRecentIntros(i.value.data);
        if (r.status === "fulfilled") setRecentResources(r.value.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const profileCompletion = computeProfileCompletion(profile);
  const subActive = subStatus?.subscriptionActive ?? false;
  const periodEnd = subStatus?.subscription?.currentPeriodEnd
    ? new Date(subStatus.subscription.currentPeriodEnd)
    : null;
  const daysLeft = periodEnd
    ? Math.max(0, Math.ceil((periodEnd.getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
    : 0;

  return (
    <div className="space-y-8">
      {/* Hero — branded gradient with personalized greeting */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-[#0F2E9B] p-8 sm:p-10 text-white">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -left-8 bottom-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60 mb-2">
            {greetingForTime()}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Welcome back, {user?.firstName}
          </h1>
          <p className="text-white/70 mt-3 max-w-xl">
            {subActive
              ? "Your community access is active. Explore partner discounts, request mentor sessions, and tap into the resources hub."
              : "Activate your annual subscription to unlock partner discounts, mentor sessions, and the full resources library."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {!subActive && (
              <Link
                href="/dashboard/subscription"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-accent/90 transition-all"
              >
                <CreditCard className="h-4 w-4" /> Activate Subscription
              </Link>
            )}
            <Link
              href="/dashboard/partners"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold text-white border border-white/20 hover:bg-white/15 transition-all"
            >
              <Handshake className="h-4 w-4" /> Browse Partners
            </Link>
            <Link
              href="/dashboard/mentors"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold text-white border border-white/20 hover:bg-white/15 transition-all"
            >
              <GraduationCap className="h-4 w-4" /> Find a Mentor
            </Link>
          </div>
        </div>
      </div>

      {/* Status row: profile completion + subscription */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Profile Completion
              </p>
              <h3 className="text-lg font-semibold mt-1">
                {profile ? `${profileCompletion.percent}% complete` : "No profile yet"}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/8">
              <Gauge className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden mb-3">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${profileCompletion.percent}%` }}
            />
          </div>
          {profile ? (
            profileCompletion.missing.length > 0 ? (
              <p className="text-sm text-muted">
                Add {profileCompletion.missing.slice(0, 3).join(", ")}
                {profileCompletion.missing.length > 3 && " and more"} to reach 100%.
              </p>
            ) : (
              <p className="text-sm text-emerald-600 inline-flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Your profile is fully filled out.
              </p>
            )
          ) : (
            <p className="text-sm text-muted">Create your startup profile to get listed in the community directory.</p>
          )}
          <Link
            href="/dashboard/profile"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent transition-colors"
          >
            {profile ? "Edit profile" : "Create profile"} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Card>

        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Subscription
              </p>
              <h3 className="text-lg font-semibold mt-1">
                {subActive ? "Active" : "Not subscribed"}
              </h3>
            </div>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                subActive ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
              }`}
            >
              {subActive ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <AlertTriangle className="h-5 w-5" />
              )}
            </div>
          </div>
          {subActive && periodEnd ? (
            <>
              <p className="text-sm text-muted mb-1">
                Renews on{" "}
                <span className="font-medium text-foreground">
                  {periodEnd.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </p>
              <p className="text-sm text-muted">
                <span className="font-medium text-foreground">{daysLeft}</span> day
                {daysLeft === 1 ? "" : "s"} left
              </p>
            </>
          ) : (
            <p className="text-sm text-muted">
              Activate your annual subscription to unlock all member features.
            </p>
          )}
          <Link
            href="/dashboard/subscription"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent transition-colors"
          >
            Manage subscription <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Card>
      </div>

      {/* Activity row: recent intros + recent resources */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Your Recent Requests</h3>
            </div>
            <Link
              href="/dashboard/introductions"
              className="text-xs font-semibold text-primary hover:text-accent"
            >
              View all
            </Link>
          </div>
          {recentIntros.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted">No introduction requests yet.</p>
              <Link
                href="/dashboard/partners"
                className="mt-2 inline-block text-sm font-semibold text-primary hover:text-accent"
              >
                Find a partner →
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {recentIntros.map((intro) => (
                <li key={intro.id}>
                  <Link
                    href={`/dashboard/introductions/${intro.id}`}
                    className="flex items-center justify-between rounded-xl border border-border px-3.5 py-3 hover:border-primary/30 hover:bg-primary/[0.02] transition-all"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {intro.target?.firstName} {intro.target?.lastName}
                      </p>
                      <p className="text-xs text-muted truncate">
                        {intro.type === "MENTOR_SESSION" ? "Mentor session" : "Partner intro"} ·{" "}
                        {new Date(intro.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={introStatusVariant[intro.status]}>
                      {INTRODUCTION_STATUS_LABEL[intro.status]}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Latest Resources</h3>
            </div>
            <Link
              href="/dashboard/resources"
              className="text-xs font-semibold text-primary hover:text-accent"
            >
              Browse all
            </Link>
          </div>
          {recentResources.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted">No resources yet.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {recentResources.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/dashboard/resources/${r.id}`}
                    className="flex items-start justify-between gap-3 rounded-xl border border-border px-3.5 py-3 hover:border-primary/30 hover:bg-primary/[0.02] transition-all"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{r.title}</p>
                      {r.description && (
                        <p className="text-xs text-muted line-clamp-1 mt-0.5">{r.description}</p>
                      )}
                    </div>
                    <Badge variant={r.visibility === "PUBLIC" ? "info" : "neutral"}>
                      {r.visibility === "PUBLIC" ? "Open" : "Members"}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Bottom CTA — only when subscribed and profile complete */}
      {subActive && profileCompletion.percent === 100 && (
        <div className="rounded-3xl bg-gradient-to-r from-accent/10 to-primary/5 p-6 sm:p-8 border border-accent/15">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-lg">You&rsquo;re all set up!</h3>
              <p className="text-sm text-muted mt-1">
                Your profile is complete and you&rsquo;re an active member. Start exploring the community.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function greetingForTime(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function computeProfileCompletion(profile: StartupProfile | null): {
  percent: number;
  missing: string[];
} {
  if (!profile) return { percent: 0, missing: [] };
  const checks: { label: string; ok: boolean }[] = [
    { label: "company name", ok: !!profile.companyName },
    { label: "description", ok: !!profile.description && profile.description.length > 30 },
    { label: "sector", ok: !!profile.sector },
    { label: "business stage", ok: !!profile.businessStage },
    { label: "logo", ok: !!profile.logoUrl },
    { label: "website", ok: !!profile.website },
    { label: "locations", ok: profile.locations?.length > 0 },
  ];
  const filled = checks.filter((c) => c.ok).length;
  const percent = Math.round((filled / checks.length) * 100);
  const missing = checks.filter((c) => !c.ok).map((c) => c.label);
  return { percent, missing };
}

