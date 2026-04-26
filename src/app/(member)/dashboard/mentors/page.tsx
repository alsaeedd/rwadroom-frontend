"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { usePaginatedQuery } from "@/lib/hooks/use-paginated-query";
import { INDUSTRY_FOCUS_LABEL, LANGUAGE_LABEL } from "@/lib/enums";
import type { MentorListing } from "@/lib/types";
import { GraduationCap } from "lucide-react";

export default function MentorsPage() {
  const router = useRouter();
  const { data, meta, isLoading, search, setSearch, setPage } =
    usePaginatedQuery<MentorListing>({ path: "/users/mentors" });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Mentors</h1>
        <p className="text-muted mt-1">Connect with experienced mentors for guidance and sessions.</p>
      </div>

      <div className="mb-6">
        <SearchInput value={search} onChange={setSearch} placeholder="Search mentors..." className="max-w-md" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>
      ) : data.length === 0 ? (
        <EmptyState icon={<GraduationCap className="h-8 w-8" />} title="No mentors yet" description="Mentors will appear here once they're approved." />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((m) => (
              <Card key={m.id} className="cursor-pointer hover:shadow-lg transition-all duration-200" onClick={() => router.push(`/dashboard/mentors/${m.id}`)}>
                <div className="flex items-center gap-3 mb-3">
                  {m.photoUrl ? (
                    <img src={m.photoUrl} alt={m.name} className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/8">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">{m.name}</h3>
                    {m.title && <p className="text-xs text-muted">{m.title}</p>}
                  </div>
                </div>
                {m.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {m.expertise.slice(0, 3).map((e) => (
                      <Badge key={e} variant="neutral">{e}</Badge>
                    ))}
                    {m.expertise.length > 3 && <Badge variant="neutral">+{m.expertise.length - 3}</Badge>}
                  </div>
                )}
                {m.industryFocus.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {m.industryFocus.slice(0, 2).map((i) => (
                      <Badge key={i} variant="info">{INDUSTRY_FOCUS_LABEL[i]}</Badge>
                    ))}
                  </div>
                )}
                {m.languages.length > 0 && (
                  <p className="text-xs text-muted mb-2">
                    Speaks {m.languages.map((l) => LANGUAGE_LABEL[l]).join(", ")}
                  </p>
                )}
                {m.bio && <p className="text-xs text-muted line-clamp-2">{m.bio}</p>}
              </Card>
            ))}
          </div>
          {meta.totalPages > 1 && (
            <div className="mt-8"><Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={setPage} /></div>
          )}
        </>
      )}
    </div>
  );
}
