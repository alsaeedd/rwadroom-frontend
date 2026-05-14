"use client";

import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface DescriptiveOption<T extends string> {
  value: T;
  label: string;
  description: string;
}

interface DescriptiveSelectProps<T extends string> {
  label?: string;
  placeholder?: string;
  options: DescriptiveOption<T>[];
  value: T | "";
  onChange: (value: T) => void;
  error?: string;
  disabled?: boolean;
}

/**
 * Dropdown where each option carries a one-liner description visible
 * in the open list. Use this when option names are jargon-y and the
 * user benefits from explanation at the moment of choice.
 */
export function DescriptiveSelect<T extends string>({
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
  disabled,
}: DescriptiveSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click + Escape.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value) ?? null;

  return (
    <div className="flex flex-col gap-2" ref={containerRef}>
      {label && (
        <label className="block text-[13px] font-semibold text-foreground/70 tracking-wide uppercase">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            "flex h-12 w-full items-center justify-between rounded-xl px-4 py-3 text-[15px] text-left",
            "bg-white border transition-all duration-200 ease-out",
            "focus-visible:outline-none focus-visible:border-primary/50",
            "focus-visible:shadow-[0_0_0_3px_rgba(26,63,196,0.10)]",
            "hover:border-primary/30",
            error ? "border-danger/50" : "border-border",
            disabled && "cursor-not-allowed opacity-50",
            open && "border-primary/50 shadow-[0_0_0_3px_rgba(26,63,196,0.10)]",
          )}
        >
          <span className={cn(selected ? "text-foreground" : "text-muted")}>
            {selected ? selected.label : placeholder ?? "Select..."}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted shrink-0 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>

        {open && (
          <div
            role="listbox"
            className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-xl border border-border bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
          >
            <ul className="max-h-[320px] overflow-y-auto py-1.5">
              {options.map((opt) => {
                const active = opt.value === value;
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        onChange(opt.value);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors",
                        active
                          ? "bg-primary/[0.06]"
                          : "hover:bg-foreground/[0.03] focus-visible:bg-foreground/[0.03]",
                        "focus-visible:outline-none",
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "text-[14px] font-semibold leading-tight",
                            active ? "text-primary" : "text-foreground",
                          )}
                        >
                          {opt.label}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-muted">
                          {opt.description}
                        </p>
                      </div>
                      {active && (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {error && <p className="text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}
