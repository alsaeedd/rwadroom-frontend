"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { JobMeta, JobStatusBadge } from "@/components/jobs";
import type { Job } from "@/lib/types";
import { ArrowLeft, ExternalLink, Mail } from "lucide-react";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const authLoading = useAuthStore((s) => s.isLoading);
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState("");

  // Wait for the session, so the poster (or an admin) can open a post that isn't live.
  useEffect(() => {
    if (authLoading) return;
    api<Job>(`/jobs/${id}`)
      .then(setJob)
      .catch((err) => setError(err.message));
  }, [id, authLoading]);

  const live = job?.status === "ACTIVE" && !job.expired;

  return (
    <section className="mx-auto max-w-3xl px-5 sm:px-8 py-12">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> All jobs
      </Link>

      {!job ? (
        error ? (
          <div className="py-16 text-center">
            <h1 className="text-xl font-semibold">Job not found</h1>
            <p className="text-muted mt-1">It may have been filled or closed.</p>
          </div>
        ) : (
          <div className="flex justify-center py-20">
            <Spinner className="h-8 w-8" />
          </div>
        )
      ) : (
        <article className="rounded-2xl bg-white border border-border p-6 sm:p-10">
          {!live && (
            <Alert variant="warning" className="mb-6">
              <span className="inline-flex flex-wrap items-center gap-2">
                Not public — only the poster and admins can see this post.{" "}
                <JobStatusBadge job={job} />
              </span>
            </Alert>
          )}
          <p className="text-sm font-semibold text-primary">{job.companyName}</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight">{job.title}</h1>
          <div className="mt-4">
            <JobMeta job={job} />
          </div>
          <div className="mt-8 text-[15px] leading-relaxed text-foreground/85 whitespace-pre-line break-words">
            {job.description}
          </div>
          <a
            href={job.applyUrl ?? `mailto:${job.applyEmail}`}
            target={job.applyUrl ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(255,87,51,0.25)] hover:brightness-110 transition-all"
          >
            {job.applyUrl ? <ExternalLink className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
            Apply
          </a>
        </article>
      )}
    </section>
  );
}
