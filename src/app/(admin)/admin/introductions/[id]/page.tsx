"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { api, ApiError } from "@/lib/api";
import type { Introduction, IntroductionStatus } from "@/lib/types";
import { ArrowLeft } from "lucide-react";

const statusVariant: Record<IntroductionStatus, "warning" | "info" | "success" | "danger"> = {
  PENDING: "warning",
  IN_PROGRESS: "info",
  COMPLETED: "success",
  DECLINED: "danger",
};

const statusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "DECLINED", label: "Declined" },
];

export default function AdminIntroductionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [intro, setIntro] = useState<Introduction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchIntro = () => {
    api<Introduction>(`/admin/introductions/${id}`)
      .then((data) => {
        setIntro(data);
        setNewStatus(data.status);
        setNotes(data.adminNotes || "");
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchIntro(); }, [id]);

  const handleStatusUpdate = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api(`/admin/introductions/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      setSuccess("Status updated.");
      fetchIntro();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update status.");
    } finally {
      setSaving(false);
    }
  };

  const handleNotesUpdate = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api(`/admin/introductions/${id}/notes`, {
        method: "PATCH",
        body: JSON.stringify({ adminNotes: notes }),
      });
      setSuccess("Notes saved.");
      fetchIntro();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save notes.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Spinner className="h-8 w-8" /></div>;
  }

  if (!intro) {
    return (
      <div className="py-10 text-center">
        <p className="text-muted">{error || "Introduction not found."}</p>
        <Button variant="ghost" className="mt-4" onClick={() => router.push("/admin/introductions")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => router.push("/admin/introductions")}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Introductions
      </button>

      {success && <Alert variant="success" className="mb-5">{success}</Alert>}
      {error && <Alert variant="error" className="mb-5">{error}</Alert>}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Request details */}
        <Card className="lg:col-span-2">
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-xl font-bold">Introduction Request</h1>
            <Badge variant={statusVariant[intro.status]}>{intro.status}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div>
              <p className="text-muted text-xs font-semibold uppercase tracking-wide mb-1">Type</p>
              <Badge variant="neutral">
                {intro.type === "PARTNER_INTRODUCTION" ? "Partner Introduction" : "Mentor Session"}
              </Badge>
            </div>
            <div>
              <p className="text-muted text-xs font-semibold uppercase tracking-wide mb-1">Urgency</p>
              <Badge variant={intro.urgency === "HIGH" ? "danger" : intro.urgency === "MEDIUM" ? "warning" : "neutral"}>
                {intro.urgency}
              </Badge>
            </div>
            <div>
              <p className="text-muted text-xs font-semibold uppercase tracking-wide mb-1">Requester</p>
              <p className="font-medium">{intro.requester?.firstName} {intro.requester?.lastName}</p>
              <p className="text-xs text-muted">{intro.requester?.email}</p>
            </div>
            <div>
              <p className="text-muted text-xs font-semibold uppercase tracking-wide mb-1">Target</p>
              <p className="font-medium">{intro.target?.firstName} {intro.target?.lastName}</p>
              <p className="text-xs text-muted">{intro.target?.email}</p>
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

          <div className="border-t border-border pt-4 mt-4">
            <p className="text-muted text-xs font-semibold uppercase tracking-wide mb-1">Submitted</p>
            <p className="text-sm">{new Date(intro.createdAt).toLocaleString()}</p>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          <Card>
            <h3 className="font-semibold mb-4">Update Status</h3>
            <Select
              options={statusOptions}
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="mb-3"
            />
            <Button
              className="w-full"
              onClick={handleStatusUpdate}
              isLoading={saving}
              disabled={newStatus === intro.status}
            >
              Update Status
            </Button>
          </Card>

          <Card>
            <h3 className="font-semibold mb-4">Admin Notes</h3>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Internal notes (not visible to the requester)..."
              className="mb-3"
            />
            <Button variant="outline" className="w-full" onClick={handleNotesUpdate} isLoading={saving}>
              Save Notes
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
