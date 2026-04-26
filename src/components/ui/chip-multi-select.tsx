"use client";

import { cn } from "@/lib/utils";

interface ChipMultiSelectProps<T extends string> {
  label?: string;
  helper?: string;
  options: { value: T; label: string }[];
  value: T[];
  onChange: (next: T[]) => void;
  error?: string;
  disabled?: boolean;
}

/**
 * Chip-style multi-select for short option lists. Click to toggle.
 * Friendlier than a native multi-select for 5–15 options.
 */
export function ChipMultiSelect<T extends string>({
  label,
  helper,
  options,
  value,
  onChange,
  error,
  disabled,
}: ChipMultiSelectProps<T>) {
  const selected = new Set(value);

  function toggle(v: T) {
    if (disabled) return;
    const next = new Set(selected);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    onChange(Array.from(next));
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="block text-[13px] font-semibold text-foreground/70 tracking-wide uppercase">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isOn = selected.has(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              disabled={disabled}
              aria-pressed={isOn}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1",
                isOn
                  ? "bg-primary text-white border border-primary shadow-sm"
                  : "bg-white text-foreground/70 border border-border hover:border-primary/40 hover:text-foreground",
                disabled && "opacity-50 cursor-not-allowed",
              )}
            >
              {isOn && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M2.5 6L5 8.5L9.5 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {opt.label}
            </button>
          );
        })}
      </div>
      {helper && !error && (
        <p className="text-xs text-muted">{helper}</p>
      )}
      {error && <p className="text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}
