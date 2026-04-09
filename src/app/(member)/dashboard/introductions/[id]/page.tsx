"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import type { Introduction, IntroductionStatus } from "@/lib/types";
import { ArrowLeft } from "lucide-react";

const statusVariant: Record<IntroductionStatus, "warning" | "info" | "success" | "danger"> = {
  PENDING: "warning", IN_PROGRESS: "info", COMPLETED: "success", DECLINED: "danger",
};

export default function IntroductionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [intro, setIntro] = useState<Introduction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Introduction>(`/introductions/${id}`)
      .then(setIntro)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;
  if (!intro) return <div className="py-10 text-center text-muted">Request not found.</div>;

  return (
    <div>
      <button onClick={() => router.push("/dashboard/introductions")} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-6 cursor-pointer">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <Card className="max-w-2xl">
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-xl font-bold">Introduction Request</h1>
          <Badge variant={statusVariant[intro.status]}>{intro.status.replace("_", " ")}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <p className="text-muted text-xs font-semibold uppercase tracking-wide mb-1">Type</p>
            <Badge variant="neutral">{intro.type === "PARTNER_INTRODUCTION" ? "Partner Introduction" : "Mentor Session"}</Badge>
          </div>
          <div>
            <p className="text-muted text-xs font-semibold uppercase tracking-wide mb-1">Urgency</p>
            <Badge variant={intro.urgency === "HIGH" ? "danger" : intro.urgency === "MEDIUM" ? "warning" : "neutral"}>{intro.urgency}</Badge>
          </div>
          <div>
            <p className="text-muted text-xs font-semibold uppercase tracking-wide mb-1">Target</p>
            <p className="font-medium">{intro.target?.firstName} {intro.target?.lastName}</p>
          </div>
          <div>
            <p className="text-muted text-xs font-semibold uppercase tracking-wide mb-1">Submitted</p>
            <p>{new Date(intro.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-muted text-xs font-semibold uppercase tracking-wide mb-2">Purpose</p>
          <p className="text-sm leading-relaxed">{intro.purpose}</p>
        </div>

        {intro.context && (
          <div className="border-t border-border pt-4 mt-4">
            <p className="text-muted text-xs font-semibold uppercase tracking-wide mb-2">Additional Context</p>
            <p className="text-sm leading-relaxed text-muted">{intro.context}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
