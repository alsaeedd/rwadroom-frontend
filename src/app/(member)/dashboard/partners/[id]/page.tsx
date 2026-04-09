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
import type { PartnerListing } from "@/lib/types";
import { ArrowLeft, Handshake, Globe, Lock } from "lucide-react";

export default function PartnerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const subscriptionActive = useAuthStore((s) => s.user?.subscriptionActive);
  const [partner, setPartner] = useState<PartnerListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [introModal, setIntroModal] = useState(false);
  const [purpose, setPurpose] = useState("");
  const [urgency, setUrgency] = useState("MEDIUM");
  const [context, setContext] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api<PartnerListing>(`/users/partners/${id}`)
      .then(setPartner)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRequestIntro = async () => {
    setSending(true);
    setError("");
    try {
      await api("/introductions", {
        method: "POST",
        body: JSON.stringify({
          targetId: id,
          type: "PARTNER_INTRODUCTION",
          purpose,
          urgency,
          context: context || undefined,
        }),
      });
      setIntroModal(false);
      setSuccess("Introduction request submitted! Our team will coordinate the connection.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Request failed.");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;
  if (!partner) return <div className="py-10 text-center text-muted">{error || "Partner not found."}</div>;

  return (
    <div>
      <button onClick={() => router.push("/dashboard/partners")} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-6 cursor-pointer">
        <ArrowLeft className="h-4 w-4" /> Back to Partners
      </button>

      {success && <Alert variant="success" className="mb-5">{success}</Alert>}
      {error && <Alert variant="error" className="mb-5">{error}</Alert>}

      <Card className="max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          {partner.logoUrl ? (
            <img src={partner.logoUrl} alt={partner.companyName} className="h-16 w-16 rounded-2xl object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/8">
              <Handshake className="h-7 w-7 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold">{partner.companyName}</h1>
            {partner.website && (
              <a href={partner.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80">
                <Globe className="h-3.5 w-3.5" /> Website
              </a>
            )}
          </div>
        </div>

        {partner.description && <p className="text-sm text-muted leading-relaxed mb-6">{partner.description}</p>}

        {/* Discount section */}
        {subscriptionActive && partner.discountDescription ? (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-4 mb-6">
            <p className="text-sm font-semibold text-emerald-700 mb-1">Exclusive Discount</p>
            <p className="text-sm text-emerald-600">{partner.discountDescription}</p>
            {partner.discountCode && (
              <div className="mt-2 inline-block rounded-lg bg-white px-3 py-1.5 font-mono text-sm font-bold text-emerald-700 border border-emerald-200">
                {partner.discountCode}
              </div>
            )}
          </div>
        ) : !subscriptionActive ? (
          <div className="rounded-xl bg-muted/5 border border-border px-5 py-4 mb-6 flex items-center gap-3">
            <Lock className="h-5 w-5 text-muted shrink-0" />
            <div>
              <p className="text-sm font-medium">Discount locked</p>
              <p className="text-xs text-muted">Subscribe to see exclusive partner discounts.</p>
            </div>
          </div>
        ) : null}

        {subscriptionActive && (
          <Button size="lg" onClick={() => setIntroModal(true)}>
            <Handshake className="mr-2 h-4 w-4" /> Request Introduction
          </Button>
        )}
      </Card>

      {/* Intro request modal */}
      <Modal open={introModal} onClose={() => setIntroModal(false)} title="Request Introduction">
        <div className="flex flex-col gap-4">
          <Textarea label="Purpose" placeholder="Why would you like to connect with this partner?" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
          <Select label="Urgency" options={[{ value: "LOW", label: "Low" }, { value: "MEDIUM", label: "Medium" }, { value: "HIGH", label: "High" }]} value={urgency} onChange={(e) => setUrgency(e.target.value)} />
          <Textarea label="Additional Context (optional)" placeholder="Any extra details..." value={context} onChange={(e) => setContext(e.target.value)} />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => setIntroModal(false)}>Cancel</Button>
            <Button isLoading={sending} disabled={!purpose.trim()} onClick={handleRequestIntro}>Submit Request</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
