"use client";

import { useRouter } from "next/navigation";
import { DataTable, type Column } from "@/components/ui/data-table";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePaginatedQuery } from "@/lib/hooks/use-paginated-query";
import type { AdminUser, Role, UserStatus } from "@/lib/types";
import { Eye } from "lucide-react";

const statusVariant: Record<UserStatus, "success" | "warning" | "danger" | "neutral"> = {
  INCOMPLETE: "neutral",
  APPROVED: "success",
  PENDING: "warning",
  REJECTED: "danger",
};

const roleOptions = [
  { value: "", label: "All Roles" },
  { value: "STARTUP", label: "Startup" },
  { value: "MENTOR", label: "Mentor" },
  { value: "PARTNER", label: "Partner" },
  { value: "ADMIN", label: "Admin" },
];

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "INCOMPLETE", label: "Incomplete" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

export default function AdminUsersPage() {
  const router = useRouter();
  const { data, meta, isLoading, search, filters, setSearch, setFilters, setPage } =
    usePaginatedQuery<AdminUser>({ path: "/admin/users" });

  const columns: Column<AdminUser>[] = [
    {
      key: "name",
      header: "Name",
      render: (u) => (
        <div>
          <p className="font-medium text-foreground">{u.firstName} {u.lastName}</p>
          <p className="text-xs text-muted">{u.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (u) => <Badge variant="info">{u.role}</Badge>,
    },
    {
      key: "status",
      header: "Status",
      render: (u) => <Badge variant={statusVariant[u.status]}>{u.status}</Badge>,
    },
    {
      key: "subscription",
      header: "Subscription",
      render: (u) =>
        u.role === "STARTUP" ? (
          <Badge variant={u.subscriptionActive ? "success" : "neutral"}>
            {u.subscriptionActive ? "Active" : "Inactive"}
          </Badge>
        ) : (
          <span className="text-muted text-xs">N/A</span>
        ),
    },
    {
      key: "created",
      header: "Joined",
      render: (u) => (
        <span className="text-muted text-sm">
          {new Date(u.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      render: (u) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/admin/users/${u.id}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted mt-1">Review and manage all registered users.</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name or email..."
          className="flex-1"
        />
        <Select
          options={roleOptions}
          value={filters.role || ""}
          onChange={(e) => setFilters({ ...filters, role: e.target.value || undefined })}
          className="w-full sm:w-40"
        />
        <Select
          options={statusOptions}
          value={filters.status || ""}
          onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
          className="w-full sm:w-40"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border/60 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_24px_rgba(0,0,0,0.06)]">
        <DataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          keyExtractor={(u) => u.id}
          emptyTitle="No users found"
          emptyDescription="Try adjusting your filters."
          pagination={{
            currentPage: meta.page,
            totalPages: meta.totalPages,
            onPageChange: setPage,
          }}
        />
      </div>
    </div>
  );
}
