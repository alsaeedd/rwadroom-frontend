import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Heart,
  Layers,
  Lock,
  Sparkles,
  Target,
} from "lucide-react";

export const metadata = {
  title: "About — Rwad Room",
  description: "Why we built a curated SME community for Bahrain.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-foreground text-white">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 py-20 sm:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent mb-4">
            About Rwad Room
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05]">
            A curated room for Bahrain&rsquo;s SMEs
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl">
            We built Rwad Room because the noisiest part of growing a business shouldn&rsquo;t be
            finding the right people to talk to.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-4xl px-5 sm:px-8 py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent mb-3">
              Our mission
            </p>
            <h2 className="text-3xl font-bold tracking-tight">
              Quality over quantity, every time.
            </h2>
          </div>
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              The Bahraini SME ecosystem has plenty of events, accelerators, and Telegram groups.
              What it lacks is a single place where every introduction is warm, every resource is
              vetted, and every discount is real.
            </p>
            <p>
              That&rsquo;s what Rwad Room is. A small, deliberately curated community where every
              member, mentor, and partner has been reviewed by a human before they appear in front
              of you.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent mb-3">
              What we value
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Four ideas we keep coming back to
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <ValueCard
              icon={<Lock className="h-5 w-5" />}
              title="No public contact details"
              body="We coordinate every introduction. Members&rsquo; emails, phones, and DMs stay private — period."
            />
            <ValueCard
              icon={<Compass className="h-5 w-5" />}
              title="Curation as a feature"
              body="Every profile is reviewed by an admin before it appears anywhere public."
            />
            <ValueCard
              icon={<Heart className="h-5 w-5" />}
              title="Bahrain-first, GCC-aware"
              body="We start where we are. Mentors, partners, resources — all relevant to the region."
            />
            <ValueCard
              icon={<Target className="h-5 w-5" />}
              title="Honest pricing"
              body="One annual fee for SMEs. No tiers, no upsells. Mentors and partners are listed free."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-5 sm:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent mb-3">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Three steps from sign-up to your first introduction
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Step n={1} title="Apply">
            Tell us about your startup or your mentoring practice. We review every application
            personally.
          </Step>
          <Step n={2} title="Get approved">
            Once you&rsquo;re in, your profile is published to the community directory.
          </Step>
          <Step n={3} title="Connect">
            Browse partners, book mentor sessions, download resources — all on the platform.
          </Step>
        </div>
      </section>

      {/* Roadmap snapshot */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent mb-3">
              Roadmap
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Where we&rsquo;re headed</h2>
          </div>
          <div className="space-y-4">
            <RoadmapRow phase="Phase 1" title="MVP — community, resources, and referrals">
              Annual subscriptions, mentor and partner profiles, resources hub, and admin-managed
              introductions.
            </RoadmapRow>
            <RoadmapRow phase="Phase 2" title="Mentor monetization & partner dashboards">
              Pay-as-you-go mentor sessions, partner self-service, deeper analytics, member
              contributions to the resources hub.
            </RoadmapRow>
            <RoadmapRow phase="Phase 3" title="Tiers, events, and regional expansion">
              Multiple membership tiers, in-person and virtual events, automated payments, and
              regional rollouts.
            </RoadmapRow>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-20">
        <div className="rounded-3xl bg-foreground text-white p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute -right-24 -top-16 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
          <div className="relative">
            <Sparkles className="h-7 w-7 text-accent mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Sound like your kind of room?</h2>
            <p className="mt-3 text-white/70 max-w-xl mx-auto">
              Apply now and we&rsquo;ll review your application within a few business days.
            </p>
            <Link
              href="/join"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-accent/90 transition-all"
            >
              Apply to join <ArrowRight className="h-4 w-4" />
            </Link>
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
    <div className="rounded-2xl bg-white border border-border p-6 hover:shadow-md transition-all">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted leading-relaxed">{body}</p>
    </div>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-7">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white font-bold mb-5">
        {n}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{children}</p>
    </div>
  );
}

function RoadmapRow({
  phase,
  title,
  children,
}: {
  phase: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white border border-border p-6 flex flex-col sm:flex-row gap-5 sm:items-start">
      <div className="shrink-0 sm:w-32">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
          <Layers className="h-3 w-3" /> {phase}
        </div>
      </div>
      <div className="flex-1">
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

