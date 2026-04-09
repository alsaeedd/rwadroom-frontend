"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={inputId} className="block text-[13px] font-semibold text-foreground/70 tracking-wide uppercase">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={isPassword && showPassword ? "text" : type}
            className={cn(
              "flex h-12 w-full rounded-xl px-4 py-3 text-[15px] text-foreground",
              "bg-white",
              "border border-border",
              "placeholder:text-muted/50",
              "transition-all duration-200 ease-out",
              "focus-visible:outline-none focus-visible:border-primary/50",
              "focus-visible:shadow-[0_0_0_3px_rgba(26,63,196,0.10)]",
              "hover:border-primary/30",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-danger/50 focus-visible:border-danger/60 focus-visible:shadow-[0_0_0_3px_rgba(239,68,68,0.10)]",
              isPassword && "pr-12",
              className,
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors duration-200 cursor-pointer"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
            </button>
          )}
        </div>
        {error && <p className="text-xs font-medium text-danger">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
