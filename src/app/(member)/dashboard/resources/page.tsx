"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { usePaginatedQuery } from "@/lib/hooks/use-paginated-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import type { Resource, ResourceCategory } from "@/lib/types";
import { BookOpen, Lock, ExternalLink, FileIcon } from "lucide-react";

export default function ResourceLibraryPage() {
  const router = useRouter();
  const subscriptionActive = useAuthStore((s) => s.user?.subscriptionActive);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState("");

  const { data, meta, isLoading, search, setSearch, setFilters, setPage } =
    usePaginatedQuery<Resource>({ path: "/resources" });

  useEffect(() => {
    api<ResourceCategory[]>("/resources/categories").then(setCategories).catch(() => {});
  }, []);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setFilters(catId ? { categoryId: catId } : {});
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Resources</h1>
        <p className="text-muted mt-1">Guides, templates, and tools for your startup.</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search resources..." className="flex-1" />
      </div>

      {/* Category pills */}
      {categories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange("")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              !activeCategory ? "bg-primary text-white" : "bg-white border border-border text-muted hover:text-foreground"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                activeCategory === cat.id ? "bg-primary text-white" : "bg-white border border-border text-muted hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>
      ) : data.length === 0 ? (
        <EmptyState icon={<BookOpen className="h-8 w-8" />} title="No resources found" description="Try a different search or category." />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((r) => {
              const locked = r.visibility === "MEMBERS_ONLY" && !subscriptionActive;
              return (
                <Card
                  key={r.id}
                  className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${locked ? "opacity-70" : ""}`}
                  onClick={() => !locked && router.push(`/dashboard/resources/${r.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8">
                      {r.type === "LINK" ? <ExternalLink className="h-4 w-4 text-primary" /> : <FileIcon className="h-4 w-4 text-primary" />}
                    </div>
                    {locked ? (
                      <Lock className="h-4 w-4 text-muted" />
                    ) : (
                      <Badge variant={r.visibility === "PUBLIC" ? "success" : "info"}>
                        {r.visibility === "PUBLIC" ? "Free" : "Member"}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{r.title}</h3>
                  {r.description && <p className="text-xs text-muted line-clamp-2">{r.description}</p>}
                  {r.category && <p className="text-[11px] text-muted/60 mt-2">{r.category.name}</p>}
                </Card>
              );
            })}
          </div>
          {meta.totalPages > 1 && (
            <div className="mt-8">
              <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
