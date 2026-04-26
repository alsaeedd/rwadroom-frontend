"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { SearchInput } from "@/components/ui/search-input";
import { Spinner } from "@/components/ui/spinner";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { SECTOR_LABEL } from "@/lib/enums";
import type { PaginatedResponse, PartnerListing } from "@/lib/types";
import { Handshake, Lock } from "lucide-react";

export default function PublicPartnersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [data, setData] = useState<PartnerListing[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 24, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api<PaginatedResponse<PartnerListing>>(`/users/partners?page=${page}&limit=24`)
      .then((r) => {
        setData(r.data);
        setMeta(r.meta);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [page]);

  const filtered = search
    ? data.filter((p) => p.companyName.toLowerCase().includes(search.toLowerCase()))
    : data;

  return (
    <>
      <section className="bg-foreground text-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent mb-4">
            Partners
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Companies offering Rwad Room community discounts
          </h1>
          <p className="mt-4 text-white/70 max-w-2xl">
            Browse our partner companies and the categories they serve.{" "}
            <span className="text-white">Subscribe to unlock the actual discount details.</span>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-12">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <p className="text-sm text-muted">
            <span className="font-semibold text-foreground">{meta.total}</span> partner
            {meta.total === 1 ? "" : "s"}
          </p>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Filter by company name..."
            className="max-w-xs"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner className="h-8 w-8" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Handshake className="h-8 w-8" />}
            title="No partners listed yet"
            description="Partners will appear here once they're approved."
          />
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl bg-white border border-border p-6 hover:border-primary/30 hover:shadow-md transition-all flex flex-col"
                >
                  <div className="flex items-start gap-3 mb-3">
                    {p.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.logoUrl}
                        alt={p.companyName}
                        className="h-12 w-12 rounded-xl object-contain bg-background"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/8">
                        <Handshake className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold truncate">{p.companyName}</h3>
                      {p.serviceCategory && (
                        <p className="text-xs text-muted mt-0.5">
                          {SECTOR_LABEL[p.serviceCategory]}
                        </p>
                      )}
                    </div>
                  </div>
                  {p.description && (
                    <p className="text-sm text-muted line-clamp-3 mb-4 flex-1">{p.description}</p>
                  )}
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="neutral">
                      <Lock className="inline h-3 w-3 mr-1" /> Discount for members
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            {meta.totalPages > 1 && !search && (
              <div className="mt-10">
                <Pagination
                  currentPage={meta.page}
                  totalPages={meta.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </section>

      <section className="bg-background py-14 border-t border-border">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
          <Lock className="h-7 w-7 text-accent mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Want to unlock the discounts?
          </h2>
          <p className="text-muted mb-6">
            Discount details, codes, and partner introductions are visible to subscribed Rwad
            Room members.
          </p>
          <Link
            href="/join"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-all"
          >
            Become a member
          </Link>
        </div>
      </section>
    </>
  );
}
