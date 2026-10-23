"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { BookingDetail } from "@/lib/types";
import { ArrowLeft, Download, FileText, MessageSquare, Paperclip, Users, Video } from "lucide-react";

const time = (iso: string | null) =>
  iso ? new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "–";
const dateTime = (iso: string) =>
  new Date(iso).toLocaleString([], { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const fileSize = (b: number) =>
  b < 1024 ? `${b} B` : b < 1_048_576 ? `${Math.round(b / 1024)} KB` : `${(b / 1_048_576).toFixed(1)} MB`;

/** One session: when, with whom, who was in the room, the chat and the files shared. Same page for members and mentors. */
export function SessionDetail({ id, backHref, backLabel }: { id: string; backHref: string; backLabel: string }) {
  const meId = useAuthStore((s) => s.user?.id);
  const [b, setB] = useState<BookingDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<BookingDetail>(`/bookings/${id}`)
      .then(setB)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <Alert variant="error">{error}</Alert>;
  if (!b) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const iAmMentor = meId === b.mentor.userId;
  const other = iAmMentor ? b.startup : b.mentor;
  const otherSub = iAmMentor ? b.startup.companyName : b.mentor.title;
  const isJoinable = b.status === "CONFIRMED" && !b.isPast;
  const call = b.call;

  return (
    <div className="space-y-6">
      <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {backLabel}
      </Link>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight truncate">{other.name}</h1>
              <StatusBadge booking={b} />
            </div>
            {otherSub && <p className="text-sm text-muted">{otherSub}</p>}
            <p className="mt-2 text-sm">
              {b.whenLabel} · {b.durationMin} min
            </p>
            {b.purpose && <p className="mt-2 text-sm text-muted">“{b.purpose}”</p>}
            {b.cancellationReason && (
              <p className="mt-2 text-sm text-danger">Cancelled: {b.cancellationReason}</p>
            )}
          </div>
          {isJoinable && (
            <a href={b.meetingUrl} target="_blank" rel="noopener noreferrer" className="shrink-0">
              <Button size="sm">
                <Video className="mr-2 h-4 w-4" /> Join
              </Button>
            </a>
          )}
        </div>
      </Card>

      {!call ? (
        <Card>
          <p className="text-sm text-muted">
            {b.status === "CANCELLED"
              ? "This session was cancelled before anyone joined."
              : b.isPast
                ? "Nobody joined the video room for this session."
                : "Once the call happens, who joined, the chat and any shared files show up here."}
          </p>
        </Card>
      ) : (
        <>
          <Card>
            <SectionTitle icon={<Users className="h-4 w-4" />} title="In the room" />
            <dl className="mt-3 grid grid-cols-3 gap-3 text-sm">
              <div>
                <dt className="text-xs text-muted">Started</dt>
                <dd className="font-medium">{call.startedAt ? dateTime(call.startedAt) : "–"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Ended</dt>
                <dd className="font-medium">{call.endedAt ? time(call.endedAt) : "still open"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Duration</dt>
                <dd className="font-medium">{call.durationMin != null ? `${call.durationMin} min` : "–"}</dd>
              </div>
            </dl>
            <ul className="mt-4 divide-y divide-border text-sm">
              {call.participants.map((x, i) => (
                <li key={i} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2">
                  <span className="font-medium">
                    {x.name}
                    {x.userId === meId && <span className="ml-1.5 text-xs font-normal text-muted">(you)</span>}
                  </span>
                  <span className="text-muted">
                    joined {time(x.joinedAt)} · left {time(x.leftAt)}
                    {x.minutes != null ? ` · ${x.minutes} min` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <SectionTitle
              icon={<MessageSquare className="h-4 w-4" />}
              title="Chat"
              count={call.chat.length}
            />
            {call.chat.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No messages were sent during this session.</p>
            ) : (
              <div className="mt-4 flex flex-col gap-2">
                {call.chat.map((m, i) => {
                  const mine = m.userId === meId;
                  return (
                    <div
                      key={i}
                      className={cn(
                        "max-w-[85%] rounded-2xl border px-4 py-2.5",
                        mine ? "self-end border-primary/15 bg-primary/5" : "self-start border-border bg-white",
                      )}
                    >
                      <p className="mb-0.5 text-xs font-semibold text-muted">
                        {mine ? "You" : m.name} · {time(m.at)}
                      </p>
                      <p className="text-sm whitespace-pre-wrap break-words">{m.text}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          <Card>
            <SectionTitle icon={<Paperclip className="h-4 w-4" />} title="Files shared" count={call.files.length} />
            {call.files.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No files were shared during this session.</p>
            ) : (
              <>
                <ul className="mt-3 divide-y divide-border">
                  {call.files.map((f) => (
                    <li key={f.id} className="flex items-center gap-3 py-2.5">
                      <FileText className="h-5 w-5 shrink-0 text-primary" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{f.name}</p>
                        <p className="text-xs text-muted">
                          {fileSize(f.size)} · {f.uploadedBy} · {time(f.at)}
                        </p>
                      </div>
                      <a href={f.url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline">
                          <Download className="mr-1.5 h-4 w-4" /> Download
                        </Button>
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-muted">Download links work for 15 minutes. Reload the page for fresh ones.</p>
              </>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

function SectionTitle({ icon, title, count }: { icon: React.ReactNode; title: string; count?: number }) {
  return (
    <h2 className="flex items-center gap-2 text-sm font-semibold">
      <span className="text-primary">{icon}</span>
      {title}
      {count != null && count > 0 && <span className="font-normal text-muted">({count})</span>}
    </h2>
  );
}

function StatusBadge({ booking }: { booking: BookingDetail }) {
  if (booking.status === "CANCELLED") return <Badge variant="danger">Cancelled</Badge>;
  if (booking.isPast || booking.status === "COMPLETED") return <Badge variant="neutral">Completed</Badge>;
  return <Badge variant="success">Confirmed</Badge>;
}
