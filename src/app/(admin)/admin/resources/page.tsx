"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DataTable, type Column } from "@/components/ui/data-table";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { usePaginatedQuery } from "@/lib/hooks/use-paginated-query";
import { api, ApiError } from "@/lib/api";
import { ROLE_LABEL } from "@/lib/enums";
import type { Resource, ResourceStatus } from "@/lib/types";
import { ArchiveRestore, Plus, Pencil, Archive, Trash2, ExternalLink, FileIcon, Eye, Check, X } from "lucide-react";
import { Suspense, useState } from "react";
import Link from "next/link";

const visibilityOptions = [
  { value: "", label: "All Visibility" },
  { value: "PUBLIC", label: "Public" },
  { value: "MEMBERS_ONLY", label: "Members Only" },
];

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "PENDING_REVIEW", label: "Pending review" },
  { value: "ACTIVE", label: "Active" },
  { value: "REJECTED", label: "Rejected" },
  { value: "ARCHIVED", label: "Archived" },
];

const statusBadge: Record<ResourceStatus, { label: string; variant: "success" | "warning" | "danger" | "neutral" }> = {
  ACTIVE: { label: "Active", variant: "success" },
  PENDING_REVIEW: { label: "Pending review", variant: "warning" },
  REJECTED: { label: "Rejected", variant: "danger" },
  ARCHIVED: { label: "Archived", variant: "neutral" },
};

function AdminResourcesPageContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const { data, meta, isLoading, search, filters, setSearch, setFilters, setPage, refresh } =
    usePaginatedQuery<Resource>({
      path: "/admin/resources",
      // The admin home card and the submission email deep-link with ?status=
      initialFilters: { status: sp.get("status") ?? undefined },
    });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteModal, setDeleteModal] = useState<Resource | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [rejectModal, setRejectModal] = useState<Resource | null>(null);
  const [reason, setReason] = useState("");
  const [rejecting, setRejecting] = useState(false);

  const handleApprove = async (resource: Resource) => {
    try {
      await api(`/admin/resources/${resource.id}/approve`, { method: "POST" });
      setSuccess(`"${resource.title}" is live. The member has been emailed.`);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Approve failed.");
    }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setRejecting(true);
    try {
      await api(`/admin/resources/${rejectModal.id}/reject`, {
        method: "POST",
        body: JSON.stringify({ reason: reason.trim() }),
      });
      setSuccess("Submission rejected. The member has been emailed the reason.");
      setRejectModal(null);
      setReason("");
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Reject failed.");
    } finally {
      setRejecting(false);
    }
  };

  // Pending files aren't public yet; the download endpoint presigns them for admins.
  const handleOpen = async (resource: Resource) => {
    if (resource.type === "LINK") {
      if (resource.externalUrl) window.open(resource.externalUrl, "_blank");
      return;
    }
    try {
      const { downloadUrl } = await api<{ downloadUrl: string }>(`/resources/${resource.id}/download`);
      window.open(downloadUrl, "_blank");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not open the file.");
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      await api(`/admin/resources/${deleteModal.id}`, { method: "DELETE" });
      setSuccess("Resource deleted.");
      setDeleteModal(null);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  const handleArchive = async (resource: Resource) => {
    try {
      await api(`/admin/resources/${resource.id}/archive`, { method: "PATCH" });
      setSuccess("Resource archived.");
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Archive failed.");
    }
  };

  const handleUnarchive = async (resource: Resource) => {
    try {
      await api(`/admin/resources/${resource.id}/unarchive`, { method: "PATCH" });
      setSuccess("Resource restored.");
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Restore failed.");
    }
  };

  const columns: Column<Resource>[] = [
    {
      key: "title",
      header: "Title",
      className: "min-w-56",
      render: (r) => (
        <div className="flex items-center gap-2">
          {r.type === "LINK" ? (
            <ExternalLink className="h-4 w-4 text-muted shrink-0" />
          ) : (
            <FileIcon className="h-4 w-4 text-muted shrink-0" />
          )}
          <div>
            <p className="font-medium text-foreground">{r.title}</p>
            {r.category && <p className="text-xs text-muted">{r.category.name}</p>}
            {r.uploadedBy && (
              <p className="text-xs text-muted">
                by {r.uploadedBy.firstName} {r.uploadedBy.lastName} · {ROLE_LABEL[r.uploadedBy.role]}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (r) => <Badge variant="neutral">{r.type}</Badge>,
    },
    {
      key: "visibility",
      header: "Access",
      render: (r) => (
        <Badge variant={r.visibility === "PUBLIC" ? "success" : "info"}>
          {r.visibility === "PUBLIC" ? "Public" : "Members"}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <div>
          <Badge variant={statusBadge[r.status].variant} className="whitespace-nowrap">
            {statusBadge[r.status].label}
          </Badge>
          {r.status === "REJECTED" && r.rejectionReason && (
            <p className="text-xs text-muted mt-1 max-w-56">{r.rejectionReason}</p>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-32",
      render: (r) => (
        <div className="flex items-center gap-1">
          {r.status === "PENDING_REVIEW" && (
            <>
              <Button variant="ghost" size="sm" onClick={() => handleOpen(r)} title="Open">
                <Eye className="h-3.5 w-3.5" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleApprove(r)}>
                <Check className="mr-1 h-3.5 w-3.5" /> Approve
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setRejectModal(r)} className="text-danger hover:text-danger">
                <X className="mr-1 h-3.5 w-3.5" /> Reject
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/resources/${r.id}/edit`)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          {r.status === "ACTIVE" && (
            <Button variant="ghost" size="sm" onClick={() => handleArchive(r)} title="Archive">
              <Archive className="h-3.5 w-3.5" />
            </Button>
          )}
          {r.status === "ARCHIVED" && (
            <Button variant="ghost" size="sm" onClick={() => handleUnarchive(r)} title="Restore">
              <ArchiveRestore className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => setDeleteModal(r)} className="text-danger hover:text-danger">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resources</h1>
          <p className="text-muted mt-1">Manage files and links for the community.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/resources/categories">
            <Button variant="outline" size="sm">Categories</Button>
          </Link>
          <Link href="/admin/resources/new">
            <Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> New Resource</Button>
          </Link>
        </div>
      </div>

      {success && <Alert variant="success" className="mb-5">{success}</Alert>}
      {error && <Alert variant="error" className="mb-5">{error}</Alert>}

      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search resources..." className="flex-1" />
        <Select
          options={visibilityOptions}
          value={filters.visibility || ""}
          onChange={(e) => setFilters({ ...filters, visibility: e.target.value || undefined })}
          className="w-full sm:w-44"
        />
        <Select
          options={statusOptions}
          value={filters.status || ""}
          onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
          className="w-full sm:w-44"
        />
      </div>

      <div className="rounded-2xl border border-border/60 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_24px_rgba(0,0,0,0.06)]">
        <DataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          keyExtractor={(r) => r.id}
          emptyTitle={search ? "No matching resources" : "No resources yet"}
          emptyDescription={search ? "Try a different search." : "Upload your first resource to get started."}
          pagination={{ currentPage: meta.page, totalPages: meta.totalPages, onPageChange: setPage }}
        />
      </div>

      {deleteModal && (
        <Modal open={true} onClose={() => setDeleteModal(null)} title="Delete Resource">
          <p className="text-sm text-muted mb-6">
            Permanently delete &quot;{deleteModal.title}&quot;? This cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setDeleteModal(null)}>Cancel</Button>
            <Button variant="danger" isLoading={deleting} onClick={handleDelete}>Delete</Button>
          </div>
        </Modal>
      )}

      {rejectModal && (
        <Modal open={true} onClose={() => setRejectModal(null)} title="Reject submission">
          <p className="text-sm text-muted mb-4">
            Tell the member what to fix in &quot;{rejectModal.title}&quot;. They get this by email and can edit and resubmit.
          </p>
          <Textarea
            label="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={500}
            placeholder="e.g. The link points to a page that needs a login."
          />
          <div className="flex gap-3 justify-end mt-6">
            <Button variant="ghost" onClick={() => setRejectModal(null)}>Cancel</Button>
            <Button variant="danger" isLoading={rejecting} disabled={!reason.trim()} onClick={handleReject}>
              Reject
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function AdminResourcesPage() {
  return (
    <Suspense>
      <AdminResourcesPageContent />
    </Suspense>
  );
}
