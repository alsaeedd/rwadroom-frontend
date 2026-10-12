"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { SupportTicket, TicketStatus } from "@/lib/types";
import { ArrowLeft, LifeBuoy, Send } from "lucide-react";

const statusVariant: Record<TicketStatus, "warning" | "success" | "neutral"> = {
  OPEN: "warning",
  ANSWERED: "success",
  CLOSED: "neutral",
};

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return <Badge variant={statusVariant[status]}>{status}</Badge>;
}

const message = (err: unknown, fallback: string) =>
  err instanceof ApiError ? err.message : fallback;

/** Member support page: "Contact us" form + the member's tickets. */
export function SupportPage({ basePath }: { basePath: string }) {
  const [tickets, setTickets] = useState<SupportTicket[] | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    api<SupportTicket[]>("/support/tickets")
      .then(setTickets)
      .catch((err) => {
        setTickets([]);
        setError(message(err, "Could not load your tickets."));
      });
  };

  useEffect(load, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSent(false);
    setError("");
    try {
      await api("/support/tickets", {
        method: "POST",
        body: JSON.stringify({ subject, message: body }),
      });
      setSubject("");
      setBody("");
      setSent(true);
      load();
    } catch (err) {
      setError(message(err, "Could not send your message."));
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Support</h1>
        <p className="text-muted mt-1">
          Questions, problems or feedback — the Rwad Room team replies here and by email.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2 h-fit px-6 py-6 sm:px-8 sm:py-8">
          <h2 className="font-semibold mb-5">Contact us</h2>
          <form onSubmit={submit} className="flex flex-col gap-4">
            {sent && <Alert variant="success">Sent. We&rsquo;ll get back to you soon.</Alert>}
            {error && <Alert variant="error">{error}</Alert>}
            <Input
              label="Subject"
              placeholder="What do you need help with?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={120}
              required
            />
            <Textarea
              label="Message"
              placeholder="Tell us what happened…"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={4000}
              required
            />
            <Button type="submit" isLoading={sending} disabled={!subject.trim() || !body.trim()}>
              <Send className="mr-2 h-4 w-4" /> Send
            </Button>
          </form>
        </Card>

        <section className="lg:col-span-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-3">
            Your tickets
          </h2>
          {tickets === null ? (
            <div className="flex justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          ) : tickets.length === 0 ? (
            <EmptyState
              icon={<LifeBuoy className="h-6 w-6" />}
              title="No tickets yet"
              description="Messages you send us will appear here with our replies."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {tickets.map((t) => (
                <Link
                  key={t.id}
                  href={`${basePath}/${t.id}`}
                  className="rounded-xl border border-border bg-white px-5 py-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 font-medium break-words">{t.subject}</p>
                    <TicketStatusBadge status={t.status} />
                  </div>
                  {t.lastMessage && (
                    <p className="mt-1 text-sm text-muted line-clamp-1">
                      {t.lastMessage.isStaff ? "Rwad Room: " : "You: "}
                      {t.lastMessage.body}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-muted">
                    Updated {new Date(t.updatedAt).toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/** One ticket thread with a reply box. Admins also get Close / Reopen. */
export function TicketThread({
  id,
  backHref,
  admin = false,
}: {
  id: string;
  backHref: string;
  admin?: boolean;
}) {
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    api<SupportTicket>(`/support/tickets/${id}`)
      .then(setTicket)
      .catch((err) => setError(message(err, "Could not load this ticket.")))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const act = async (path: string, init: RequestInit, fallback: string) => {
    setBusy(true);
    setError("");
    try {
      await api(path, init);
      return true;
    } catch (err) {
      setError(message(err, fallback));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const ok = await act(
      admin ? `/admin/tickets/${id}/reply` : `/support/tickets/${id}/messages`,
      { method: "POST", body: JSON.stringify({ body: reply }) },
      "Could not send your reply.",
    );
    if (ok) setReply("");
    load();
  };

  const setStatus = async (status: TicketStatus) => {
    await act(
      `/admin/tickets/${id}/status`,
      { method: "PATCH", body: JSON.stringify({ status }) },
      "Could not update the ticket.",
    );
    load();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const back = (
    <Link
      href={backHref}
      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-6"
    >
      <ArrowLeft className="h-4 w-4" /> Back
    </Link>
  );

  if (!ticket) {
    return (
      <div>
        {back}
        <p className="text-muted">{error || "Ticket not found."}</p>
      </div>
    );
  }

  const owner = ticket.user;

  return (
    <div className="max-w-3xl">
      {back}
      {error && (
        <Alert variant="error" className="mb-5">
          {error}
        </Alert>
      )}

      <Card className="px-6 py-6 sm:px-8 sm:py-8">
        <div className="flex items-start justify-between gap-4">
          <h1 className="min-w-0 text-xl font-bold tracking-tight break-words">{ticket.subject}</h1>
          <TicketStatusBadge status={ticket.status} />
        </div>
        <p className="mt-1 text-sm text-muted">
          {admin && owner
            ? `${owner.firstName} ${owner.lastName} · ${owner.email} · ${owner.role.toLowerCase()} · `
            : ""}
          Opened {new Date(ticket.createdAt).toLocaleDateString()}
        </p>

        <div className="mt-6 flex flex-col gap-3">
          {ticket.messages?.map((m) => {
            // Your own messages sit on the right, the other side's on the left.
            const mine = m.isStaff === admin;
            const name = `${m.author?.firstName ?? ""} ${m.author?.lastName ?? ""}`.trim();
            return (
              <div
                key={m.id}
                className={cn(
                  "max-w-[85%] rounded-2xl border px-4 py-3",
                  mine ? "self-end border-primary/15 bg-primary/5" : "self-start border-border bg-white",
                )}
              >
                <p className="mb-1 text-xs font-semibold text-muted">
                  {admin ? name || "Member" : m.isStaff ? "Rwad Room team" : "You"} ·{" "}
                  {new Date(m.createdAt).toLocaleString()}
                </p>
                <p className="text-sm whitespace-pre-wrap break-words">{m.body}</p>
              </div>
            );
          })}
        </div>

        <form onSubmit={send} className="mt-6 flex flex-col gap-3 border-t border-border pt-6">
          {!admin && ticket.status === "CLOSED" && (
            <p className="text-xs text-muted">This ticket is closed. Replying reopens it.</p>
          )}
          <Textarea
            placeholder={admin ? "Reply to the member…" : "Write a reply…"}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            maxLength={4000}
            required
          />
          <div className="flex flex-wrap items-center justify-end gap-3">
            {admin && (
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => setStatus(ticket.status === "CLOSED" ? "OPEN" : "CLOSED")}
              >
                {ticket.status === "CLOSED" ? "Reopen" : "Close ticket"}
              </Button>
            )}
            <Button type="submit" isLoading={busy} disabled={!reply.trim()}>
              <Send className="mr-2 h-4 w-4" /> Send reply
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
