"use client";

import { useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useAuthStore, type Role } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Handshake,
  LogOut,
  Menu,
  X,
  KeyRound,
  Users,
  FileText,
  ArrowRightLeft,
  Building2,
  CreditCard,
  BookOpen,
  GraduationCap,
  UserCircle,
} from "lucide-react";

// Dashboard root paths need exact match; sub-pages use startsWith
const dashboardRoots = new Set(["/admin", "/dashboard", "/mentor/dashboard", "/partner/dashboard"]);

function isNavActive(pathname: string, href: string): boolean {
  if (dashboardRoots.has(href)) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

const navByRole: Record<Role, NavItem[]> = {
  ADMIN: [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "Users", href: "/admin/users", icon: <Users className="h-4 w-4" /> },
    { label: "Resources", href: "/admin/resources", icon: <FileText className="h-4 w-4" /> },
    { label: "Introductions", href: "/admin/introductions", icon: <ArrowRightLeft className="h-4 w-4" /> },
    { label: "Invite Partner", href: "/admin/partners/invite", icon: <Handshake className="h-4 w-4" /> },
    { label: "Change Password", href: "/admin/change-password", icon: <KeyRound className="h-4 w-4" /> },
  ],
  STARTUP: [
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "My Profile", href: "/dashboard/profile", icon: <Building2 className="h-4 w-4" /> },
    { label: "Subscription", href: "/dashboard/subscription", icon: <CreditCard className="h-4 w-4" /> },
    { label: "Resources", href: "/dashboard/resources", icon: <BookOpen className="h-4 w-4" /> },
    { label: "Partners", href: "/dashboard/partners", icon: <Handshake className="h-4 w-4" /> },
    { label: "Mentors", href: "/dashboard/mentors", icon: <GraduationCap className="h-4 w-4" /> },
    { label: "Introductions", href: "/dashboard/introductions", icon: <ArrowRightLeft className="h-4 w-4" /> },
    { label: "Change Password", href: "/dashboard/change-password", icon: <KeyRound className="h-4 w-4" /> },
  ],
  MENTOR: [
    { label: "Dashboard", href: "/mentor/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "My Profile", href: "/mentor/profile", icon: <UserCircle className="h-4 w-4" /> },
    { label: "Change Password", href: "/mentor/change-password", icon: <KeyRound className="h-4 w-4" /> },
  ],
  PARTNER: [
    { label: "Dashboard", href: "/partner/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "My Profile", href: "/partner/profile", icon: <Building2 className="h-4 w-4" /> },
    { label: "Change Password", href: "/partner/change-password", icon: <KeyRound className="h-4 w-4" /> },
  ],
};

export function DashboardShell({ children, role }: { children: ReactNode; role: Role }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = navByRole[role] || [];

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <div className="flex h-screen bg-dashboard">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/30 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — Ink dark */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-foreground transition-transform duration-300 ease-out lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <Logo width={130} color="#ffffff" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/50 hover:text-white transition-colors duration-200 cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 p-3 overflow-y-auto">
          {navItems.map((item) => {
            const active = isNavActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                prefetch={true}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium cursor-pointer",
                  "transition-all duration-150 ease-out",
                  active
                    ? "bg-primary text-white shadow-[0_2px_8px_rgba(26,63,196,0.4)]"
                    : "text-white/55 hover:bg-white/[0.07] hover:text-white/90",
                )}
              >
                <span className={cn("transition-transform duration-150", active && "scale-110")}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="mb-3 rounded-xl bg-white/6 px-3.5 py-3">
            <p className="text-sm font-semibold truncate text-white">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-white/40 truncate mt-0.5">{user?.email}</p>
            <span className="mt-1.5 inline-block rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
              {user?.role}
            </span>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-white/40 hover:text-danger hover:bg-white/5" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile header */}
        <header className="sticky top-0 z-20 flex items-center gap-3 bg-white border-b border-border px-4 py-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-foreground cursor-pointer" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <Logo width={110} />
        </header>

        <div className="p-6 lg:p-8 animate-[fadeIn_200ms_ease-out]">{children}</div>
      </main>
    </div>
  );
}
