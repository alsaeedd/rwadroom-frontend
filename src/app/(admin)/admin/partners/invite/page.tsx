"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { api, ApiError } from "@/lib/api";
import { Send, Handshake, Mail, Building2, CheckCircle2 } from "lucide-react";

const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  companyName: z.string().min(1, "Company name is required"),
});

type InviteForm = z.infer<typeof inviteSchema>;

export default function InvitePartnerPage() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [sentCount, setSentCount] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
  });

  const onSubmit = async (data: InviteForm) => {
    setError("");
    setSuccess("");
    try {
      const result = await api<{ message: string }>("/admin/partners/invite", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setSuccess(result.message);
      setSentCount((c) => c + 1);
      reset();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Invite Partner</h1>
        <p className="text-muted mt-1">
          Bring a partner company into Rwad Room. They&apos;ll get an email to set up their account.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Form — takes 3 cols */}
        <div className="lg:col-span-3">
          {success && <Alert variant="success" className="mb-5">{success}</Alert>}
          {error && <Alert variant="error" className="mb-5">{error}</Alert>}

          <Card>
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8">
                <Handshake className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">New Partner Invitation</h2>
                <p className="text-xs text-muted">They&apos;ll receive an email with a link to set their password</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <Input
                label="Company Name"
                placeholder="Acme Corp"
                error={errors.companyName?.message}
                {...register("companyName")}
              />

              <Input
                label="Contact Email"
                type="email"
                placeholder="partner@company.com"
                error={errors.email?.message}
                {...register("email")}
              />

              <Button type="submit" isLoading={isSubmitting} size="lg" className="mt-1">
                <Send className="mr-2 h-4 w-4" />
                Send Invitation
              </Button>
            </form>
          </Card>
        </div>

        {/* Side info — takes 2 cols */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card>
            <h3 className="font-semibold mb-4 text-sm">How it works</h3>
            <ol className="flex flex-col gap-4">
              {[
                { icon: Send, text: "You send the invite with the company name and email" },
                { icon: Mail, text: "They receive an email with a secure link" },
                { icon: Building2, text: "They set a password and fill in their company profile" },
                { icon: CheckCircle2, text: "Their listing goes live in the partner directory" },
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/6 text-primary">
                    <step.icon className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-sm text-muted pt-0.5">{step.text}</p>
                </li>
              ))}
            </ol>
          </Card>

          {sentCount > 0 && (
            <Card className="bg-emerald-50/50 border-emerald-200/60">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-700 text-sm">
                    {sentCount} invitation{sentCount > 1 ? "s" : ""} sent
                  </p>
                  <p className="text-xs text-emerald-600/70">This session</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
