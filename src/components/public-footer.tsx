import Link from "next/link";
import { Logo } from "@/components/logo";

export function PublicFooter() {
  return (
    <footer className="bg-foreground text-white/70 mt-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo width={140} color="#ffffff" />
          <p className="mt-4 text-sm text-white/50 max-w-xs">
            The community, resources, and referral platform built for Bahrain&rsquo;s startups
            and SMEs.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
            Explore
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/community" className="hover:text-white transition-colors">
                Community
              </Link>
            </li>
            <li>
              <Link href="/partners" className="hover:text-white transition-colors">
                Partners
              </Link>
            </li>
            <li>
              <Link href="/mentors" className="hover:text-white transition-colors">
                Mentors
              </Link>
            </li>
            <li>
              <Link href="/resources" className="hover:text-white transition-colors">
                Resources
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
            Get Started
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/join" className="hover:text-white transition-colors">
                Join the community
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white transition-colors">
                Sign in
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
            About
          </h4>
          <p className="text-sm text-white/50">Based in Bahrain. English. Annual subscription.</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Rwad Room. All rights reserved.
          </p>
          <p className="text-xs text-white/40">Pioneer your path.</p>
        </div>
      </div>
    </footer>
  );
}
