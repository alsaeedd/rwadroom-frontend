"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";
import { Pagination } from "./pagination";
import { EmptyState } from "./empty-state";
import { Inbox } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  keyExtractor: (row: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  emptyTitle = "No results",
  emptyDescription,
  pagination,
  keyExtractor,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={<Inbox className="h-8 w-8" />}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-muted",
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="border-b border-border/50 hover:bg-primary/[0.02] transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn("px-4 py-3.5 text-sm", col.className)}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {data.map((row) => (
          <div
            key={keyExtractor(row)}
            className="rounded-xl border border-border bg-white p-4"
          >
            {columns.map((col) => (
              <div key={col.key} className="flex items-start justify-between py-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                  {col.header}
                </span>
                <span className="text-sm text-right">{col.render(row)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
          />
        </div>
      )}
    </div>
  );
}
