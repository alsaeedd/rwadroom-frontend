"use client";

import { useState } from "react";
import Link from "next/link";
import { usePaginatedQuery } from "@/lib/hooks/use-paginated-query";
import { api, ApiError } from "@/lib/api";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { Spinner } from "@/components/ui/spinner";
import { Tabs } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { JobMeta, JobStatusBadge } from "@/components/jobs";
import type { Job } from "@/lib/types";
import { Briefcase, CheckCircle2, XCircle } from "lucide-react";

const TABS = [
  { label: "Pending", value: "PENDING_REVIEW" },
  { label: "Active", value: "ACTIVE" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Closed", value: "CLOSED" },
];

export default function AdminJobsPage() {
  const { data, meta, isLoading, filters, setFilters, setPage, refresh } = usePaginatedQuery<Job>({
    path: "/admin/jobs",
    initialFilters: { status: "PENDING_REVIEW" },
  });
  const [rejecting, setRejecting] = useState<Job | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const act = async (job: Job, action: "approve" | "reject") => {
    setBusy(job.id);
    setError("");
    setSuccess("");
    try {
      await api(`/admin/jobs/${job.id}/${action}`, {
        method: "POST",
        body: action === "reject" ? JSON.stringify({ reason: reason.trim() }) : undefined,
      });
      setSuccess(
        action === "approve"
          ? `"${job.title}" is live. The poster has been emailed.`
          : `"${job.title}" was rejected. The poster has been emailed the reason.`,
      );
      setRejecting(null);
      setReason("");
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Job posts</h1>
        <p className="text-muted mt-1">
          Review roles from startups and partners before they go live on the public jobs board.
        </p>
      </div>

      <Tabs
        tabs={TABS}
        activeTab={filters.status ?? "PENDING_REVIEW"}
        onChange={(status) => setFilters({ status })}
        className="mb-6"
      />

      {success && <Alert variant="success" className="mb-4">{success}</Alert>}
      {error && <Alert variant="error" className="mb-4">{error}</Alert>}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      ) : data.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-8 w-8" />}
          title="Nothing here"
          description="Job posts in this state will show up here."
        />
      ) : (
        <div className="space-y-4">
          {data.map((job) => (
            <Card key={job.id} className="px-6 py-6 sm:px-8 sm:py-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{job.title}</h3>
                    <JobStatusBadge job={job} />
                  </div>
                  <p className="text-sm text-muted mt-0.5">
                    {job.companyName}
                    {job.postedBy &&
                      ` · posted by ${job.postedBy.firstName} ${job.postedBy.lastName} (${job.postedBy.email})`}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {job.status === "PENDING_REVIEW" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      isLoading={busy === job.id && !rejecting}
                      onClick={() => act(job, "approve")}
                    >
                      <CheckCircle2 className="mr-1.5 h-4 w-4" /> Approve
                    </Button>
                  )}
                  {(job.status === "PENDING_REVIEW" || job.status === "ACTIVE") && (
                    <Button size="sm" variant="outline" onClick={() => setRejecting(job)}>
                      <XCircle className="mr-1.5 h-4 w-4" />
                      {job.status === "ACTIVE" ? "Take down" : "Reject"}
                    </Button>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <JobMeta job={job} />
              </div>
              <p className="mt-3 text-sm text-foreground/80 whitespace-pre-line break-words line-clamp-6">
                {job.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                {job.applyUrl && (
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all"
                  >
                    {job.applyUrl}
                  </a>
                )}
                {job.applyEmail && <span>{job.applyEmail}</span>}
                {job.status === "REJECTED" && job.rejectionReason && (
                  <span className="text-red-700">Reason: {job.rejectionReason}</span>
                )}
                <Link href={`/jobs/${job.id}`} className="font-semibold text-primary hover:text-accent">
                  Open full post →
                </Link>
              </div>
            </Card>
          ))}
          <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
        </div>
      )}

      {rejecting && (
        <Modal
          open
          onClose={() => setRejecting(null)}
          title={rejecting.status === "ACTIVE" ? "Take down job post" : "Reject job post"}
        >
          <p className="text-sm text-muted mb-4">
            &ldquo;{rejecting.title}&rdquo; at {rejecting.companyName}. The poster gets this reason
            by email and can edit the post and resubmit it.
          </p>
          <Textarea
            label="Reason (shown to the poster)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={500}
            placeholder="e.g. Please add the salary range and a clearer description."
          />
          <div className="mt-5 flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setRejecting(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={!reason.trim()}
              isLoading={busy === rejecting.id}
              onClick={() => act(rejecting, "reject")}
            >
              {rejecting.status === "ACTIVE" ? "Take down" : "Reject"}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
