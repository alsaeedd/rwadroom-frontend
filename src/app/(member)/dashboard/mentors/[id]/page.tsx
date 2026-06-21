"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { useAuthStore } from "@/lib/auth";
import { api, ApiError } from "@/lib/api";
import { INDUSTRY_FOCUS_LABEL, LANGUAGE_LABEL } from "@/lib/enums";
import type { MentorListing, BookingSlot, SlotsResponse } from "@/lib/types";
import { ArrowLeft, GraduationCap, Sparkles, CalendarDays, Clock } from "lucide-react";

export default function MentorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const subscriptionActive = useAuthStore((s) => s.user?.subscriptionActive);
  const [mentor, setMentor] = useState<MentorListing | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking state
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookModal, setBookModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [purpose, setPurpose] = useState("");
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api<MentorListing>(`/users/mentors/${id}`)
      .then(setMentor)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Load open slots once we know the mentor's user id and the viewer is subscribed.
  useEffect(() => {
    if (!mentor || !subscriptionActive) return;
    setSlotsLoading(true);
    api<SlotsResponse>(`/bookings/mentor/${mentor.userId}/slots`)
      .then((r) => setSlots(r.slots))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [mentor, subscriptionActive]);

  const openBooking = (slot: BookingSlot) => {
    setSelectedSlot(slot);
    setPurpose("");
    setError("");
    setBookModal(true);
  };

  const handleBook = async () => {
    if (!mentor || !selectedSlot) return;
    setBooking(true);
    setError("");
    try {
      await api("/bookings", {
        method: "POST",
        body: JSON.stringify({
          mentorId: mentor.userId,
          scheduledAt: selectedSlot.start,
          purpose: purpose.trim() || undefined,
        }),
      });
      setBookModal(false);
      setSuccess(
        `Your session is booked for ${selectedSlot.label} (Bahrain time). Check your email for the video link and calendar invite.`,
      );
      // Drop the slot we just took so the list stays accurate.
      setSlots((prev) => prev.filter((s) => s.start !== selectedSlot.start));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Booking failed.");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }
  if (!mentor) {
    return <div className="py-10 text-center text-muted">{error || "Mentor not found."}</div>;
  }

  // Group slots by calendar day for a tidier picker. The label starts with the
  // weekday + date (e.g. "Sun, 22 Jun 2026, 14:00–14:30").
  const slotsByDay = groupSlotsByDay(slots);

  return (
    <div>
      <button
        onClick={() => router.push("/dashboard/mentors")}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Mentors
      </button>

      {success && (
        <Alert variant="success" className="mb-5">
          {success}
        </Alert>
      )}
      {error && !bookModal && (
        <Alert variant="error" className="mb-5">
          {error}
        </Alert>
      )}

      <Card className="max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          {mentor.photoUrl ? (
            <img
              src={mentor.photoUrl}
              alt={mentor.name}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/8">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold">{mentor.name}</h1>
            {mentor.title && <p className="text-sm text-muted">{mentor.title}</p>}
          </div>
        </div>

        {mentor.expertise.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">
              Expertise
            </p>
            <div className="flex flex-wrap gap-1.5">
              {mentor.expertise.map((e) => (
                <Badge key={e} variant="info">
                  {e}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {mentor.industryFocus.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">
              Industry Focus
            </p>
            <div className="flex flex-wrap gap-1.5">
              {mentor.industryFocus.map((i) => (
                <Badge key={i} variant="neutral">
                  {INDUSTRY_FOCUS_LABEL[i]}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {mentor.languages.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">
              Languages
            </p>
            <p className="text-sm">{mentor.languages.map((l) => LANGUAGE_LABEL[l]).join(" · ")}</p>
          </div>
        )}

        {mentor.bio && <p className="text-sm text-muted leading-relaxed mb-6">{mentor.bio}</p>}

        {mentor.discountNote && (
          <div className="mb-6 rounded-xl bg-accent/8 border border-accent/20 px-4 py-3">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-0.5">
                  Community Offer
                </p>
                <p className="text-sm text-foreground">{mentor.discountNote}</p>
              </div>
            </div>
          </div>
        )}

        {!subscriptionActive && (
          <div className="rounded-xl bg-muted/5 border border-border px-5 py-4">
            <p className="text-sm font-medium">Subscribe to book a session with this mentor.</p>
            <Button
              size="sm"
              className="mt-2"
              onClick={() => router.push("/dashboard/subscription")}
            >
              Subscribe
            </Button>
          </div>
        )}
      </Card>

      {/* Booking panel */}
      {subscriptionActive && (
        <Card className="max-w-2xl mt-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Book a session</h2>
          </div>

          {slotsLoading ? (
            <div className="flex justify-center py-8">
              <Spinner className="h-6 w-6" />
            </div>
          ) : slots.length === 0 ? (
            <p className="text-sm text-muted">
              This mentor has no open times right now. Check back soon — availability is updated
              regularly.
            </p>
          ) : (
            <div className="space-y-5">
              <p className="text-sm text-muted">
                Pick a 30-minute slot below. Times are shown in Bahrain time. You&rsquo;ll get a
                video-call link and calendar invite by email.
              </p>
              {slotsByDay.map((group) => (
                <div key={group.day}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">
                    {group.day}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.slots.map((slot) => (
                      <button
                        key={slot.start}
                        onClick={() => openBooking(slot)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-medium hover:border-primary hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer"
                      >
                        <Clock className="h-3.5 w-3.5" />
                        {group.time(slot)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      <Modal open={bookModal} onClose={() => setBookModal(false)} title="Confirm your session">
        <div className="flex flex-col gap-4">
          {selectedSlot && (
            <div className="rounded-xl bg-primary/5 border border-primary/15 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">
                When (Bahrain time)
              </p>
              <p className="text-sm font-medium">{selectedSlot.label}</p>
              <p className="text-xs text-muted mt-1">with {mentor.name}</p>
            </div>
          )}
          {error && <Alert variant="error">{error}</Alert>}
          <Textarea
            label="What would you like to discuss? (optional)"
            placeholder="A sentence or two helps your mentor prepare."
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            maxLength={500}
          />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => setBookModal(false)}>
              Cancel
            </Button>
            <Button isLoading={booking} onClick={handleBook}>
              Confirm Booking
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Splits "Sun, 22 Jun 2026, 14:00–14:30" into a day header and a time chip.
function groupSlotsByDay(slots: BookingSlot[]) {
  const groups: { day: string; slots: BookingSlot[]; time: (s: BookingSlot) => string }[] = [];
  const byDay = new Map<string, BookingSlot[]>();

  for (const slot of slots) {
    const comma = slot.label.lastIndexOf(", ");
    const day = comma > -1 ? slot.label.slice(0, comma) : slot.label;
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day)!.push(slot);
  }

  for (const [day, daySlots] of byDay) {
    groups.push({
      day,
      slots: daySlots,
      time: (s: BookingSlot) => {
        const comma = s.label.lastIndexOf(", ");
        return comma > -1 ? s.label.slice(comma + 2) : s.label;
      },
    });
  }

  return groups;
}
