"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api, ApiError } from "@/lib/api";
import { CheckCircle2, XCircle } from "lucide-react";

const schema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Add an uppercase letter to your password")
    .regex(/[0-9]/, "Add a number to your password")
    .regex(/[^a-zA-Z0-9]/, "Add a symbol to your password, like ! or #"),
  acceptTerms: z.boolean(),
});

type SetPasswordForm = z.infer<typeof schema>;

function SetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SetPasswordForm>({
    resolver: zodResolver(schema),
    defaultValues: { acceptTerms: false },
  });
  const acceptedTerms = useWatch({ control, name: "acceptTerms" });

  if (!token) {
    return (
      <Card className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/8">
          <XCircle className="h-8 w-8 text-danger" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Invalid Invite Link</h1>
        <p className="text-muted text-sm mb-8 max-w-xs mx-auto">This invite link is incomplete. Email hello@rwadroom.com for a new one.</p>
        <Link href="/login">
          <Button variant="secondary" className="w-full">Back to Sign In</Button>
        </Link>
      </Card>
    );
  }

  const onSubmit = async (data: SetPasswordForm) => {
    setError("");
    try {
      const result = await api<{ message: string }>("/auth/set-password", {
        method: "POST",
        body: JSON.stringify({ token, password: data.password, acceptTerms: data.acceptTerms }),
      });
      setSuccess(result.message);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Could not reach Rwad Room. Check your connection and try again.");
      }
    }
  };

  if (success) {
    return (
      <Card className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold mb-3">You&apos;re All Set</h1>
        <p className="text-muted text-sm mb-8">{success}</p>
        <Link href="/login">
          <Button className="w-full">Sign In</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome, Partner!</h1>
        <p className="mt-1.5 text-sm text-muted">Set your password to activate your account</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-danger/8 px-4 py-3.5 text-sm font-medium text-danger border border-danger/10">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Input
          label="Password"
          type="password"
          placeholder="Min 8 chars, uppercase, number, symbol"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <label className="flex items-start gap-3 text-sm text-muted leading-relaxed cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary"
            {...register("acceptTerms")}
          />
          <span>
            I have read and agree to the{" "}
            <Link
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:text-primary/80"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:text-primary/80"
            >
              Privacy Policy
            </Link>
          </span>
        </label>

        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={!acceptedTerms}
          className="w-full"
          size="lg"
        >
          Set Password
        </Button>
      </form>
    </Card>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={<Card className="text-center py-16"><Spinner className="mx-auto h-8 w-8" /></Card>}>
      <SetPasswordContent />
    </Suspense>
  );
}
