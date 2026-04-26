import Link from "next/link";
import { Logo } from "@/components/logo";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="px-5 sm:px-8 py-6">
        <Logo width={130} />
      </div>
      <div className="flex-1 flex items-center justify-center px-5 sm:px-8">
        <div className="max-w-md text-center">
          <p className="text-[120px] leading-none font-extrabold text-primary/15">404</p>
          <h1 className="text-3xl font-bold tracking-tight mt-2">Page not found</h1>
          <p className="mt-3 text-muted">
            The page you&rsquo;re looking for doesn&rsquo;t exist or may have been moved.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-all"
            >
              <Home className="h-4 w-4" /> Go home
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-white border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary/30 transition-all"
            >
              <ArrowLeft className="h-4 w-4" /> Contact us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
