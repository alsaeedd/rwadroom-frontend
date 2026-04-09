import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

type AlertVariant = "success" | "error" | "warning" | "info";

const config: Record<AlertVariant, { icon: typeof CheckCircle2; bg: string; text: string; border: string }> = {
  success: { icon: CheckCircle2, bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  error: { icon: XCircle, bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  warning: { icon: AlertTriangle, bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  info: { icon: Info, bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
};

export function Alert({
  children,
  variant = "info",
  className,
}: {
  children: React.ReactNode;
  variant?: AlertVariant;
  className?: string;
}) {
  const { icon: Icon, bg, text, border } = config[variant];
  return (
    <div className={cn("flex items-start gap-3 rounded-xl border px-4 py-3 text-sm", bg, text, border, className)}>
      <Icon className="h-4 w-4 mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
