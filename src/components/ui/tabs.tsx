"use client";

import { cn } from "@/lib/utils";

interface Tab {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex gap-1 border-b border-border", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer -mb-px border-b-2",
            activeTab === tab.value
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:text-foreground hover:border-border",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
