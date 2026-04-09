"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { usePaginatedQuery } from "@/lib/hooks/use-paginated-query";
import { useAuthStore } from "@/lib/auth";
import type { PartnerListing } from "@/lib/types";
import { Handshake, Lock } from "lucide-react";

export default function PartnersPage() {
  const router = useRouter();
  const subscriptionActive = useAuthStore((s) => s.user?.subscriptionActive);
  const { data, meta, isLoading, search, setSearch, setPage } =
    usePaginatedQuery<PartnerListing>({ path: "/users/partners" });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Partners</h1>
        <p className="text-muted mt-1">Companies offering exclusive discounts to Rwad Room members.</p>
      </div>

      <div className="mb-6">
        <SearchInput value={search} onChange={setSearch} placeholder="Search partners..." className="max-w-md" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>
      ) : data.length === 0 ? (
        <EmptyState icon={<Handshake className="h-8 w-8" />} title="No partners yet" description="Partners will be listed here once they're added." />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((p) => (
              <Card key={p.id} className="cursor-pointer hover:shadow-lg transition-all duration-200" onClick={() => router.push(`/dashboard/partners/${p.id}`)}>
                <div className="flex items-center gap-3 mb-3">
                  {p.logoUrl ? (
                    <img src={p.logoUrl} alt={p.companyName} className="h-12 w-12 rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/8">
                      <Handshake className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <h3 className="font-semibold">{p.companyName}</h3>
                </div>
                {p.description && <p className="text-xs text-muted line-clamp-2 mb-3">{p.description}</p>}
                {subscriptionActive && p.discountDescription ? (
                  <Badge variant="success">{p.discountDescription}</Badge>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-muted">
                    <Lock className="h-3 w-3" /> Discount for members
                  </div>
                )}
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
