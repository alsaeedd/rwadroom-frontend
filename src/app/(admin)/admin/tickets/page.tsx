"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Tabs } from "@/components/ui/tabs";
import { TicketStatusBadge } from "@/components/support";
import { usePaginatedQuery } from "@/lib/hooks/use-paginated-query";
import type { SupportTicket } from "@/lib/types";

const tabs = [
  { label: "Open", value: "OPEN" },
  { label: "Answered", value: "ANSWERED" },
  { label: "Closed", value: "CLOSED" },
];

function AdminTicketsPageContent() {
  const sp = useSearchParams();
  const { data, meta, isLoading, filters, setFilters, setPage } =
    usePaginatedQuery<SupportTicket>({
      path: "/admin/tickets",
      initialFilters: { status: sp.get("status") ?? "OPEN" },
    });

  const columns: Column<SupportTicket>[] = [
    {
      key: "subject",
      header: "Subject",
      render: (t) => (
        <Link href={`/admin/tickets/${t.id}`} className="block max-w-xs">
          <p className="font-medium text-foreground hover:text-primary truncate">{t.subject}</p>
          {t.lastMessage && (
            <p className="text-xs text-muted truncate">
              {t.lastMessage.isStaff ? "Staff: " : ""}
              {t.lastMessage.body}
            </p>
          )}
        </Link>
      ),
    },
    {
      key: "user",
      header: "From",
      render: (t) => (
        <div>
          <p className="text-sm font-medium whitespace-nowrap">
            {t.user?.firstName} {t.user?.lastName}
            <span className="ml-1.5 text-xs font-normal text-muted">{t.user?.role.toLowerCase()}</span>
          </p>
          <p className="text-xs text-muted">{t.user?.email}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (t) => <TicketStatusBadge status={t.status} />,
    },
    {
      key: "updated",
      header: "Last activity",
      render: (t) => (
        <span className="text-muted text-sm whitespace-nowrap">
          {new Date(t.updatedAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Support Tickets</h1>
        <p className="text-muted mt-1">Member questions, latest activity first.</p>
      </div>

      <Tabs
        tabs={tabs}
        activeTab={filters.status ?? "OPEN"}
        onChange={(status) => setFilters({ status })}
        className="mb-6"
      />

      <div className="rounded-2xl border border-border/60 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_24px_rgba(0,0,0,0.06)]">
        <DataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          keyExtractor={(t) => t.id}
          emptyTitle="No tickets here"
          emptyDescription="Tickets appear when members contact support."
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

export default function AdminTicketsPage() {
  return (
    <Suspense>
      <AdminTicketsPageContent />
    </Suspense>
  );
}
