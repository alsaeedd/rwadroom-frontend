"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { useAuthStore } from "@/lib/auth";
import { api, ApiError } from "@/lib/api";
import type { MentorListing } from "@/lib/types";
import { ArrowLeft, GraduationCap, Linkedin } from "lucide-react";

export default function MentorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const subscriptionActive = useAuthStore((s) => s.user?.subscriptionActive);
  const [mentor, setMentor] = useState<MentorListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionModal, setSessionModal] = useState(false);
  const [purpose, setPurpose] = useState("");
  const [urgency, setUrgency] = useState("MEDIUM");
  const [context, setContext] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api<MentorListing>(`/users/mentors/${id}`)
      .then(setMentor)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRequestSession = async () => {
    setSending(true);
    setError("");
    try {
      await api("/introductions", {
        method: "POST",
        body: JSON.stringify({ targetId: id, type: "MENTOR_SESSION", purpose, urgency, context: context || undefined }),
      });
      setSessionModal(false);
      setSuccess("Session request submitted! Our team will coordinate the booking.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Request failed.");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;
  if (!mentor) return <div className="py-10 text-center text-muted">{error || "Mentor not found."}</div>;

  return (
    <div>
      <button onClick={() => router.push("/dashboard/mentors")} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-6 cursor-pointer">
        <ArrowLeft className="h-4 w-4" /> Back to Mentors
      </button>

      {success && <Alert variant="success" className="mb-5">{success}</Alert>}
      {error && <Alert variant="error" className="mb-5">{error}</Alert>}

      <Card className="max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          {mentor.photoUrl ? (
            <img src={mentor.photoUrl} alt={`${mentor.firstName} ${mentor.lastName}`} className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/8">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold">{mentor.firstName} {mentor.lastName}</h1>
            {mentor.title && <p className="text-sm text-muted">{mentor.title}</p>}
          </div>
        </div>

        {mentor.expertise.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {mentor.expertise.map((e) => <Badge key={e} variant="info">{e}</Badge>)}
          </div>
        )}

        {mentor.bio && <p className="text-sm text-muted leading-relaxed mb-6">{mentor.bio}</p>}

        {subscriptionActive && (
          <Button size="lg" onClick={() => setSessionModal(true)}>
            <GraduationCap className="mr-2 h-4 w-4" /> Request Session
          </Button>
        )}
        {!subscriptionActive && (
          <div className="rounded-xl bg-muted/5 border border-border px-5 py-4">
            <p className="text-sm font-medium">Subscribe to request mentor sessions.</p>
            <Button size="sm" className="mt-2" onClick={() => router.push("/dashboard/subscription")}>Subscribe</Button>
          </div>
        )}
      </Card>

      <Modal open={sessionModal} onClose={() => setSessionModal(false)} title="Request Mentor Session">
        <div className="flex flex-col gap-4">
          <Textarea label="Purpose" placeholder="What would you like to discuss?" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
          <Select label="Urgency" options={[{ value: "LOW", label: "Low" }, { value: "MEDIUM", label: "Medium" }, { value: "HIGH", label: "High" }]} value={urgency} onChange={(e) => setUrgency(e.target.value)} />
          <Textarea label="Additional Context (optional)" placeholder="Any extra details..." value={context} onChange={(e) => setContext(e.target.value)} />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => setSessionModal(false)}>Cancel</Button>
            <Button isLoading={sending} disabled={!purpose.trim()} onClick={handleRequestSession}>Submit Request</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
