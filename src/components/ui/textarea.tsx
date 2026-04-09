"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={textareaId} className="block text-[13px] font-semibold text-foreground/70 tracking-wide uppercase">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "flex w-full rounded-xl px-4 py-3 text-[15px] text-foreground min-h-[120px] resize-y",
            "bg-white",
            "border border-border",
            "placeholder:text-muted/50",
            "transition-all duration-200 ease-out",
            "focus-visible:outline-none focus-visible:border-primary/50",
            "focus-visible:shadow-[0_0_0_3px_rgba(26,63,196,0.10)]",
            "hover:border-primary/30",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-danger/50 focus-visible:border-danger/60",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs font-medium text-danger">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
