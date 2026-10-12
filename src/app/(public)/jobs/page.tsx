"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { api } from "@/lib/api";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { SearchInput } from "@/components/ui/search-input";
import { Spinner } from "@/components/ui/spinner";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { JobMeta } from "@/components/jobs";
import { JOB_TYPE_OPTIONS, SECTOR_OPTIONS } from "@/lib/enums";
import type { Job, PaginatedResponse } from "@/lib/types";
import { Briefcase } from "lucide-react";

export default function PublicJobsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [sector, setSector] = useState("");
  const [remote, setRemote] = useState(false);
  const [page, setPage] = useState(1);
  const q = useDebounce(search, 300);

  const params = new URLSearchParams({ page: String(page), limit: "24" });
  if (q) params.set("q", q);
  if (type) params.set("type", type);
  if (sector) params.set("sector", sector);
  if (remote) params.set("remote", "true");
  const key = params.toString();

  // Results remember the query that produced them: "loading" just means the
  // results on screen are for a different query.
  const [res, setRes] = useState<(PaginatedResponse<Job> & { key: string }) | null>(null);
  useEffect(() => {
    let current = true;
    api<PaginatedResponse<Job>>(`/jobs?${key}`)
      .then((r) => {
        if (current) setRes({ ...r, key });
      })
      .catch(() => {
        if (current) setRes({ key, data: [], meta: { total: 0, page: 1, limit: 24, totalPages: 0 } });
      });
    return () => {
      current = false;
    };
  }, [key]);
  const loading = res?.key !== key;

  // Every filter change starts again from page 1.
  const filter = (apply: () => void) => {
    apply();
    setPage(1);
  };

  return (
    <>
      <section className="bg-foreground text-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent mb-4">Jobs</p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Work with Bahrain&rsquo;s startups and SMEs
          </h1>
          <p className="mt-4 text-white/70 max-w-2xl">
            Open roles from Rwad Room members and partners, reviewed by our team before they go
            live.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-12">
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <SearchInput
              value={search}
              onChange={(v) => filter(() => setSearch(v))}
              placeholder="Search by title or company..."
              className="max-w-sm w-full"
            />
            <div className="flex flex-wrap gap-2">
              <Chip active={!type} onClick={() => filter(() => setType(""))}>
                All types
              </Chip>
              {JOB_TYPE_OPTIONS.map((o) => (
                <Chip key={o.value} active={type === o.value} onClick={() => filter(() => setType(o.value))}>
                  {o.label}
                </Chip>
              ))}
              <Chip active={remote} onClick={() => filter(() => setRemote(!remote))}>
                Remote only
              </Chip>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip active={!sector} onClick={() => filter(() => setSector(""))}>
              All sectors
            </Chip>
            {SECTOR_OPTIONS.map((o) => (
              <Chip
                key={o.value}
                active={sector === o.value}
                onClick={() => filter(() => setSector(o.value))}
              >
                {o.label}
              </Chip>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner className="h-8 w-8" />
          </div>
        ) : !res?.data.length ? (
          <EmptyState
            icon={<Briefcase className="h-8 w-8" />}
            title="No open roles match"
            description="Try a different search or filter — new roles are posted every week."
          />
        ) : (
          <>
            <p className="mb-4 text-sm text-muted">
              <span className="font-semibold text-foreground">{res.meta.total}</span> open role
              {res.meta.total === 1 ? "" : "s"}
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {res.data.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="rounded-2xl bg-white border border-border p-6 hover:border-primary/30 hover:shadow-md transition-all flex flex-col gap-3"
                >
                  <div>
                    <h3 className="font-semibold text-foreground">{job.title}</h3>
                    <p className="text-sm text-muted mt-0.5">{job.companyName}</p>
                  </div>
                  <div className="mt-auto">
                    <JobMeta job={job} />
                  </div>
                </Link>
              ))}
            </div>
            {res.meta.totalPages > 1 && (
              <div className="mt-10">
                <Pagination
                  currentPage={res.meta.page}
                  totalPages={res.meta.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
        active
          ? "bg-primary text-white border-primary"
          : "bg-white text-foreground/70 border-border hover:border-primary/40"
      }`}
    >
      {children}
    </button>
  );
}
