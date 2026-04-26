"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import {
  INDUSTRY_FOCUS_LABEL,
  LANGUAGE_LABEL,
  PROFILE_STATUS_LABEL,
} from "@/lib/enums";
import type { MentorProfile } from "@/lib/types";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Gauge,
  GraduationCap,
  Sparkles,
  UserCircle,
} from "lucide-react";

export default function MentorDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [profile, setProfile] = useState<MentorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<MentorProfile>("/users/profile")
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

  const completion = computeMentorCompletion(profile);
  const isApproved = profile?.status === "APPROVED";
  const isVisible = isApproved && profile?.isPubliclyVisible;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-[#0F2E9B] p-8 sm:p-10 text-white">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60 mb-2">
            {greetingForTime()} · Mentor
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Welcome, {user?.firstName}
          </h1>
          <p className="text-white/70 mt-3 max-w-xl">
            {isApproved
              ? "Your profile is live. Startups can request sessions through the platform — our team will coordinate every introduction."
              : "Once an admin approves your profile, you&rsquo;ll be listed in the public mentor directory."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/mentor/profile"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-accent/90 transition-all"
            >
              <UserCircle className="h-4 w-4" /> Edit Profile
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
            <p className="text-sm text-muted">Create your mentor profile to get listed.</p>
          )}
          <Link
            href="/mentor/profile"
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
                      ? "You appear in the public mentor directory."
                      : "You&rsquo;ve hidden yourself from the public directory."}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted">Create your profile to get listed publicly.</p>
          )}
        </Card>
      </div>

      {/* Profile snapshot */}
      {profile && (
        <Card>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" /> Your Mentor Snapshot
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            {profile.title && (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted mb-1">Title</p>
                <p>{profile.title}</p>
              </div>
            )}
            {profile.languages.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted mb-1">Languages</p>
                <p>{profile.languages.map((l) => LANGUAGE_LABEL[l]).join(", ")}</p>
              </div>
            )}
            {profile.expertise.length > 0 && (
              <div className="sm:col-span-2">
                <p className="text-xs uppercase tracking-wide text-muted mb-2">Expertise</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.expertise.map((e) => (
                    <Badge key={e} variant="neutral">
                      {e}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {profile.industryFocus.length > 0 && (
              <div className="sm:col-span-2">
                <p className="text-xs uppercase tracking-wide text-muted mb-2">Industry Focus</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.industryFocus.map((i) => (
                    <Badge key={i} variant="info">
                      {INDUSTRY_FOCUS_LABEL[i]}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* How it works */}
      {profile && isApproved && (
        <Card>
          <h3 className="font-semibold mb-3">How session requests work</h3>
          <ol className="space-y-2.5 text-sm text-muted">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold shrink-0 text-xs">
                1
              </span>
              <span>A subscribed startup submits a session request through Rwad Room.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold shrink-0 text-xs">
                2
              </span>
              <span>The Rwad Room team reviews the purpose and reaches out to coordinate.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold shrink-0 text-xs">
                3
              </span>
              <span>You and the startup connect off-platform — we handle the introduction.</span>
            </li>
          </ol>
        </Card>
      )}

      {/* Default helpful card when nothing else fills the page */}
      {!profile && (
        <Card>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent shrink-0">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Get listed in two minutes</h3>
              <p className="text-sm text-muted">
                Add a short bio, your areas of expertise, and the languages you speak. An admin
                will approve your profile and startups will be able to request sessions through
                Rwad Room.
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

function computeMentorCompletion(profile: MentorProfile | null): {
  percent: number;
  missing: string[];
} {
  if (!profile) return { percent: 0, missing: [] };
  const checks: { label: string; ok: boolean }[] = [
    { label: "title", ok: !!profile.title },
    { label: "bio", ok: !!profile.bio && profile.bio.length > 30 },
    { label: "expertise", ok: profile.expertise?.length > 0 },
    { label: "industry focus", ok: profile.industryFocus?.length > 0 },
    { label: "languages", ok: profile.languages?.length > 0 },
    { label: "photo", ok: !!profile.photoUrl },
  ];
  const filled = checks.filter((c) => c.ok).length;
  const percent = Math.round((filled / checks.length) * 100);
  const missing = checks.filter((c) => !c.ok).map((c) => c.label);
  return { percent, missing };
}
