"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { SearchInput } from "@/components/ui/search-input";
import { Spinner } from "@/components/ui/spinner";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import type { PaginatedResponse, StartupListing } from "@/lib/types";
import { ArrowRight, Building2 } from "lucide-react";

export default function CommunityPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [data, setData] = useState<StartupListing[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 24, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api<PaginatedResponse<StartupListing>>(`/users/startups?page=${page}&limit=24`)
      .then((r) => {
        setData(r.data);
        setMeta(r.meta);
      })
      .catch(() => {
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const filtered = search
    ? data.filter((s) =>
        s.companyName.toLowerCase().includes(search.toLowerCase()),
      )
    : data;

  return (
    <>
      <section className="bg-foreground text-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent mb-4">
            Community
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            The Bahraini SMEs in the room
          </h1>
          <p className="mt-4 text-white/70 max-w-2xl">
            A grid of every approved member of Rwad Room. Click any logo to learn more about the
            company.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-12">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <p className="text-sm text-muted">
            <span className="font-semibold text-foreground">{meta.total}</span> member
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
            icon={<Building2 className="h-8 w-8" />}
            title="No members yet"
            description="Approved community members will appear here."
            action={
              <Link
                href="/join"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
              >
                Be the first to join <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filtered.map((m) => (
                <Link
                  key={m.id}
                  href={`/community/${m.id}`}
                  className="group aspect-square rounded-2xl border border-border bg-white flex items-center justify-center p-4 hover:border-primary/30 hover:shadow-md transition-all"
                  title={m.companyName}
                >
                  {m.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.logoUrl}
                      alt={m.companyName}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-xs font-semibold text-foreground/60 text-center line-clamp-3 group-hover:text-foreground">
                      {m.companyName}
                    </span>
                  )}
                </Link>
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

      {/* Static facts strip */}
      <section className="bg-background py-10 border-t border-border">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <Stat label="Bahrain-first" value="🇧🇭" />
          <Stat label="Annual subscription" value="BHD 99" />
          <Stat label="Mentors & Partners" value="Free to list" />
          <Stat label="Curated by humans" value="100%" />
        </div>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wider text-muted">{label}</p>
    </div>
  );
}

