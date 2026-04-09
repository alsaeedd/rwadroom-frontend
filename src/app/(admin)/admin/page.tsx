"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Users, Handshake, Shield, FileText, ArrowRightLeft, Clock } from "lucide-react";
import Link from "next/link";
import type { PaginatedResponse, AdminUser } from "@/lib/types";

interface DashboardStats {
  totalUsers: number;
  pendingApprovals: number;
  totalResources: number;
  pendingIntroductions: number;
}

export default function AdminDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    pendingApprovals: 0,
    totalResources: 0,
    pendingIntroductions: 0,
  });

  useEffect(() => {
    // Fetch counts in parallel
    Promise.allSettled([
      api<PaginatedResponse<AdminUser>>("/admin/users?limit=1"),
      api<PaginatedResponse<AdminUser>>("/admin/users?status=PENDING&limit=1"),
      api<PaginatedResponse<unknown>>("/admin/resources?limit=1").catch(() => ({ meta: { total: 0 } })),
      api<PaginatedResponse<unknown>>("/admin/introductions?status=PENDING&limit=1").catch(() => ({ meta: { total: 0 } })),
    ]).then(([usersRes, pendingRes, resourcesRes, introsRes]) => {
      setStats({
        totalUsers: usersRes.status === "fulfilled" ? usersRes.value.meta.total : 0,
        pendingApprovals: pendingRes.status === "fulfilled" ? pendingRes.value.meta.total : 0,
        totalResources: resourcesRes.status === "fulfilled" ? (resourcesRes.value as PaginatedResponse<unknown>).meta.total : 0,
        pendingIntroductions: introsRes.status === "fulfilled" ? (introsRes.value as PaginatedResponse<unknown>).meta.total : 0,
      });
    });
  }, []);

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      href: "/admin/users",
    },
    {
      label: "Pending Approvals",
      value: stats.pendingApprovals,
      icon: Clock,
      href: "/admin/users?status=PENDING",
      highlight: stats.pendingApprovals > 0,
    },
    {
      label: "Resources",
      value: stats.totalResources,
      icon: FileText,
      href: "/admin/resources",
    },
    {
      label: "Pending Introductions",
      value: stats.pendingIntroductions,
      icon: ArrowRightLeft,
      href: "/admin/introductions",
      highlight: stats.pendingIntroductions > 0,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted mt-1">Welcome back, {user?.firstName}.</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="group cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">{card.label}</p>
                  <p className={`text-3xl font-bold mt-1 ${card.highlight ? "text-accent" : "text-foreground"}`}>
                    {card.value}
                  </p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.highlight ? "bg-accent/8 text-accent" : "bg-primary/8 text-primary"}`}>
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
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
