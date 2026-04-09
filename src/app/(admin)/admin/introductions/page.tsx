"use client";

import { useRouter } from "next/navigation";
import { DataTable, type Column } from "@/components/ui/data-table";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePaginatedQuery } from "@/lib/hooks/use-paginated-query";
import type { Introduction, IntroductionStatus, IntroductionType, Urgency } from "@/lib/types";
import { Eye } from "lucide-react";

const statusVariant: Record<IntroductionStatus, "warning" | "info" | "success" | "danger"> = {
  PENDING: "warning",
  IN_PROGRESS: "info",
  COMPLETED: "success",
  DECLINED: "danger",
};

const urgencyVariant: Record<Urgency, "danger" | "warning" | "neutral"> = {
  HIGH: "danger",
  MEDIUM: "warning",
  LOW: "neutral",
};

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "DECLINED", label: "Declined" },
];

const typeOptions = [
  { value: "", label: "All Types" },
  { value: "PARTNER_INTRODUCTION", label: "Partner Intro" },
  { value: "MENTOR_SESSION", label: "Mentor Session" },
];

const urgencyOptions = [
  { value: "", label: "All Urgency" },
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];

export default function AdminIntroductionsPage() {
  const router = useRouter();
  const { data, meta, isLoading, filters, setFilters, setPage } =
    usePaginatedQuery<Introduction>({ path: "/admin/introductions" });

  const columns: Column<Introduction>[] = [
    {
      key: "requester",
      header: "Requester",
      render: (i) => (
        <p className="font-medium text-foreground text-sm">
          {i.requester?.firstName} {i.requester?.lastName}
        </p>
      ),
    },
    {
      key: "target",
      header: "Target",
      render: (i) => (
        <p className="text-sm">
          {i.target?.firstName} {i.target?.lastName}
        </p>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (i) => (
        <Badge variant="neutral">
          {i.type === "PARTNER_INTRODUCTION" ? "Partner" : "Mentor"}
        </Badge>
      ),
    },
    {
      key: "urgency",
      header: "Urgency",
      render: (i) => <Badge variant={urgencyVariant[i.urgency]}>{i.urgency}</Badge>,
    },
    {
      key: "status",
      header: "Status",
      render: (i) => <Badge variant={statusVariant[i.status]}>{i.status}</Badge>,
    },
    {
      key: "date",
      header: "Date",
      render: (i) => (
        <span className="text-muted text-sm">{new Date(i.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      render: (i) => (
        <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/introductions/${i.id}`)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Introductions</h1>
        <p className="text-muted mt-1">Manage partner introductions and mentor session requests.</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <Select
          options={statusOptions}
          value={filters.status || ""}
          onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
          className="w-full sm:w-40"
        />
        <Select
          options={typeOptions}
          value={filters.type || ""}
          onChange={(e) => setFilters({ ...filters, type: e.target.value || undefined })}
          className="w-full sm:w-44"
        />
        <Select
          options={urgencyOptions}
          value={filters.urgency || ""}
          onChange={(e) => setFilters({ ...filters, urgency: e.target.value || undefined })}
          className="w-full sm:w-36"
        />
      </div>

      <div className="rounded-2xl border border-border/60 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_24px_rgba(0,0,0,0.06)]">
        <DataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          keyExtractor={(i) => i.id}
          emptyTitle="No introduction requests"
          emptyDescription="Requests will appear here when startups submit them."
          pagination={{ currentPage: meta.page, totalPages: meta.totalPages, onPageChange: setPage }}
        />
      </div>
    </div>
  );
}
