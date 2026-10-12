import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "Terms of Service — Rwad Room",
  description: "The terms that apply when you use Rwad Room.",
};

export default function TermsPage() {
  return (
    <>
      <section className="bg-foreground text-white">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent mb-4">
            Legal
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">Terms of Service</h1>
          <p className="mt-4 text-white/70">Last updated: 13 October 2026</p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-5 sm:px-8 py-16 space-y-10 text-foreground/80 leading-relaxed">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of Rwad Room, including the
          website at rwadroom.com and the Rwad Room mobile app (together, the &ldquo;Platform&rdquo;).
          The Platform is operated by RWAD ROOM E-MARKETPLACE, a company registered in the Kingdom
          of Bahrain (&ldquo;Rwad Room&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;).
        </p>

        <Section title="1. Accepting these terms">
          <p>
            By creating an account or using the Platform, you agree to these Terms and to our{" "}
            <Link href="/privacy" className="font-semibold text-primary hover:text-accent">
              Privacy Policy
            </Link>
            . If you use the Platform for a company, you confirm you may accept these Terms on its
            behalf. We may update these Terms and will tell you about significant changes by email
            or in the app before they take effect. Continuing to use the Platform means you accept
            the updated Terms.
          </p>
        </Section>

        <Section title="2. Eligibility and account types">
          <p>
            You must be at least 18 years old and able to enter into a binding contract. There are
            four types of account:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong className="text-foreground">Startup / SME:</strong> businesses that join as
              paying members.
            </li>
            <li>
              <strong className="text-foreground">Mentor:</strong> experienced professionals who
              offer guidance to members.
            </li>
            <li>
              <strong className="text-foreground">Partner:</strong> companies that offer discounts
              or services to members. Partners join by invitation.
            </li>
            <li>
              <strong className="text-foreground">Admin:</strong> Rwad Room staff who review
              accounts and run the Platform.
            </li>
          </ul>
          <p>
            Keep your information accurate and your password safe. You are responsible for
            activity on your account.
          </p>
        </Section>

        <Section title="3. Verification and approval">
          <p>
            Rwad Room is a curated community, and we review every profile before it is listed.
            Startups, SMEs and partners must provide a valid Bahrain commercial registration (CR)
            number. Mentors must provide a LinkedIn profile or a website so we can check their
            background. We may ask for more information, and we may approve, reject or remove any
            profile at our discretion, including when we cannot verify it.
          </p>
        </Section>

        <Section title="4. Membership, free trial, fees and refunds">
          <p>
            Startup / SME membership costs BHD 99 per year. New members can use the Platform free
            for 7 days. To keep access after the trial, you need to pay the annual fee. Membership
            lasts 12 months from payment, and we will remind you before it ends so you can renew at
            the fee then in force.
          </p>
          <p>
            Fees are not refundable, including for unused time, except where a refund is required
            by law. Listing as a mentor or partner is free.
          </p>
        </Section>

        <Section title="5. Mentor obligations">
          <p>If you are a mentor, you agree to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>give honest, good-faith guidance within your areas of expertise;</li>
            <li>attend the sessions you accept, on time;</li>
            <li>keep your profile, availability and any member offer accurate;</li>
            <li>tell the member about any conflict of interest; and</li>
            <li>
              not present your guidance as regulated legal, financial or medical advice unless you
              are licensed to give it and say so clearly.
            </li>
          </ul>
          <p>Mentors are independent. They are not employees or agents of Rwad Room.</p>

          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5 sm:p-6 space-y-3">
            <h3 className="font-bold text-foreground">Non-solicitation and non-poaching</h3>
            <p>
              While you are a mentor on Rwad Room, and for 12 months after your mentor account
              ends, you must not, directly or indirectly:
            </p>
            <ol className="list-[lower-alpha] pl-5 space-y-1.5">
              <li>
                solicit, poach, recruit or divert any Rwad Room member, startup or SME, or any of
                their staff, into private engagements, client relationships or paid services
                outside the Platform;
              </li>
              <li>
                offer services that compete with Rwad Room to people you met through the Platform;
                or
              </li>
              <li>
                use information about members that you obtained through the Platform for any of
                these purposes.
              </li>
            </ol>
            <p>
              If a member approaches you about working together outside the Platform, contact us
              at support@rwadroom.com before agreeing to anything. A breach of this clause is
              grounds for immediate removal, and we may seek any remedy available under the laws
              of the Kingdom of Bahrain.
            </p>
          </div>
        </Section>

        <Section title="6. Confidentiality">
          <p>
            Treat business plans, figures and ideas shared with you through the Platform as
            confidential: use them only for the purpose they were shared for, and do not disclose
            them without the owner&rsquo;s permission. This does not cover information that is
            already public or that the law requires you to disclose, and it continues after your
            account closes.
          </p>
        </Section>

        <Section title="7. Sessions, bookings and cancellations">
          <p>
            Members book mentor sessions through the Platform, at times the mentor makes available.
            Sessions take place by video call using the link in the booking. If you cannot attend,
            cancel as early as you can (ideally 24 hours before) with a short reason. Repeated
            no-shows or late cancellations may lead to restrictions on your account. Rwad Room
            arranges bookings but is not a party to the advice given in a session.
          </p>
        </Section>

        <Section title="8. Partner offers and codes">
          <p>
            Partners set the details of their offers. They are responsible for honouring them and
            for the products and services they provide. Offers and discount codes are for
            members&rsquo; own use only: do not share, publish or resell them. We may remove an
            offer that is misleading or not honoured. A purchase from a partner is a contract
            between you and that partner.
          </p>
        </Section>

        <Section title="9. Resources and content ownership">
          <p>
            Guides, templates and other resources on the Platform belong to Rwad Room or its
            licensors. Members may use them for their own business but may not resell or republish
            them.
          </p>
          <p>
            You keep ownership of the content you add, such as your profile and logo, and give us a
            non-exclusive, royalty-free licence to display it on the Platform and to promote the
            community (for example, your logo in the members directory while your profile is
            public). You confirm you have the right to share what you upload.
          </p>
        </Section>

        <Section title="10. Acceptable use">
          <p>You must not:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>give false or misleading information, or pretend to be someone else;</li>
            <li>harass, abuse or discriminate against anyone;</li>
            <li>send spam or unsolicited promotions;</li>
            <li>scrape the Platform or collect members&rsquo; data;</li>
            <li>upload malware, or try to break or get around our security; or</li>
            <li>use the Platform for anything unlawful.</li>
          </ul>
        </Section>

        <Section title="11. Termination and account deletion">
          <p>
            You can delete your account at any time from the app or the website. We may suspend or
            close an account that breaks these Terms, gives false information or puts other members
            at risk. A closed account&rsquo;s public profile is removed, and we handle its data as
            our Privacy Policy describes. The non-solicitation, confidentiality, disclaimer and
            liability clauses survive closure.
          </p>
        </Section>

        <Section title="12. Disclaimers and limitation of liability">
          <p>
            The Platform is provided &ldquo;as is&rdquo;. We review profiles, but we do not
            guarantee what members, mentors or partners say, the outcome of any session,
            introduction or offer, or that the Platform will always be available. Mentor guidance
            is general information, not professional advice; your business decisions are your
            own.
          </p>
          <p>
            To the extent the law allows, Rwad Room is not liable for indirect or consequential
            losses, lost profits or lost data. Our total liability to you is limited to the fees you
            paid us in the 12 months before the claim. Nothing in these Terms limits any liability
            that cannot be limited under the laws of the Kingdom of Bahrain.
          </p>
        </Section>

        <Section title="13. Governing law">
          <p>
            These Terms are governed by the laws of the Kingdom of Bahrain. The courts of the
            Kingdom of Bahrain have exclusive jurisdiction over any dispute arising from them.
          </p>
        </Section>

        <Section title="14. Contact">
          <p>
            Questions about these Terms? Email us at{" "}
            <span className="font-semibold text-foreground">support@rwadroom.com</span>.
          </p>
        </Section>
      </article>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
      {children}
    </section>
  );
}
