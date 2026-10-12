"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Modal } from "@/components/ui/modal";
import { Spinner } from "@/components/ui/spinner";
import { ResourceForm } from "@/components/resource-form";
import { api, ApiError } from "@/lib/api";
import type { Resource, ResourceCategory, ResourceStatus } from "@/lib/types";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

const STATUS_CHIP: Record<ResourceStatus, { label: string; variant: "warning" | "success" | "danger" | "neutral" }> = {
  PENDING_REVIEW: { label: "Pending", variant: "warning" },
  ACTIVE: { label: "Live", variant: "success" },
  REJECTED: { label: "Rejected", variant: "danger" },
  ARCHIVED: { label: "Archived", variant: "neutral" },
};

/** Share (or, with ?edit=<id>, fix and resubmit) a resource. `base` is the role's resources page. */
export function ShareResourcePage({ base }: { base: string }) {
  return (
    <Suspense>
      <ShareResource base={base} />
    </Suspense>
  );
}

function ShareResource({ base }: { base: string }) {
  const router = useRouter();
  const editId = useSearchParams().get("edit");
  const [data, setData] = useState<{ categories: ResourceCategory[]; resource?: Resource } | null>(null);

  useEffect(() => {
    Promise.all([
      // Every category, not just the ones that already have resources.
      api<ResourceCategory[]>("/resources/categories?all=true").catch(() => []),
      editId ? api<Resource[]>("/resources/mine").catch(() => []) : Promise.resolve([]),
    ]).then(([categories, mine]) => setData({ categories, resource: mine.find((r) => r.id === editId) }));
  }, [editId]);

  if (!data) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;

  const { categories, resource } = data;
  return (
    <div>
      <button
        onClick={() => router.push(base)}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Resources
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">{resource ? "Edit submission" : "Share a resource"}</h1>
        <p className="text-muted mt-1">
          Upload a file or add a link. The Rwad Room team reviews every submission before it goes live in the library.
        </p>
      </div>

      <Card className="max-w-2xl">
        <ResourceForm
          endpoint={resource ? `/resources/${resource.id}` : "/resources"}
          categories={categories}
          resource={resource}
          submitLabel={resource ? "Resubmit for review" : "Submit for review"}
          onDone={() => router.push(base)}
          onCancel={() => router.push(base)}
        />
      </Card>
    </div>
  );
}

/** The member's own submissions with review status. Renders `empty` (default nothing) when there are none. */
export function MySubmissions({ base, empty = null }: { base: string; empty?: ReactNode }) {
  const [items, setItems] = useState<Resource[] | null>(null);
  const [deleting, setDeleting] = useState<Resource | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Resource[]>("/resources/mine").then(setItems).catch(() => setItems([]));
  }, []);

  const handleDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await api(`/resources/${deleting.id}`, { method: "DELETE" });
      setItems((list) => list?.filter((r) => r.id !== deleting.id) ?? null);
      setDeleting(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed.");
    } finally {
      setBusy(false);
    }
  };

  if (!items) return null;
  if (!items.length) return <>{empty}</>;

  return (
    <Card className="mb-8 py-6 sm:py-8">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-2">Your submissions</h2>
      {error && <Alert variant="error" className="mb-3">{error}</Alert>}
      <ul className="divide-y divide-border/60">
        {items.map((r) => (
          <li key={r.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-sm">{r.title}</p>
                <Badge variant={STATUS_CHIP[r.status].variant}>{STATUS_CHIP[r.status].label}</Badge>
              </div>
              <p className="text-xs text-muted mt-0.5">
                {r.category?.name}
                {r.status === "PENDING_REVIEW" && " · Waiting for an admin to review"}
              </p>
              {r.status === "REJECTED" && r.rejectionReason && (
                <p className="text-xs text-danger mt-1">Reason: {r.rejectionReason}</p>
              )}
            </div>
            <div className="flex gap-1">
              {(r.status === "PENDING_REVIEW" || r.status === "REJECTED") && (
                <Link href={`${base}/new?edit=${r.id}`}>
                  <Button variant="ghost" size="sm"><Pencil className="mr-1 h-3.5 w-3.5" /> Edit</Button>
                </Link>
              )}
              {r.status !== "ACTIVE" && (
                <Button variant="ghost" size="sm" onClick={() => setDeleting(r)} className="text-danger hover:text-danger">
                  <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {deleting && (
        <Modal open={true} onClose={() => setDeleting(null)} title="Delete submission">
          <p className="text-sm text-muted mb-6">
            Delete &quot;{deleting.title}&quot;? Its file is removed too. This cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button variant="danger" isLoading={busy} onClick={handleDelete}>Delete</Button>
          </div>
        </Modal>
      )}
    </Card>
  );
}
