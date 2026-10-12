"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { api, ApiError } from "@/lib/api";

interface PlatformSettings {
  requireApproval: boolean;
  trialEnabled: boolean;
  trialDays: number;
}

export default function AdminSettingsPage() {
  const [form, setForm] = useState<PlatformSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api<PlatformSettings>("/admin/settings")
      .then(setForm)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load settings."));
  }, []);

  const set = (patch: Partial<PlatformSettings>) => {
    setForm((f) => (f ? { ...f, ...patch } : f));
    setSaved(false);
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError("");
    try {
      const { requireApproval, trialEnabled, trialDays } = form;
      setForm(
        await api<PlatformSettings>("/admin/settings", {
          method: "PATCH",
          body: JSON.stringify({ requireApproval, trialEnabled, trialDays }),
        }),
      );
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted mt-1">How new accounts join the platform.</p>
      </div>

      {error && (
        <Alert variant="error" className="mb-5">
          {error}
        </Alert>
      )}

      {!form ? (
        !error && (
          <div className="flex justify-center py-20">
            <Spinner className="h-8 w-8" />
          </div>
        )
      ) : (
        <Card className="max-w-lg">
          <form onSubmit={save} className="flex flex-col gap-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 shrink-0 accent-primary"
                checked={form.requireApproval}
                onChange={(e) => set({ requireApproval: e.target.checked })}
              />
              <span>
                <span className="block text-sm font-semibold">
                  Require admin approval for new accounts
                </span>
                <span className="block text-xs text-muted mt-0.5">
                  Off = accounts are approved the moment they submit their profile.
                </span>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 shrink-0 accent-primary"
                checked={form.trialEnabled}
                onChange={(e) => set({ trialEnabled: e.target.checked })}
              />
              <span>
                <span className="block text-sm font-semibold">Free trial for new startups</span>
                <span className="block text-xs text-muted mt-0.5">
                  Startups get full member access, without paying, from the moment they are approved.
                </span>
              </span>
            </label>

            <div>
              <Input
                label="Trial length (days)"
                type="number"
                min={0}
                max={90}
                required
                value={Number.isNaN(form.trialDays) ? "" : form.trialDays}
                onChange={(e) => set({ trialDays: e.target.valueAsNumber })}
              />
              <p className="text-xs text-muted mt-2">
                0–90 days. Changes apply to startups approved from now on.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" isLoading={saving}>
                Save
              </Button>
              {saved && <span className="text-sm font-medium text-emerald-600">Saved</span>}
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
