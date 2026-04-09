"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";
import { Mail } from "lucide-react";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^a-zA-Z0-9]/, "Must contain a special character"),
  role: z.enum(["STARTUP", "MENTOR"], "Please select a role"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "STARTUP" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterForm) => {
    setError("");
    setSuccess("");
    try {
      const result = await api<{ message: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
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
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/8">
          <Mail className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Check Your Email</h1>
        <p className="text-muted text-sm mb-8 leading-relaxed max-w-xs mx-auto">{success}</p>
        <Link href="/login">
          <Button variant="outline" className="w-full">
            Back to Sign In
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Create Account</h1>
        <p className="mt-1.5 text-sm text-muted">Join the Rwad Room community</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-danger/8 px-4 py-3.5 text-sm font-medium text-danger border border-danger/10">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Input
          label="Full Name"
          placeholder="John Doe"
          autoComplete="name"
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Min 8 chars, uppercase, number, symbol"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex flex-col gap-2">
          <label className="block text-[13px] font-semibold text-foreground/70 tracking-wide uppercase">I am a</label>
          <div className="grid grid-cols-2 gap-3">
            {(["STARTUP", "MENTOR"] as const).map((role) => (
              <label
                key={role}
                className={`flex cursor-pointer items-center justify-center rounded-xl border-2 px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${
                  selectedRole === role
                    ? "border-primary bg-primary/6 text-primary"
                    : "border-border bg-white text-muted hover:border-primary/30"
                }`}
              >
                <input
                  type="radio"
                  value={role}
                  {...register("role")}
                  className="sr-only"
                />
                {role === "STARTUP" ? "Startup Founder" : "Mentor"}
              </label>
            ))}
          </div>
          {errors.role && <p className="text-xs font-medium text-danger">{errors.role.message}</p>}
        </div>

        <Button type="submit" isLoading={isSubmitting} className="w-full" size="lg">
          Create Account
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-border text-center">
        <p className="text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors duration-200">
            Sign In
          </Link>
        </p>
      </div>
    </Card>
  );
}
