"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { api, ApiError } from "@/lib/api";
import type { AvailabilityResponse, AvailabilityWindow } from "@/lib/types";
import { CalendarClock, Plus, Trash2, CalendarDays } from "lucide-react";

const DAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

// 30-minute grid, 00:00 → 23:30, matching the backend slot boundaries.
const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  const v = `${h.toString().padStart(2, "0")}:${m}`;
  return { value: v, label: v };
});

type Row = AvailabilityWindow & { key: string };

let keySeq = 0;
const newKey = () => `row-${keySeq++}`;

export default function MentorAvailabilityPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    api<AvailabilityResponse>("/bookings/availability")
      .then((r) => setRows(r.windows.map((w) => ({ ...w, key: newKey() }))))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const addRow = () => {
    setSuccess("");
    setRows((prev) => [...prev, { key: newKey(), dayOfWeek: 1, startTime: "09:00", endTime: "17:00" }]);
  };

  const updateRow = (key: string, patch: Partial<AvailabilityWindow>) => {
    setSuccess("");
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  };

  const removeRow = (key: string) => {
    setSuccess("");
    setRows((prev) => prev.filter((r) => r.key !== key));
  };

  const invalidRows = useMemo(
    () => rows.filter((r) => toMin(r.endTime) <= toMin(r.startTime)),
    [rows],
  );

  const handleSave = async () => {
    setError("");
    setSuccess("");
    if (invalidRows.length > 0) {
      setError("Each window's end time must be after its start time.");
      return;
    }
    setSaving(true);
    try {
      await api<AvailabilityResponse>("/bookings/availability", {
        method: "PUT",
        body: JSON.stringify({
          windows: rows.map(({ dayOfWeek, startTime, endTime }) => ({
            dayOfWeek,
            startTime,
            endTime,
          })),
        }),
      });
      setSuccess("Availability saved. Startups can now book the open times.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save availability.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  // Group rows by day for a clearer layout.
  const byDay = DAYS.map((d) => ({
    ...d,
    rows: rows.filter((r) => r.dayOfWeek === d.value),
  })).filter((d) => d.rows.length > 0);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Availability</h1>
          <p className="text-muted mt-1">
            Set the weekly windows you&rsquo;re open for sessions. Times are Bahrain time, in
            30-minute slots.
          </p>
        </div>
        <Link href="/mentor/sessions">
          <Button variant="outline" size="sm">
            <CalendarDays className="mr-2 h-4 w-4" /> View Sessions
          </Button>
        </Link>
      </div>

      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card>
        <div className="flex items-center gap-2 mb-5">
          <CalendarClock className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Weekly windows</h2>
        </div>

        {rows.length === 0 ? (
          <p className="text-sm text-muted mb-5">
            No availability set yet. Add a window to start accepting bookings.
          </p>
        ) : (
          <div className="space-y-3 mb-5">
            {rows.map((row) => {
              const invalid = toMin(row.endTime) <= toMin(row.startTime);
              return (
                <div
                  key={row.key}
                  className="grid grid-cols-[1fr_auto] gap-3 items-end rounded-xl border border-border p-3 sm:grid-cols-[1.4fr_1fr_1fr_auto]"
                >
                  <Select
                    label="Day"
                    options={DAYS.map((d) => ({ value: String(d.value), label: d.label }))}
                    value={String(row.dayOfWeek)}
                    onChange={(e) => updateRow(row.key, { dayOfWeek: Number(e.target.value) })}
                  />
                  <Select
                    label="From"
                    options={TIME_OPTIONS}
                    value={row.startTime}
                    onChange={(e) => updateRow(row.key, { startTime: e.target.value })}
                    className={invalid ? "border-danger/50" : ""}
                  />
                  <Select
                    label="To"
                    options={TIME_OPTIONS}
                    value={row.endTime}
                    onChange={(e) => updateRow(row.key, { endTime: e.target.value })}
                    className={invalid ? "border-danger/50" : ""}
                  />
                  <button
                    onClick={() => removeRow(row.key)}
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-muted hover:text-danger hover:bg-danger/5 transition-colors cursor-pointer"
                    aria-label="Remove window"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="outline" size="sm" onClick={addRow}>
            <Plus className="mr-2 h-4 w-4" /> Add window
          </Button>
          <Button isLoading={saving} onClick={handleSave} disabled={invalidRows.length > 0}>
            Save Availability
          </Button>
        </div>
      </Card>

      {byDay.length > 0 && (
        <Card>
          <h3 className="font-semibold mb-3">Summary</h3>
          <div className="space-y-2 text-sm">
            {byDay.map((d) => (
              <div key={d.value} className="flex gap-3">
                <span className="w-24 shrink-0 font-medium">{d.label}</span>
                <span className="text-muted">
                  {d.rows
                    .slice()
                    .sort((a, b) => toMin(a.startTime) - toMin(b.startTime))
                    .map((r) => `${r.startTime}–${r.endTime}`)
                    .join(", ")}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted mt-4">
            Bookings open as 30-minute slots within these windows, for the next 14 days. Slots a
            startup has already booked won&rsquo;t show again.
          </p>
        </Card>
      )}
    </div>
  );
}

function toMin(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}
