"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
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
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^a-zA-Z0-9]/, "Must contain a special character"),
});

type ResetForm = z.infer<typeof schema>;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({
    resolver: zodResolver(schema),
  });

  if (!token) {
    return (
      <Card className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/8">
          <XCircle className="h-8 w-8 text-danger" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Invalid Link</h1>
        <p className="text-muted text-sm mb-8 max-w-xs mx-auto">No reset token found. Please request a new password reset.</p>
        <Link href="/forgot-password">
          <Button className="w-full">Request New Link</Button>
        </Link>
      </Card>
    );
  }

  const onSubmit = async (data: ResetForm) => {
    setError("");
    try {
      const result = await api<{ message: string }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password: data.password }),
      });
      setSuccess(result.message);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  if (success) {
    return (
      <Card className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Password Reset</h1>
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
        <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
        <p className="mt-1.5 text-sm text-muted">Enter your new password below</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-danger/8 px-4 py-3.5 text-sm font-medium text-danger border border-danger/10">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Input
          label="New Password"
          type="password"
          placeholder="Min 8 chars, uppercase, number, symbol"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" isLoading={isSubmitting} className="w-full" size="lg">
          Reset Password
        </Button>
      </form>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Card className="text-center py-16"><Spinner className="mx-auto h-8 w-8" /></Card>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
