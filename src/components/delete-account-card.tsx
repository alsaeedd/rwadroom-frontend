"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/alert";
import { api, ApiError } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";

/** Self-service account deletion: confirm with the password, then sign out. */
export function DeleteAccountCard() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const close = () => {
    setOpen(false);
    setPassword("");
    setError("");
  };

  const confirm = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/users/me", { method: "DELETE", body: JSON.stringify({ password }) });
      await logout();
      router.replace("/login");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete your account.");
      setBusy(false);
    }
  };

  return (
    <Card>
      <h3 className="font-semibold mb-1">Delete account</h3>
      <p className="text-xs text-muted mb-4">
        Removes your access, cancels your upcoming sessions and takes your profile out of the
        directories. This cannot be undone.
      </p>
      <Button variant="danger" size="sm" className="w-full" onClick={() => setOpen(true)}>
        Delete account
      </Button>

      <Modal open={open} onClose={close} title="Delete your account?">
        <form onSubmit={confirm} className="flex flex-col gap-5">
          <p className="text-sm text-muted">Enter your password to confirm. This cannot be undone.</p>
          {error && <Alert variant="error">{error}</Alert>}
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" isLoading={busy}>
              Delete account
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
}
