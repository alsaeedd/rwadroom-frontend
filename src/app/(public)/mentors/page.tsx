"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { SearchInput } from "@/components/ui/search-input";
import { Spinner } from "@/components/ui/spinner";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { INDUSTRY_FOCUS_LABEL, LANGUAGE_LABEL } from "@/lib/enums";
import type { MentorListing, PaginatedResponse } from "@/lib/types";
import { GraduationCap, Lock } from "lucide-react";

export default function PublicMentorsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [data, setData] = useState<MentorListing[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 24, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api<PaginatedResponse<MentorListing>>(`/users/mentors?page=${page}&limit=24`)
      .then((r) => {
        setData(r.data);
        setMeta(r.meta);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [page]);

  const filtered = search
    ? data.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
    : data;

  return (
    <>
      <section className="bg-foreground text-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent mb-4">
            Mentors
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Vetted mentors with real operating experience
          </h1>
          <p className="mt-4 text-white/70 max-w-2xl">
            Browse mentors by expertise, industry, and language.{" "}
            <span className="text-white">Subscribe to request sessions.</span>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-12">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <p className="text-sm text-muted">
            <span className="font-semibold text-foreground">{meta.total}</span> mentor
            {meta.total === 1 ? "" : "s"}
          </p>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Filter by name..."
            className="max-w-xs"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner className="h-8 w-8" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<GraduationCap className="h-8 w-8" />}
            title="No mentors listed yet"
            description="Mentors will appear here once they're approved."
          />
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((m) => (
                <div
                  key={m.id}
                  className="rounded-2xl bg-white border border-border p-6 hover:border-primary/30 hover:shadow-md transition-all flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-4">
                    {m.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.photoUrl}
                        alt={m.name}
                        className="h-14 w-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/8">
                        <GraduationCap className="h-6 w-6 text-primary" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold truncate">{m.name}</h3>
                      {m.title && <p className="text-xs text-muted truncate">{m.title}</p>}
                    </div>
                  </div>

                  {m.bio && (
                    <p className="text-sm text-muted line-clamp-3 mb-4">{m.bio}</p>
                  )}

                  {m.industryFocus.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {m.industryFocus.slice(0, 3).map((i) => (
                        <Badge key={i} variant="info">
                          {INDUSTRY_FOCUS_LABEL[i]}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {m.languages.length > 0 && (
                    <p className="text-xs text-muted mb-3">
                      Speaks {m.languages.map((l) => LANGUAGE_LABEL[l]).join(", ")}
                    </p>
                  )}

                  <div className="mt-auto pt-3 border-t border-border">
                    <span className="inline-flex items-center gap-1 text-xs text-muted">
                      <Lock className="h-3 w-3" /> Sessions for members
                    </span>
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
          <GraduationCap className="h-7 w-7 text-accent mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Want to book a session?
          </h2>
          <p className="text-muted mb-6">
            Mentor sessions are exclusively for subscribed Rwad Room members. Members book an open
            time slot directly and get an instant video link.
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
