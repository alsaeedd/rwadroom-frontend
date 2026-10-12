"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  JOB_STATUS_LABEL,
  JOB_TYPE_LABEL,
  JOB_TYPE_OPTIONS,
  SECTOR_LABEL,
  SECTOR_OPTIONS,
} from "@/lib/enums";
import type { Job } from "@/lib/types";
import { Briefcase, MapPin, Pencil, Plus, X } from "lucide-react";

/** Location · remote · type · sector · posted date. */
export function JobMeta({ job }: { job: Job }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted">
      <span className="inline-flex items-center gap-1">
        <MapPin className="h-3.5 w-3.5" /> {job.location}
      </span>
      {job.isRemote && <Badge variant="info">Remote</Badge>}
      <Badge variant="neutral">{JOB_TYPE_LABEL[job.type]}</Badge>
      {job.sector && <span>{SECTOR_LABEL[job.sector]}</span>}
      <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
    </div>
  );
}

const statusVariant = {
  PENDING_REVIEW: "warning",
  ACTIVE: "success",
  REJECTED: "danger",
  CLOSED: "neutral",
} as const;

export function JobStatusBadge({ job }: { job: Job }) {
  if (job.status === "ACTIVE" && job.expired) return <Badge variant="neutral">Expired</Badge>;
  return <Badge variant={statusVariant[job.status]}>{JOB_STATUS_LABEL[job.status]}</Badge>;
}

/** "Your job posts" — the same page for startups (/dashboard/jobs) and partners (/partner/jobs). */
export function MyJobs() {
  const approved = useAuthStore((s) => s.user?.status === "APPROVED");
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [editing, setEditing] = useState<Job | "new" | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(() => {
    api<Job[]>("/jobs/mine")
      .then(setJobs)
      .catch((err) => setError(err.message));
  }, []);
  useEffect(load, [load]);

  const current = editing && editing !== "new" ? editing : null;

  const open = (target: Job | "new") => {
    setEditing(target);
    setNotice("");
    setError("");
  };

  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const text = (key: string) => String(form.get(key) ?? "").trim();
    setSaving(true);
    setError("");
    try {
      await api(current ? `/jobs/${current.id}` : "/jobs", {
        method: current ? "PATCH" : "POST",
        body: JSON.stringify({
          title: text("title"),
          location: text("location"),
          isRemote: form.get("isRemote") === "on",
          type: text("type"),
          sector: text("sector") || null,
          description: text("description"),
          applyUrl: text("applyUrl") || null,
          applyEmail: text("applyEmail") || null,
        }),
      });
      setEditing(null);
      setNotice("Sent for review. We'll email you as soon as it's live.");
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save the job post.");
    } finally {
      setSaving(false);
    }
  };

  const close = async (job: Job) => {
    if (!window.confirm(`Close "${job.title}"? It comes off the jobs board for good.`)) return;
    setError("");
    try {
      await api(`/jobs/${job.id}/close`, { method: "POST" });
      setNotice(`"${job.title}" is closed.`);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not close the post.");
    }
  };

  if (!jobs) {
    return error ? (
      <Alert variant="error">{error}</Alert>
    ) : (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your job posts</h1>
          <p className="text-muted mt-1">
            Approved posts appear on the public{" "}
            <Link href="/jobs" className="font-medium text-primary hover:text-accent">
              jobs board
            </Link>{" "}
            for 30 days.
          </p>
        </div>
        {approved && !editing && (
          <Button onClick={() => open("new")}>
            <Plus className="mr-2 h-4 w-4" /> Post a job
          </Button>
        )}
      </div>

      {!approved && <Alert variant="info">You can post jobs once your account is approved.</Alert>}
      {notice && <Alert variant="success">{notice}</Alert>}
      {error && <Alert variant="error">{error}</Alert>}

      {editing && (
        <Card className="px-6 py-6 sm:px-8 sm:py-8">
          <form key={current?.id ?? "new"} onSubmit={save} className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{current ? "Edit job post" : "Post a job"}</h2>
              <button
                type="button"
                onClick={() => setEditing(null)}
                aria-label="Cancel"
                className="text-muted hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Input
              label="Job title"
              name="title"
              required
              maxLength={120}
              defaultValue={current?.title}
              placeholder="e.g. Growth Marketer"
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Location"
                name="location"
                required
                maxLength={120}
                defaultValue={current?.location}
                placeholder="e.g. Manama, Bahrain"
              />
              <Select
                label="Type"
                name="type"
                required
                options={JOB_TYPE_OPTIONS}
                defaultValue={current?.type ?? ""}
                placeholder="Select a type"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 sm:items-end">
              <Select
                label="Sector"
                name="sector"
                options={[{ value: "", label: "No specific sector" }, ...SECTOR_OPTIONS]}
                defaultValue={current?.sector ?? ""}
              />
              <label className="flex h-12 items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  name="isRemote"
                  defaultChecked={current?.isRemote}
                  className="h-4 w-4 accent-primary"
                />
                Remote friendly
              </label>
            </div>
            <Textarea
              label="Description"
              name="description"
              required
              maxLength={4000}
              rows={8}
              defaultValue={current?.description}
              placeholder="What the role involves, who you're looking for, and the pay range if you can share it."
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Apply link"
                name="applyUrl"
                type="url"
                maxLength={500}
                defaultValue={current?.applyUrl ?? ""}
                placeholder="https://"
              />
              <Input
                label="Or apply by email"
                name="applyEmail"
                type="email"
                maxLength={254}
                defaultValue={current?.applyEmail ?? ""}
                placeholder="jobs@company.com"
              />
            </div>
            <p className="text-xs text-muted -mt-2">Add at least one way to apply.</p>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={saving}>
                {current ? "Resubmit for review" : "Submit for review"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {jobs.length === 0 && !editing ? (
        <EmptyState
          icon={<Briefcase className="h-8 w-8" />}
          title="No job posts yet"
          description="Hiring? Post a role and it goes live for the community once an admin approves it."
        />
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const live = job.status === "ACTIVE" && !job.expired;
            const editable = job.status === "PENDING_REVIEW" || job.status === "REJECTED";
            return (
              <Card key={job.id} className="px-6 py-5 sm:px-6 sm:py-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{job.title}</h3>
                      <JobStatusBadge job={job} />
                    </div>
                    <JobMeta job={job} />
                    {job.status === "REJECTED" && job.rejectionReason && (
                      <p className="text-sm text-red-700">
                        <span className="font-semibold">Reason:</span> {job.rejectionReason}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {live && (
                      <Link
                        href={`/jobs/${job.id}`}
                        className="text-sm font-semibold text-primary hover:text-accent"
                      >
                        View
                      </Link>
                    )}
                    {editable && (
                      <Button size="sm" variant="outline" onClick={() => open(job)}>
                        <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                      </Button>
                    )}
                    {live && (
                      <Button size="sm" variant="ghost" onClick={() => close(job)}>
                        Close
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
