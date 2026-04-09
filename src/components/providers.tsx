"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/lib/auth";

export function Providers({ children }: { children: ReactNode }) {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return <>{children}</>;
}
