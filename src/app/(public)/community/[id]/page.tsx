"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { BUSINESS_STAGE_LABEL, COUNTRY_LABEL, SECTOR_LABEL } from "@/lib/enums";
import type { StartupListing } from "@/lib/types";
import { ArrowLeft, Building2, Globe, MapPin } from "lucide-react";

export default function CommunityMemberPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [member, setMember] = useState<StartupListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api<StartupListing>(`/users/startups/${id}`)
      .then(setMember)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (notFound || !member) {
    return (
      <div className="mx-auto max-w-3xl px-5 sm:px-8 py-20 text-center">
        <Building2 className="h-10 w-10 text-muted mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Member not found</h1>
        <p className="text-muted mb-6">
          This profile may have been removed or made private.
        </p>
        <Link
          href="/community"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" /> Back to community
        </Link>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-5 sm:px-8 py-12 sm:py-16">
      <button
        onClick={() => router.push("/community")}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-accent transition-colors mb-8 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Back to community
      </button>

      <div className="rounded-3xl bg-white border border-border p-8 sm:p-10">
        <div className="flex items-start gap-5 mb-6">
          {member.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.logoUrl}
              alt={member.companyName}
              className="h-20 w-20 rounded-2xl object-cover bg-background"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/8 text-primary">
              <Building2 className="h-8 w-8" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {member.companyName}
            </h1>
            <div className="mt-2 flex flex-wrap gap-2">
              {member.sector && (
                <Badge variant="info">{SECTOR_LABEL[member.sector]}</Badge>
              )}
              {member.businessStage && (
                <Badge variant="neutral">{BUSINESS_STAGE_LABEL[member.businessStage]}</Badge>
              )}
            </div>
          </div>
        </div>

        {member.description && (
          <p className="text-foreground/80 leading-relaxed mb-6">{member.description}</p>
        )}

        <div className="grid sm:grid-cols-2 gap-4 pt-6 border-t border-border">
          {member.locations?.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wide text-muted mb-2 inline-flex items-center gap-1.5">
                <MapPin className="h-3 w-3" /> Locations
              </p>
              <p className="text-sm">
                {member.locations.map((c) => COUNTRY_LABEL[c]).join(", ")}
              </p>
            </div>
          )}
          {member.website && (
            <div>
              <p className="text-xs uppercase tracking-wide text-muted mb-2 inline-flex items-center gap-1.5">
                <Globe className="h-3 w-3" /> Website
              </p>
              <a
                href={member.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:text-accent break-all"
              >
                {member.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-background border border-border px-6 py-5 text-sm text-muted text-center">
        Want to connect? Members&rsquo; contact details stay private.{" "}
        <Link href="/contact" className="font-semibold text-primary hover:text-accent">
          Get in touch with us
        </Link>{" "}
        and we&rsquo;ll coordinate the introduction.
      </div>
    </section>
  );
}
