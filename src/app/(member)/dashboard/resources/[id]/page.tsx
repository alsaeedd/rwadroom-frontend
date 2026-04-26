"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { useAuthStore } from "@/lib/auth";
import { api, ApiError } from "@/lib/api";
import type { Resource } from "@/lib/types";
import { ArrowLeft, Download, ExternalLink, Lock } from "lucide-react";

export default function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const subscriptionActive = useAuthStore((s) => s.user?.subscriptionActive);
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Resource>(`/resources/${id}`)
      .then(setResource)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async () => {
    try {
      const result = await api<{ downloadUrl: string; fileName: string; expiresInSeconds: number }>(
        `/resources/${id}/download`,
      );
      if (result.downloadUrl) window.open(result.downloadUrl, "_blank");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Download failed.");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;
  if (!resource) return <div className="py-10 text-center text-muted">{error || "Resource not found."}</div>;

  const locked = resource.visibility === "MEMBERS_ONLY" && !subscriptionActive;

  return (
    <div>
      <button onClick={() => router.push("/dashboard/resources")} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-6 cursor-pointer">
        <ArrowLeft className="h-4 w-4" /> Back to Resources
      </button>

      {error && <Alert variant="error" className="mb-5">{error}</Alert>}

      <Card className="max-w-2xl">
        <div className="flex items-start justify-between mb-4">
          <Badge variant={resource.visibility === "PUBLIC" ? "success" : "info"}>
            {resource.visibility === "PUBLIC" ? "Free" : "Members Only"}
          </Badge>
          {resource.category && <span className="text-xs text-muted">{resource.category.name}</span>}
        </div>

        <h1 className="text-xl font-bold mb-3">{resource.title}</h1>
        {resource.description && <p className="text-sm text-muted leading-relaxed mb-6">{resource.description}</p>}

        {locked ? (
          <div className="rounded-xl bg-muted/5 border border-border px-5 py-6 text-center">
            <Lock className="h-8 w-8 text-muted mx-auto mb-3" />
            <p className="font-semibold mb-1">Members Only</p>
            <p className="text-sm text-muted mb-4">Subscribe to access this resource.</p>
            <Button onClick={() => router.push("/dashboard/subscription")}>Subscribe</Button>
          </div>
        ) : resource.type === "LINK" && resource.externalUrl ? (
          <Button size="lg" onClick={() => window.open(resource.externalUrl!, "_blank")}>
            <ExternalLink className="mr-2 h-4 w-4" /> Open Link
          </Button>
        ) : (
          <Button size="lg" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
        )}
      </Card>
    </div>
  );
}
