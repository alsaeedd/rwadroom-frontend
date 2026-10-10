import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CreditCard,
  GraduationCap,
  Handshake,
  Lock,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Join — Rwad Room",
  description: "Apply to join Rwad Room as a startup, mentor, or partner.",
};

export default function JoinPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden isolate">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary via-primary to-[#0F2E9B]" />
        <div className="absolute -right-24 -top-24 -z-10 h-[420px] w-[420px] rounded-full bg-accent/30 blur-[120px]" />

        <div className="mx-auto max-w-4xl px-5 sm:px-8 py-20 sm:py-28 text-white">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-xs font-semibold border border-white/20 mb-6">
            <Sparkles className="h-3 w-3 text-accent" /> Apply to join
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05]">
            Join the Rwad Room community
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/80 leading-relaxed max-w-2xl">
            Pick the path that fits you. Every application is reviewed by a human within a few
            business days.
          </p>
        </div>
      </section>

      {/* Three paths */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* SME card — paid */}
          <div className="rounded-3xl bg-white border-2 border-accent p-7 flex flex-col relative overflow-hidden">
            <span className="absolute -top-px right-6 bg-accent text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-b-lg">
              Most common
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent mb-5">
              <CreditCard className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold mb-1">Startup or SME</h3>
            <p className="text-xs uppercase tracking-wider text-muted font-semibold mb-4">
              Annual subscription
            </p>
            <p className="text-sm text-muted leading-relaxed mb-5">
              Get listed in the community, book mentor sessions, unlock partner discounts, and
              access the full resources library.
            </p>
            <ul className="space-y-2 mb-6 text-sm">
              <Bullet>Access to mentor sessions</Bullet>
              <Bullet>Unlock partner discounts</Bullet>
              <Bullet>Full members-only resources hub</Bullet>
              <Bullet>Public listing in community directory</Bullet>
            </ul>
            <p className="text-3xl font-bold tracking-tight mb-5">
              BHD 99<span className="text-base text-muted font-normal"> / year</span>
            </p>
            <Link
              href="/register?role=STARTUP"
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-accent/90 transition-all"
            >
              Apply as startup <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mentor card — free */}
          <div className="rounded-3xl bg-white border border-border p-7 flex flex-col">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 text-primary mb-5">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold mb-1">Mentor</h3>
            <p className="text-xs uppercase tracking-wider text-muted font-semibold mb-4">
              Listed free
            </p>
            <p className="text-sm text-muted leading-relaxed mb-5">
              Be discoverable by Bahrain&rsquo;s most promising founders. Set your availability and
              members book you directly.
            </p>
            <ul className="space-y-2 mb-6 text-sm">
              <Bullet>Free public listing</Bullet>
              <Bullet>Members book your open time slots</Bullet>
              <Bullet>Showcase expertise + industry focus</Bullet>
              <Bullet>Optional community discount note</Bullet>
            </ul>
            <p className="text-3xl font-bold tracking-tight mb-5">Free</p>
            <Link
              href="/register?role=MENTOR"
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-all"
            >
              Apply as mentor <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Partner card — by invite */}
          <div className="rounded-3xl bg-foreground text-white border border-foreground p-7 flex flex-col">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-accent mb-5">
              <Handshake className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold mb-1">Partner Company</h3>
            <p className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-4">
              By invite only
            </p>
            <p className="text-sm text-white/70 leading-relaxed mb-5">
              Offer a discount to Bahrain&rsquo;s SMEs and earn referrals through the Rwad Room
              admin team.
            </p>
            <ul className="space-y-2 mb-6 text-sm">
              <BulletDark>Free public listing</BulletDark>
              <BulletDark>Admin-coordinated introductions</BulletDark>
              <BulletDark>Reach a vetted member base</BulletDark>
              <BulletDark>Referral fees on successful intros</BulletDark>
            </ul>
            <p className="text-3xl font-bold tracking-tight mb-5">Free</p>
            <Link
              href="/contact"
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-accent/90 transition-all"
            >
              Request invite <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* What members get */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent mb-3">
              Member benefits
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              What&rsquo;s included in the BHD 99 / year membership
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Benefit
              icon={<Handshake className="h-5 w-5" />}
              title="Partner discounts"
              body="Verified discounts from Bahrain-based partner companies."
            />
            <Benefit
              icon={<GraduationCap className="h-5 w-5" />}
              title="Mentor sessions"
              body="Book 30-minute sessions with vetted mentors — pick an open slot and get a video link instantly."
            />
            <Benefit
              icon={<BookOpen className="h-5 w-5" />}
              title="Full resources library"
              body="Templates, frameworks, and guides — beyond the public preview."
            />
            <Benefit
              icon={<Lock className="h-5 w-5" />}
              title="Private contact"
              body="Your contact details aren’t listed publicly — they’re shared only when you book a session or an introduction is made."
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 sm:px-8 py-16">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent mb-3">
            Common questions
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">FAQs</h2>
        </div>

        <div className="space-y-3">
          <Faq q="Who can join Rwad Room?">
            Bahrain-based startups and SMEs can apply for paid membership. Mentors and partner
            companies are listed free of charge during MVP.
          </Faq>
          <Faq q="What does membership cost?">
            BHD 99 / year for SMEs. Mentors and partners are free.
          </Faq>
          <Faq q="How do mentor sessions work?">
            Subscribed members book a mentor&rsquo;s open time slot directly on the platform and
            instantly get a private video link and a calendar invite — no waiting on coordination.
          </Faq>
          <Faq q="How long does approval take?">
            We review applications personally — typically within a few business days.
          </Faq>
          <Faq q="Can I cancel my subscription?">
            Yes — your subscription runs for the year you paid for and won&rsquo;t auto-renew
            without your action.
          </Faq>
        </div>
      </section>
    </>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
      <span className="text-foreground/80">{children}</span>
    </li>
  );
}

function BulletDark({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
      <span className="text-white/80">{children}</span>
    </li>
  );
}

function Benefit({
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
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{body}</p>
    </div>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-2xl bg-white border border-border px-5 py-4 hover:border-primary/30 transition-colors">
      <summary className="flex items-center justify-between cursor-pointer font-semibold list-none">
        {q}
        <span className="text-muted group-open:rotate-180 transition-transform">▾</span>
      </summary>
      <p className="mt-3 text-sm text-muted leading-relaxed">{children}</p>
    </details>
  );
}
