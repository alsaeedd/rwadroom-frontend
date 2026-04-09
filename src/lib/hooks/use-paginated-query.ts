"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useDebounce } from "./use-debounce";
import type { PaginatedResponse } from "@/lib/types";

interface Filters {
  [key: string]: string | undefined;
}

interface UsePaginatedQueryOptions {
  path: string;
  limit?: number;
  initialFilters?: Filters;
}

interface UsePaginatedQueryResult<T> {
  data: T[];
  meta: { total: number; page: number; totalPages: number; limit: number };
  isLoading: boolean;
  error: string;
  page: number;
  search: string;
  filters: Filters;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setFilters: (filters: Filters) => void;
  refresh: () => void;
}

export function usePaginatedQuery<T>({
  path,
  limit = 20,
  initialFilters = {},
}: UsePaginatedQueryOptions): UsePaginatedQueryResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 0, limit });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [refreshKey, setRefreshKey] = useState(0);

  const debouncedSearch = useDebounce(search, 300);

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters]);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError("");

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (debouncedSearch) params.set("search", debouncedSearch);

    for (const [key, value] of Object.entries(filters)) {
      if (value) params.set(key, value);
    }

    api<PaginatedResponse<T>>(`${path}?${params.toString()}`)
      .then((res) => {
        if (!cancelled) {
          setData(res.data);
          setMeta(res.meta);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Failed to load data");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [path, page, limit, debouncedSearch, filters, refreshKey]);

  return { data, meta, isLoading, error, page, search, filters, setPage, setSearch, setFilters, refresh };
}
