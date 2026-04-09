"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-semibold tracking-wide transition-all duration-200 ease-out cursor-pointer",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2",
          "active:scale-[0.98]",
          {
            "bg-accent text-white shadow-[0_2px_8px_rgba(255,87,51,0.25)] hover:shadow-[0_4px_16px_rgba(255,87,51,0.35)] hover:brightness-110":
              variant === "primary",
            "bg-primary text-white shadow-[0_2px_8px_rgba(26,63,196,0.20)] hover:shadow-[0_4px_16px_rgba(26,63,196,0.30)] hover:brightness-110":
              variant === "secondary",
            "border border-border bg-white text-foreground hover:bg-background hover:shadow-sm":
              variant === "outline",
            "bg-transparent text-muted hover:text-foreground hover:bg-black/5":
              variant === "ghost",
            "bg-danger text-white shadow-[0_2px_8px_rgba(239,68,68,0.25)] hover:shadow-[0_4px_16px_rgba(239,68,68,0.35)] hover:brightness-110":
              variant === "danger",
          },
          {
            "h-9 px-4 text-xs": size === "sm",
            "h-11 px-6 text-sm": size === "md",
            "h-12 px-8 text-[15px]": size === "lg",
          },
          className,
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";