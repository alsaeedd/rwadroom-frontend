"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { SearchInput } from "@/components/ui/search-input";
import { Spinner } from "@/components/ui/spinner";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import type { PaginatedResponse, Resource, ResourceCategory } from "@/lib/types";
import { BookOpen, Lock, FileText, ExternalLink } from "lucide-react";

export default function PublicResourcesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [data, setData] = useState<Resource[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 24, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<ResourceCategory[]>("/resources/categories")
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: "24",
    });
    if (categoryId) params.set("categoryId", categoryId);
    if (search) params.set("search", search);

    api<PaginatedResponse<Resource>>(`/resources?${params.toString()}`)
      .then((r) => {
        setData(r.data);
        setMeta(r.meta);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [page, categoryId, search]);

  return (
    <>
      <section className="bg-foreground text-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent mb-4">
            Resources
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            A curated library for early-stage SMEs
          </h1>
          <p className="mt-4 text-white/70 max-w-2xl">
            Templates, frameworks, and guides — all reviewed by the Rwad Room team. Some are open
            to the public; others are members-only.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-12">
        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search resources..."
            className="max-w-sm"
          />
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setCategoryId("");
                  setPage(1);
                }}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  !categoryId
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-foreground/70 border-border hover:border-primary/40"
                }`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCategoryId(c.id);
                    setPage(1);
                  }}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                    categoryId === c.id
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-foreground/70 border-border hover:border-primary/40"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner className="h-8 w-8" />
          </div>
        ) : data.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="h-8 w-8" />}
            title="No resources match"
            description="Try a different search or filter."
          />
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((r) => (
                <ResourceCard key={r.id} resource={r} />
              ))}
            </div>
            {meta.totalPages > 1 && (
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
            Want the full library?
          </h2>
          <p className="text-muted mb-6">
            Members-only resources are downloadable with a Rwad Room subscription.
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

function ResourceCard({ resource }: { resource: Resource }) {
  const isMembers = resource.visibility === "MEMBERS_ONLY";
  return (
    <div className="rounded-2xl bg-white border border-border p-6 hover:border-primary/30 hover:shadow-md transition-all flex flex-col">
      <div className="flex items-start justify-between mb-3 gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 text-primary shrink-0">
          {resource.type === "LINK" ? (
            <ExternalLink className="h-4 w-4" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
        </div>
        <Badge variant={isMembers ? "neutral" : "info"}>
          {isMembers ? (
            <>
              <Lock className="inline h-3 w-3 mr-1" /> Members only
            </>
          ) : (
            "Open"
          )}
        </Badge>
      </div>
      <h3 className="font-semibold text-foreground mb-2">{resource.title}</h3>
      {resource.description && (
        <p className="text-sm text-muted line-clamp-3 mb-4 flex-1">{resource.description}</p>
      )}
      {resource.category && (
        <p className="text-xs text-muted">{resource.category.name}</p>
      )}
    </div>
  );
}
