"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import { PROFILE_STATUS_LABEL, SECTOR_LABEL } from "@/lib/enums";
import type { PartnerProfile } from "@/lib/types";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Gauge,
  Handshake,
  Sparkles,
} from "lucide-react";

export default function PartnerDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<PartnerProfile>("/users/profile")
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const completion = computePartnerCompletion(profile);
  const isApproved = profile?.status === "APPROVED";
  const isVisible = isApproved && profile?.isPubliclyVisible;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-[#0F2E9B] p-8 sm:p-10 text-white">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60 mb-2">
            {greetingForTime()} · Partner
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Welcome, {user?.firstName}
          </h1>
          <p className="text-white/70 mt-3 max-w-xl">
            {isApproved
              ? "Your discount is live for the Rwad Room community. Subscribers can request introductions through the platform — we coordinate every connection."
              : "Once an admin approves your profile, your company will appear in the public partners directory."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/partner/profile"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-accent/90 transition-all"
            >
              <Building2 className="h-4 w-4" /> Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Status row */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Profile Completion
              </p>
              <h3 className="text-lg font-semibold mt-1">
                {profile ? `${completion.percent}% complete` : "No profile yet"}
              </h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/8">
              <Gauge className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden mb-3">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${completion.percent}%` }}
            />
          </div>
          {profile ? (
            completion.missing.length > 0 ? (
              <p className="text-sm text-muted">
                Add {completion.missing.slice(0, 3).join(", ")}
                {completion.missing.length > 3 && " and more"} to reach 100%.
              </p>
            ) : (
              <p className="text-sm text-emerald-600 inline-flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Your profile is fully filled out.
              </p>
            )
          ) : (
            <p className="text-sm text-muted">Create your partner profile to get listed.</p>
          )}
          <Link
            href="/partner/profile"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent transition-colors"
          >
            {profile ? "Edit profile" : "Create profile"} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Card>

        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Listing Status
              </p>
              <h3 className="text-lg font-semibold mt-1">
                {profile ? PROFILE_STATUS_LABEL[profile.status] : "Not created"}
              </h3>
            </div>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                isVisible
                  ? "bg-emerald-50 text-emerald-600"
                  : profile?.status === "PENDING"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-gray-50 text-gray-400"
              }`}
            >
              {isVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            </div>
          </div>
          {profile ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Badge
                  variant={
                    profile.status === "APPROVED"
                      ? "success"
                      : profile.status === "REJECTED"
                        ? "danger"
                        : "warning"
                  }
                >
                  {PROFILE_STATUS_LABEL[profile.status]}
                </Badge>
                {isApproved && (
                  <Badge variant={profile.isPubliclyVisible ? "success" : "neutral"}>
                    {profile.isPubliclyVisible ? "Visible" : "Hidden"}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted">
                {profile.status === "PENDING"
                  ? "An admin will review your profile shortly."
                  : profile.status === "REJECTED"
                    ? "Your profile is currently hidden. Update your details and reach out to support."
                    : profile.isPubliclyVisible
                      ? "Your company appears in the public partners directory."
                      : "You&rsquo;ve hidden your company from the public directory."}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted">Create your profile to get listed publicly.</p>
          )}
        </Card>
      </div>

      {/* Discount snapshot */}
      {profile && (
        <Card>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" /> Your Community Offer
          </h3>
          <div className="rounded-2xl bg-accent/8 border border-accent/20 px-5 py-5">
            <p className="text-xs uppercase tracking-wide text-accent font-semibold mb-1">
              Discount
            </p>
            <p className="text-foreground font-medium">{profile.discountDescription}</p>
            {profile.discountCode && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 border border-accent/20">
                <span className="text-xs uppercase text-muted">Code</span>
                <code className="font-mono text-sm font-bold text-accent">
                  {profile.discountCode}
                </code>
              </div>
            )}
          </div>
          {profile.serviceCategory && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-muted">Listed under:</span>
              <Badge variant="info">{SECTOR_LABEL[profile.serviceCategory]}</Badge>
            </div>
          )}
        </Card>
      )}

      {/* How it works */}
      {profile && isApproved && (
        <Card>
          <h3 className="font-semibold mb-3">How introductions work</h3>
          <ol className="space-y-2.5 text-sm text-muted">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold shrink-0 text-xs">
                1
              </span>
              <span>
                A subscribed startup discovers your discount and requests an introduction through
                Rwad Room.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold shrink-0 text-xs">
                2
              </span>
              <span>
                The Rwad Room team verifies the request and reaches out to you to coordinate.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold shrink-0 text-xs">
                3
              </span>
              <span>You and the startup connect off-platform with the introduction warm-handed.</span>
            </li>
          </ol>
        </Card>
      )}

      {!profile && (
        <Card>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent shrink-0">
              <Handshake className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Get your discount in front of Bahrain&rsquo;s startups</h3>
              <p className="text-sm text-muted">
                Add a short description of your company, the discount you offer to Rwad Room
                members, and a service category. Once approved, you&rsquo;ll be listed publicly and
                discoverable by every member.
              </p>
            </div>
          </div>
        </Card>
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

function computePartnerCompletion(profile: PartnerProfile | null): {
  percent: number;
  missing: string[];
} {
  if (!profile) return { percent: 0, missing: [] };
  const checks: { label: string; ok: boolean }[] = [
    { label: "company name", ok: !!profile.companyName },
    { label: "service category", ok: !!profile.serviceCategory },
    { label: "description", ok: !!profile.description && profile.description.length > 30 },
    { label: "discount", ok: !!profile.discountDescription && profile.discountDescription.length > 5 },
    { label: "logo", ok: !!profile.logoUrl },
    { label: "website", ok: !!profile.website },
  ];
  const filled = checks.filter((c) => c.ok).length;
  const percent = Math.round((filled / checks.length) * 100);
  const missing = checks.filter((c) => !c.ok).map((c) => c.label);
  return { percent, missing };
}
