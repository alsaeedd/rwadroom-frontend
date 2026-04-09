import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white px-8 py-10 sm:px-10 sm:py-12",
        "border border-border/60",
        "shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_24px_rgba(0,0,0,0.06)]",
        "transition-all duration-200",
        className,
      )}
      {...props}
    />
  );
}