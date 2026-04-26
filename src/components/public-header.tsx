"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { useAuthStore, getDashboardPath } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const NAV = [
  { label: "About", href: "/about" },
  { label: "Community", href: "/community" },
  { label: "Partners", href: "/partners" },
  { label: "Mentors", href: "/mentors" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

export function PublicHeader() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-lg border-b border-border/60">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 flex items-center justify-between h-16">
        <Logo width={130} />

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  active
                    ? "text-primary"
                    : "text-foreground/70 hover:text-foreground hover:bg-foreground/[0.03]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTAs */}
        <div className="hidden lg:flex items-center gap-2">
          {!isLoading && isAuthenticated && user ? (
            <Link
              href={getDashboardPath(user.role)}
              className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-all"
            >
              Open Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/join"
                className="inline-flex items-center rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 transition-all shadow-[0_2px_8px_rgba(255,87,51,0.2)]"
              >
                Join the community
              </Link>
            </>
          )}
        </div>

        <button
          className="lg:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden border-t border-border bg-white">
          <nav className="flex flex-col px-5 py-4 gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-foreground/[0.03] rounded-lg"
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-border mt-2 pt-3 flex flex-col gap-2">
              {!isLoading && isAuthenticated && user ? (
                <Link
                  href={getDashboardPath(user.role)}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Open Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="px-3 py-2.5 text-sm font-medium text-foreground"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/join"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    Join the community
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
