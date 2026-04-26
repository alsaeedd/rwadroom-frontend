"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { PaginatedResponse, StartupListing } from "@/lib/types";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  Compass,
  Globe,
  GraduationCap,
  Handshake,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export default function LandingPage() {
  const [members, setMembers] = useState<StartupListing[]>([]);

  useEffect(() => {
    api<PaginatedResponse<StartupListing>>("/users/startups?limit=12")
      .then((r) => setMembers(r.data))
      .catch(() => setMembers([]));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary via-primary to-[#0F2E9B]" />
        <div className="absolute -right-24 -top-24 -z-10 h-[420px] w-[420px] rounded-full bg-accent/30 blur-[120px]" />
        <div className="absolute -left-32 bottom-0 -z-10 h-[320px] w-[320px] rounded-full bg-white/10 blur-[100px]" />

        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-24 sm:py-32 text-white">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-xs font-semibold border border-white/20">
              <Sparkles className="h-3 w-3 text-accent" /> Built for Bahrain&rsquo;s SMEs
            </span>
            <h1 className="mt-6 text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05]">
              Pioneer your path<span className="text-accent">.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/80 leading-relaxed max-w-2xl">
              Rwad Room is a curated community of Bahraini startups, mentors, and partners. One
              annual membership unlocks discounts, mentor sessions, and a hand-picked library of
              resources.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/join"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-accent/90 transition-all"
              >
                Join the community <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-white border border-white/20 hover:bg-white/15 transition-all"
              >
                What is Rwad Room?
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent mb-3">
            What you get
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything an early-stage SME needs in one room
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ValueCard
            icon={<Handshake className="h-5 w-5" />}
            title="Partner Discounts"
            body="Exclusive deals from companies that want to support Bahraini startups."
          />
          <ValueCard
            icon={<GraduationCap className="h-5 w-5" />}
            title="Mentor Sessions"
            body="Request introductions to vetted mentors with real operating experience."
          />
          <ValueCard
            icon={<BookOpen className="h-5 w-5" />}
            title="Curated Resources"
            body="Templates, frameworks, and guides — all verified by the Rwad Room team."
          />
          <ValueCard
            icon={<Compass className="h-5 w-5" />}
            title="Trusted Introductions"
            body="Every connection is warm-handed by an admin. No noise, no spam."
          />
        </div>
      </section>

      {/* Who this is for */}
      <section className="bg-foreground text-white py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent mb-3">
              Who&rsquo;s in the room
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Three sides of an ecosystem, one platform
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <RoleCard
              title="Startups & SMEs"
              tag="Annual subscribers"
              body="Get discovered, request mentor sessions, and unlock partner discounts."
              icon={<Building2 className="h-5 w-5" />}
              href="/join"
              cta="Apply to join"
            />
            <RoleCard
              title="Mentors"
              tag="Listed free"
              body="Be discoverable by Bahrain&rsquo;s most promising founders. Admin-coordinated sessions."
              icon={<GraduationCap className="h-5 w-5" />}
              href="/join"
              cta="Apply as mentor"
            />
            <RoleCard
              title="Partners"
              tag="By invite"
              body="Offer your discount to a vetted community of subscribers. Referrals coordinated by admin."
              icon={<Handshake className="h-5 w-5" />}
              href="/contact"
              cta="Become a partner"
            />
          </div>
        </div>
      </section>

      {/* Members preview */}
      {members.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 sm:px-8 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent mb-3">
                Trusted by builders
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Community members</h2>
            </div>
            <Link
              href="/community"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent transition-colors"
            >
              See all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {members.slice(0, 12).map((m) => (
              <Link
                key={m.id}
                href={`/community/${m.id}`}
                className="aspect-square rounded-2xl border border-border bg-white flex items-center justify-center p-4 hover:border-primary/30 hover:shadow-md transition-all"
                title={m.companyName}
              >
                {m.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.logoUrl} alt={m.companyName} className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-xs font-semibold text-foreground/60 text-center line-clamp-2">
                    {m.companyName}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Why subscribe */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent mb-3">
              Why subscribe
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              An honest membership in a noisy ecosystem
            </h2>
            <p className="mt-5 text-lg text-muted leading-relaxed">
              The annual subscription keeps the community small, vetted, and focused. Every
              mentor, every partner, every resource is curated by the Rwad Room team.
            </p>
            <div className="mt-8 grid gap-4">
              <Bullet text="Annual subscription, no upsells, no surprises." />
              <Bullet text="Admin-coordinated introductions — no DMs, no spam." />
              <Bullet text="Quality control: every listing reviewed before going live." />
              <Bullet text="Bahrain-first, GCC-aware. Built for the local context." />
            </div>
          </div>
          <div>
            <div className="rounded-3xl bg-white p-8 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  <TrendingUp className="h-3 w-3" /> Annual Membership
                </span>
                <span className="text-xs text-muted">SMEs only</span>
              </div>
              <p className="text-5xl font-bold tracking-tight">
                BHD <span className="text-primary">99</span>
                <span className="text-base text-muted font-normal"> / year</span>
              </p>
              <p className="mt-3 text-sm text-muted">
                Includes everything: discounts, mentor sessions, resources hub, and admin-coordinated intros.
              </p>
              <Link
                href="/join"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-all"
              >
                Apply now <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-3 text-xs text-muted text-center">
                <Globe className="inline h-3 w-3 mr-1" /> Mentors and Partners are listed free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-20">
        <div className="rounded-3xl bg-foreground text-white p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute -right-24 -top-16 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Ready to join the room?
            </h2>
            <p className="mt-3 text-white/70 max-w-xl mx-auto">
              Apply today and get curated access to Bahrain&rsquo;s SME community.
            </p>
            <div className="mt-8 flex justify-center gap-3 flex-wrap">
              <Link
                href="/join"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-accent/90 transition-all"
              >
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-white border border-white/20 hover:bg-white/15 transition-all"
              >
                Talk to us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ValueCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl bg-white border border-border p-6 hover:shadow-md hover:border-primary/30 transition-all">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted leading-relaxed">{body}</p>
    </div>
  );
}

function RoleCard({
  title,
  tag,
  body,
  icon,
  href,
  cta,
}: {
  title: string;
  tag: string;
  body: string;
  icon: React.ReactNode;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-7 hover:bg-white/[0.07] transition-all">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent mb-5">
        {icon}
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">{tag}</p>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-sm text-white/70 leading-relaxed mb-5">{body}</p>
      <Link
        href={href}
        className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
      >
        {cta} <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
      <span className="text-sm text-foreground/80">{text}</span>
    </div>
  );
}
