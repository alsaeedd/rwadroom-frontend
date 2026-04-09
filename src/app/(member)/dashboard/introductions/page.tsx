"use client";

import { useRouter } from "next/navigation";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePaginatedQuery } from "@/lib/hooks/use-paginated-query";
import type { Introduction, IntroductionStatus } from "@/lib/types";
import { Eye } from "lucide-react";

const statusVariant: Record<IntroductionStatus, "warning" | "info" | "success" | "danger"> = {
  PENDING: "warning",
  IN_PROGRESS: "info",
  COMPLETED: "success",
  DECLINED: "danger",
};

export default function MyIntroductionsPage() {
  const router = useRouter();
  const { data, meta, isLoading, setPage } =
    usePaginatedQuery<Introduction>({ path: "/introductions" });

  const columns: Column<Introduction>[] = [
    {
      key: "target",
      header: "Requested For",
      render: (i) => <p className="font-medium text-sm">{i.target?.firstName} {i.target?.lastName}</p>,
    },
    {
      key: "type",
      header: "Type",
      render: (i) => <Badge variant="neutral">{i.type === "PARTNER_INTRODUCTION" ? "Partner" : "Mentor"}</Badge>,
    },
    {
      key: "status",
      header: "Status",
      render: (i) => <Badge variant={statusVariant[i.status]}>{i.status.replace("_", " ")}</Badge>,
    },
    {
      key: "date",
      header: "Date",
      render: (i) => <span className="text-muted text-sm">{new Date(i.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: "actions",
      header: "",
      className: "w-12",
      render: (i) => (
        <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/introductions/${i.id}`)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">My Introductions</h1>
        <p className="text-muted mt-1">Track the status of your introduction and session requests.</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_24px_rgba(0,0,0,0.06)]">
        <DataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          keyExtractor={(i) => i.id}
          emptyTitle="No requests yet"
          emptyDescription="Your introduction and session requests will appear here."
          pagination={{ currentPage: meta.page, totalPages: meta.totalPages, onPageChange: setPage }}
        />
      </div>
    </div>
  );
}
