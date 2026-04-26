"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/lib/auth";
import { api, ApiError } from "@/lib/api";
import type { SubscriptionStatus } from "@/lib/types";
import { CreditCard, CheckCircle2, Clock } from "lucide-react";

interface SubscriptionStatusResponse {
  subscriptionRequired: boolean;
  subscriptionActive?: boolean;
  message?: string;
  subscription?: {
    id: string;
    status: SubscriptionStatus;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    createdAt: string;
    lastPayment?: {
      amount: number;
      currency: string;
      status: string;
      date: string;
    } | null;
  } | null;
}

const statusVariant: Record<SubscriptionStatus, "success" | "warning" | "danger" | "neutral"> = {
  ACTIVE: "success",
  PENDING_PAYMENT: "warning",
  EXPIRED: "danger",
  CANCELLED: "neutral",
};

export default function SubscriptionPage() {
  const user = useAuthStore((s) => s.user);
  const [data, setData] = useState<SubscriptionStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api<SubscriptionStatusResponse>("/subscriptions/status")
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setError("");
    try {
      const result = await api<{ checkoutUrl: string }>("/subscriptions/checkout", {
        method: "POST",
      });
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        setError("Checkout returned no URL. Please try again.");
        setCheckoutLoading(false);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Checkout failed. Please try again.");
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  // Mentors / partners / admins don't subscribe.
  if (data && data.subscriptionRequired === false) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Subscription</h1>
        </div>
        <Card>
          <p className="text-muted">
            {data.message ?? "Your role does not require a subscription."}
          </p>
        </Card>
      </div>
    );
  }

  const isActive = user?.subscriptionActive ?? data?.subscriptionActive ?? false;
  const sub = data?.subscription;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Subscription</h1>
        <p className="text-muted mt-1">Manage your Rwad Room membership.</p>
      </div>

      {error && <Alert variant="error" className="mb-5">{error}</Alert>}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Status card */}
        <Card>
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                isActive ? "bg-emerald-50 text-emerald-600" : "bg-muted/8 text-muted"
              }`}
            >
              {isActive ? <CheckCircle2 className="h-7 w-7" /> : <Clock className="h-7 w-7" />}
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {isActive ? "Active Member" : "No Active Subscription"}
              </h2>
              {sub?.status && (
                <Badge variant={statusVariant[sub.status] || "neutral"}>
                  {sub.status.replace("_", " ")}
                </Badge>
              )}
            </div>
          </div>

          {sub && isActive && (
            <div className="grid grid-cols-2 gap-4 text-sm border-t border-border pt-4">
              <div>
                <p className="text-muted text-xs font-semibold uppercase tracking-wide mb-1">
                  Start Date
                </p>
                <p>{new Date(sub.currentPeriodStart).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted text-xs font-semibold uppercase tracking-wide mb-1">
                  Renewal Date
                </p>
                <p>{new Date(sub.currentPeriodEnd).toLocaleDateString()}</p>
              </div>
            </div>
          )}

          {!isActive && (
            <Button
              className="w-full mt-2"
              size="lg"
              isLoading={checkoutLoading}
              onClick={handleCheckout}
            >
              <CreditCard className="mr-2 h-4 w-4" /> Subscribe Now
            </Button>
          )}
        </Card>

        {/* Benefits card */}
        <Card>
          <h3 className="font-semibold mb-4">Membership Benefits</h3>
          <ul className="flex flex-col gap-3 text-sm">
            {[
              "Full access to the resource library",
              "Exclusive partner discounts",
              "Request mentor sessions",
              "Partner introduction requests",
              "Priority community support",
            ].map((benefit) => (
              <li key={benefit} className="flex items-start gap-2">
                <CheckCircle2
                  className={`h-4 w-4 mt-0.5 shrink-0 ${
                    isActive ? "text-emerald-500" : "text-muted/30"
                  }`}
                />
                <span className={isActive ? "text-foreground" : "text-muted"}>{benefit}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
