"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/logo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { FullPageSpinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/lib/auth";
import { api, ApiError } from "@/lib/api";
import {
  CheckCircle2,
  CreditCard,
  Lock,
  ShieldCheck,
  XCircle,
} from "lucide-react";

/**
 * Mock payment gateway. The API's TapService (mock) sends checkouts here with
 * ?charge=<id>; "Pay" posts the same webhook TAP would, so the subscription
 * activates through the real code path. No login needed — the mobile app opens
 * this page in an in-app browser without a web session.
 */
const AMOUNT = 99;
const CURRENCY = "BHD";

function CheckoutMockContent() {
  const router = useRouter();
  const params = useSearchParams();
  const charge = params.get("charge");
  const { isAuthenticated, fetchUser } = useAuthStore();

  const [state, setState] = useState<"idle" | "paying" | "paid" | "cancelled">(
    "idle",
  );
  const [error, setError] = useState("");

  const sendWebhook = async (status: "CAPTURED" | "CANCELLED") => {
    setError("");
    setState(status === "CAPTURED" ? "paying" : "idle");
    try {
      await api("/subscriptions/tap/webhook", {
        method: "POST",
        body: JSON.stringify({
          id: charge,
          status,
          amount: AMOUNT,
          currency: CURRENCY,
        }),
      });
      if (isAuthenticated) await fetchUser();
      setState(status === "CAPTURED" ? "paid" : "cancelled");
    } catch (err) {
      setState("idle");
      setError(
        err instanceof ApiError
          ? err.message
          : "Payment failed. Please try again.",
      );
    }
  };

  if (!charge) {
    return (
      <Card>
        <Alert variant="error">
          This checkout link is missing its charge reference.
        </Alert>
        <Button
          className="w-full mt-4"
          variant="outline"
          onClick={() => router.push("/dashboard/subscription")}
        >
          Back to subscription
        </Button>
      </Card>
    );
  }

  if (state === "paid" || state === "cancelled") {
    const paid = state === "paid";
    return (
      <Card className="text-center">
        <div
          className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full ${
            paid ? "bg-emerald-50 text-emerald-600" : "bg-muted/10 text-muted"
          }`}
        >
          {paid ? (
            <CheckCircle2 className="h-8 w-8" />
          ) : (
            <XCircle className="h-8 w-8" />
          )}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          {paid ? "Payment successful" : "Payment cancelled"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {paid
            ? "Your Rwad Room membership is now active for one year."
            : "No charge was made. You can start a new checkout any time."}
        </p>
        {isAuthenticated ? (
          <Button
            className="w-full mt-6"
            size="lg"
            onClick={() =>
              router.replace(
                paid
                  ? "/dashboard/subscription?paid=1"
                  : "/dashboard/subscription",
              )
            }
          >
            Go to my dashboard
          </Button>
        ) : (
          <p className="mt-6 rounded-xl bg-primary-light px-4 py-3 text-sm font-medium text-primary">
            You can close this window and return to the app.
          </p>
        )}
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Checkout</h1>
          <p className="text-sm text-muted">Rwad Room annual membership</p>
        </div>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          TEST MODE
        </span>
      </div>

      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="mb-6 flex items-end justify-between rounded-xl border border-border bg-background px-4 py-3">
        <span className="text-sm text-muted">Total due today</span>
        <span className="text-2xl font-bold">
          {CURRENCY} {AMOUNT.toFixed(3)}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <Field
          label="Card number"
          value="4242 4242 4242 4242"
          icon={<CreditCard className="h-4 w-4 text-muted" />}
        />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Expiry" value="12 / 28" />
          <Field
            label="CVC"
            value="123"
            icon={<Lock className="h-4 w-4 text-muted" />}
          />
        </div>
        <Field label="Name on card" value="Rwad Room Member" />
      </div>

      <Button
        className="w-full mt-6"
        size="lg"
        isLoading={state === "paying"}
        onClick={() => sendWebhook("CAPTURED")}
      >
        Pay {CURRENCY} {AMOUNT.toFixed(3)}
      </Button>
      <Button
        className="w-full mt-2"
        variant="ghost"
        disabled={state === "paying"}
        onClick={() => sendWebhook("CANCELLED")}
      >
        Cancel payment
      </Button>

      <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted">
        <ShieldCheck className="h-3.5 w-3.5" /> Sandbox gateway — no real card
        is charged.
      </p>
    </Card>
  );
}

function Field({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </span>
      <span className="flex items-center justify-between rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm font-medium">
        {value}
        {icon}
      </span>
    </label>
  );
}

export default function CheckoutMockPage() {
  return (
    <div className="bg-auth flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8">
        <Logo width={160} />
      </div>
      <div className="w-full max-w-md">
        <Suspense fallback={<FullPageSpinner />}>
          <CheckoutMockContent />
        </Suspense>
      </div>
      <p className="mt-8 text-xs text-muted/60">
        Rwad Room — Pioneer your path.
      </p>
    </div>
  );
}
