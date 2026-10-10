"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api, ApiError } from "@/lib/api";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  // The token is single-use; React StrictMode runs this effect twice in dev.
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    api<{ message: string }>("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
      .then((data) => {
        setStatus("success");
        setMessage(data.message);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err instanceof ApiError ? err.message : "Verification failed. The link may have expired.");
      });
  }, [token]);

  return (
    <Card className="text-center">
      {status === "loading" && (
        <div className="py-8">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/8">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <h1 className="text-xl font-bold">Verifying your email...</h1>
          <p className="mt-2 text-sm text-muted">This will only take a moment</p>
        </div>
      )}

      {status === "success" && (
        <>
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Email Verified</h1>
          <p className="text-muted text-sm mb-8 leading-relaxed max-w-xs mx-auto">{message}</p>
          <Link href="/login">
            <Button className="w-full">Sign In</Button>
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/8">
            <XCircle className="h-8 w-8 text-danger" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Verification Failed</h1>
          <p className="text-muted text-sm mb-8 leading-relaxed max-w-xs mx-auto">{message}</p>
          <Link href="/login">
            <Button className="w-full">Back to Sign In</Button>
          </Link>
        </>
      )}
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Card className="text-center py-16"><Spinner className="mx-auto h-8 w-8" /></Card>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
