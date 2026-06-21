"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { api, ApiError } from "@/lib/api";
import type { Booking, BookingsListResponse } from "@/lib/types";
import { CalendarDays, Video, GraduationCap, X } from "lucide-react";

export default function MySessionsPage() {
  const [data, setData] = useState<BookingsListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = () => {
    api<BookingsListResponse>("/bookings")
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this session? Your mentor will be notified.")) return;
    setCancelling(id);
    setError("");
    try {
      await api(`/bookings/${id}`, { method: "DELETE" });
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not cancel the session.");
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const upcoming = data?.upcoming ?? [];
  const past = data?.past ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Sessions</h1>
        <p className="text-muted mt-1">Your booked mentor sessions.</p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {upcoming.length === 0 && past.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="h-6 w-6" />}
          title="No sessions yet"
          description="Browse mentors and book a 30-minute session that fits your schedule."
          action={
            <Link href="/dashboard/mentors">
              <Button>
                <GraduationCap className="mr-2 h-4 w-4" /> Browse Mentors
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-3">
              Upcoming
            </h2>
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted">No upcoming sessions.</p>
            ) : (
              <div className="space-y-3">
                {upcoming.map((b) => (
                  <SessionCard
                    key={b.id}
                    booking={b}
                    counterpartLabel={b.mentor.name}
                    counterpartSub={b.mentor.title}
                    onCancel={() => handleCancel(b.id)}
                    cancelling={cancelling === b.id}
                  />
                ))}
              </div>
            )}
          </section>

          {past.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-3">
                Past & cancelled
              </h2>
              <div className="space-y-3">
                {past.map((b) => (
                  <SessionCard
                    key={b.id}
                    booking={b}
                    counterpartLabel={b.mentor.name}
                    counterpartSub={b.mentor.title}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function SessionCard({
  booking,
  counterpartLabel,
  counterpartSub,
  onCancel,
  cancelling,
}: {
  booking: Booking;
  counterpartLabel: string;
  counterpartSub?: string | null;
  onCancel?: () => void;
  cancelling?: boolean;
}) {
  const isCancelled = booking.status === "CANCELLED";
  const isJoinable = booking.status === "CONFIRMED" && !booking.isPast;

  return (
    <Card className={isCancelled ? "opacity-70" : ""}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold truncate">{counterpartLabel}</p>
            <StatusBadge booking={booking} />
          </div>
          {counterpartSub && <p className="text-xs text-muted mb-1">{counterpartSub}</p>}
          <p className="text-sm">{booking.whenLabel} · {booking.durationMin} min</p>
          {booking.purpose && (
            <p className="text-sm text-muted mt-1.5 line-clamp-2">“{booking.purpose}”</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isJoinable && (
            <a href={booking.meetingUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm">
                <Video className="mr-2 h-4 w-4" /> Join
              </Button>
            </a>
          )}
          {isJoinable && onCancel && (
            <Button variant="ghost" size="sm" isLoading={cancelling} onClick={onCancel}>
              <X className="mr-1.5 h-4 w-4" /> Cancel
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

function StatusBadge({ booking }: { booking: Booking }) {
  if (booking.status === "CANCELLED") return <Badge variant="danger">Cancelled</Badge>;
  if (booking.isPast || booking.status === "COMPLETED")
    return <Badge variant="neutral">Completed</Badge>;
  return <Badge variant="success">Confirmed</Badge>;
}
