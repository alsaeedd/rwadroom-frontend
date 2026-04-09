"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import { CheckCircle2 } from "lucide-react";

const schema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^a-zA-Z0-9]/, "Must contain a special character"),
});

type ChangePasswordFormData = z.infer<typeof schema>;

export function ChangePasswordForm() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setError("");
    setSuccess("");
    try {
      const result = await api<{ message: string }>("/auth/change-password", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setSuccess(result.message);
      setTimeout(async () => {
        await logout();
        router.replace("/login");
      }, 2000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <Card className="max-w-lg">
      {success && (
        <div className="mb-5 flex items-start gap-3 rounded-xl bg-green-50/80 px-4 py-3 text-sm text-green-700 border border-green-100">
          <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{success} Redirecting to login...</span>
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-xl bg-danger/8 px-4 py-3 text-sm font-medium text-danger border border-danger/10">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Input
          label="Current Password"
          type="password"
          autoComplete="current-password"
          error={errors.currentPassword?.message}
          {...register("currentPassword")}
        />

        <Input
          label="New Password"
          type="password"
          placeholder="Min 8 chars, uppercase, number, symbol"
          autoComplete="new-password"
          error={errors.newPassword?.message}
          {...register("newPassword")}
        />

        <Button type="submit" isLoading={isSubmitting} size="lg">
          Update Password
        </Button>
      </form>
    </Card>
  );
}
