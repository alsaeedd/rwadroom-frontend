"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import {
  ArrowRightLeft,
  Clock,
  FileText,
  Handshake,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { AnalyticsOverview } from "@/lib/types";

export default function AdminDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<AnalyticsOverview>("/admin/analytics/overview")
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const cards = [
    {
      label: "Total Users",
      value: data?.users.total ?? 0,
      sub: `${data?.newSignupsLast30Days ?? 0} new in the last 30 days`,
      icon: Users,
      href: "/admin/users",
    },
    {
      label: "Pending Approvals",
      value: data?.pendingApprovals.total ?? 0,
      sub: `${data?.pendingApprovals.startups ?? 0} startups · ${
        data?.pendingApprovals.mentors ?? 0
      } mentors · ${data?.pendingApprovals.partners ?? 0} partners`,
      icon: Clock,
      href: "/admin/users?status=PENDING",
      highlight: (data?.pendingApprovals.total ?? 0) > 0,
    },
    {
      label: "Active Subscriptions",
      value: data?.subscriptions.active ?? 0,
      sub: `${data?.subscriptions.expired ?? 0} expired · ${
        data?.subscriptions.pendingPayment ?? 0
      } pending`,
      icon: TrendingUp,
      href: "/admin/users?role=STARTUP",
    },
    {
      label: "Pending Introductions",
      value: data?.introductions.pending ?? 0,
      sub: `${data?.introductions.inProgress ?? 0} in progress · ${
        data?.introductions.completed ?? 0
      } completed`,
      icon: ArrowRightLeft,
      href: "/admin/introductions?status=PENDING",
      highlight: (data?.introductions.pending ?? 0) > 0,
    },
  ];

  return (
    <div>
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.firstName}</h1>
          <p className="text-muted mt-1">
            Here&rsquo;s what&rsquo;s happening across Rwad Room today.
          </p>
        </div>
        {user?.isSuperAdmin && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3 w-3" /> Super Admin
          </span>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="group cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all duration-200 h-full">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    {card.label}
                  </p>
                  <p
                    className={`text-3xl font-bold mt-1 ${
                      card.highlight ? "text-accent" : "text-foreground"
                    }`}
                  >
                    {card.value}
                  </p>
                  <p className="text-xs text-muted mt-2 leading-snug">{card.sub}</p>
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl shrink-0 ${
                    card.highlight ? "bg-accent/8 text-accent" : "bg-primary/8 text-primary"
                  }`}
                >
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Composition row */}
      <div className="grid gap-5 lg:grid-cols-2 mb-10">
        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
            User Composition
          </h3>
          <div className="space-y-3">
            {data &&
              (Object.entries(data.users.byRole) as [keyof typeof data.users.byRole, number][]).map(
                ([role, count]) => {
                  const total = Math.max(data.users.total, 1);
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={role}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium capitalize">{role.toLowerCase()}</span>
                        <span className="text-muted">
                          {count} <span className="text-xs">({pct}%)</span>
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                },
              )}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted mb-4">
            Resources Library
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-2xl font-bold">{data?.resources.active ?? 0}</p>
              <p className="text-xs text-muted">Active</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{data?.resources.archived ?? 0}</p>
              <p className="text-xs text-muted">Archived</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{data?.resources.public ?? 0}</p>
              <p className="text-xs text-muted">Public</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{data?.resources.membersOnly ?? 0}</p>
              <p className="text-xs text-muted">Members-only</p>
            </div>
          </div>
          <Link
            href="/admin/resources"
            className="text-sm font-semibold text-primary hover:text-accent transition-colors"
          >
            Manage resources →
          </Link>
        </Card>
      </div>

      {/* Quick actions */}
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/users?status=PENDING">
          <Card className="group cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/8">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Review Approvals</h3>
                <p className="text-sm text-muted">Approve or reject pending users</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/admin/partners/invite">
          <Card className="group cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/8">
                <Handshake className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Invite Partner</h3>
                <p className="text-sm text-muted">Send partner invitations</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/admin/resources">
          <Card className="group cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/8">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Manage Resources</h3>
                <p className="text-sm text-muted">Upload and organize content</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
