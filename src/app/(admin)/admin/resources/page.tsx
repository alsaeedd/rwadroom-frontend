"use client";

import { useRouter } from "next/navigation";
import { DataTable, type Column } from "@/components/ui/data-table";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Modal } from "@/components/ui/modal";
import { usePaginatedQuery } from "@/lib/hooks/use-paginated-query";
import { api, ApiError } from "@/lib/api";
import type { Resource } from "@/lib/types";
import { ArchiveRestore, Plus, Pencil, Archive, Trash2, ExternalLink, FileIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const visibilityOptions = [
  { value: "", label: "All Visibility" },
  { value: "PUBLIC", label: "Public" },
  { value: "MEMBERS_ONLY", label: "Members Only" },
];

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "ARCHIVED", label: "Archived" },
];

export default function AdminResourcesPage() {
  const router = useRouter();
  const { data, meta, isLoading, search, filters, setSearch, setFilters, setPage, refresh } =
    usePaginatedQuery<Resource>({ path: "/admin/resources" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteModal, setDeleteModal] = useState<Resource | null>(null);
  const [deleting, setDeleting] = useState(false);

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
        <Badge variant={r.status === "ACTIVE" ? "success" : "neutral"}>
          {r.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-32",
      render: (r) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/resources/${r.id}/edit`)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          {r.status === "ACTIVE" ? (
            <Button variant="ghost" size="sm" onClick={() => handleArchive(r)} title="Archive">
              <Archive className="h-3.5 w-3.5" />
            </Button>
          ) : (
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
          className="w-full sm:w-36"
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
    </div>
  );
}
