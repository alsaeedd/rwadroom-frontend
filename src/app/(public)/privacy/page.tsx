import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "Privacy Policy — Rwad Room",
  description: "What personal data Rwad Room collects, why, and the choices you have.",
};

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-foreground text-white">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent mb-4">
            Legal
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-4 text-white/70">Last updated: 13 October 2026</p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-5 sm:px-8 py-16 space-y-10 text-foreground/80 leading-relaxed">
        <p>
          This policy explains what personal data Rwad Room collects, why we collect it and the
          choices you have. Rwad Room is operated by RWAD ROOM E-MARKETPLACE in the Kingdom of
          Bahrain (&ldquo;we&rdquo;, &ldquo;us&rdquo;), which is responsible for your data. We handle
          personal data in line with Bahrain&rsquo;s Personal Data Protection Law (Law No. 30 of
          2018). Please read it together with our{" "}
          <Link href="/terms" className="font-semibold text-primary hover:text-accent">
            Terms of Service
          </Link>
          .
        </p>

        <Section title="1. What we collect">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong className="text-foreground">Account details:</strong> your name, email
              address, account type and password (stored only as a secure hash).
            </li>
            <li>
              <strong className="text-foreground">Profile details:</strong> company name,
              description, sectors, business stage, locations, website, logo and CR number. For
              mentors: title, bio, expertise, languages, photo, and LinkedIn profile or website.
            </li>
            <li>
              <strong className="text-foreground">Activity on the Platform:</strong> session
              bookings, introduction requests, messages you send us, and when you accepted our
              Terms.
            </li>
            <li>
              <strong className="text-foreground">Membership and payments:</strong> subscription
              status, amounts and dates. Card payments are handled by our payment provider. We
              never see or store your full card number.
            </li>
            <li>
              <strong className="text-foreground">Technical data:</strong> IP address, device and
              browser type, and the logs we need to run and secure the service. In the app, a
              device token if you turn on notifications.
            </li>
          </ul>
        </Section>

        <Section title="2. How we use it">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              To create and run your account and to verify profiles, for example by checking a CR
              number or a LinkedIn profile.
            </li>
            <li>
              To show approved profiles in the community directories. You can hide your profile
              from the public listing at any time.
            </li>
            <li>To arrange mentor sessions and introductions and send related emails.</li>
            <li>To manage memberships and payments.</li>
            <li>To keep the Platform secure, prevent abuse and fix problems.</li>
            <li>To meet our legal obligations.</li>
          </ul>
          <p>We do not sell your personal data or use it for third-party advertising.</p>
        </Section>

        <Section title="3. Who we share it with">
          <p>We share personal data only when we need to in order to run the Platform:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong className="text-foreground">Other members:</strong> approved profile details
              appear in the directories. Email addresses and phone numbers are never shown
              publicly. When you book a session or request an introduction, we share your name and
              company with the mentor or partner involved.
            </li>
            <li>
              <strong className="text-foreground">Amazon Web Services (AWS):</strong> hosts our
              servers, database and files in its EU (Ireland) region.
            </li>
            <li>
              <strong className="text-foreground">Resend:</strong> sends our emails, such as
              verification links, password resets and booking confirmations.
            </li>
            <li>
              <strong className="text-foreground">Jitsi:</strong> mentor sessions run on Jitsi
              Meet, an open-source video-calling service hosted by a third-party provider. We do not
              record sessions.
            </li>
            <li>
              <strong className="text-foreground">Our payment provider:</strong> to process
              membership payments.
            </li>
            <li>
              <strong className="text-foreground">Authorities:</strong> when the law requires us to.
            </li>
          </ul>
          <p>
            Because our hosting is in Ireland, your data is stored outside Bahrain, in a country
            with strong data-protection laws.
          </p>
        </Section>

        <Section title="4. How long we keep it">
          <p>
            We keep your data while your account is open. If you delete your account, we delete or
            anonymise your personal data within 30 days. The exception is records we must keep for
            longer by law, such as payment records needed for tax purposes. Backups are overwritten
            on a rolling basis.
          </p>
        </Section>

        <Section title="5. Your rights">
          <p>You can ask us to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>give you a copy of the personal data we hold about you;</li>
            <li>correct data that is wrong or incomplete;</li>
            <li>delete your data;</li>
            <li>stop or limit certain uses of your data; and</li>
            <li>withdraw your consent, where we rely on it.</li>
          </ul>
          <p>
            You can edit most profile details yourself at any time. To make a request, email
            support@rwadroom.com and we will reply within the time the law allows. If you are not
            happy with our reply, you can complain to Bahrain&rsquo;s Personal Data Protection
            Authority.
          </p>
        </Section>

        <Section title="6. Deleting your account">
          <p>
            You can delete your account at any time from your account settings in the Rwad Room app
            or on the website. Deleting your account removes your profile from the directories and
            ends your membership. If you cannot sign in, email support@rwadroom.com from the
            address you registered with and we will help.
          </p>
        </Section>

        <Section title="7. Cookies">
          <p>
            Our website uses only essential cookies: one keeps you securely signed in, and one tells
            the site that you are logged in. We do not use advertising or third-party tracking
            cookies. The mobile app keeps your sign-in token in your device&rsquo;s secure storage
            instead of cookies.
          </p>
        </Section>

        <Section title="8. Children">
          <p>
            Rwad Room is for adults who run or advise businesses. It is not meant for anyone under
            18.
          </p>
        </Section>

        <Section title="9. Changes to this policy">
          <p>
            We will post any changes on this page and update the date at the top. If a change is
            significant, we will also tell you by email or in the app.
          </p>
        </Section>

        <Section title="10. Contact">
          <p>
            Questions or requests about your data? Email us at{" "}
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
