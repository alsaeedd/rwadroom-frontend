"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Mail, MapPin, MessageCircle, Send } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  topic: z.enum([
    "Membership",
    "Partnership",
    "Mentorship",
    "Press",
    "Other",
  ]),
  message: z.string().min(10, "Please write at least a sentence"),
});

type ContactForm = z.infer<typeof schema>;

const TOPIC_OPTIONS = [
  { value: "Membership", label: "Membership inquiry" },
  { value: "Partnership", label: "Become a partner" },
  { value: "Mentorship", label: "Mentor application" },
  { value: "Press", label: "Press / media" },
  { value: "Other", label: "Something else" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: ContactForm) => {
    setError("");
    // No backend contact endpoint in MVP — fall back to a mailto-style hand-off.
    // If the team sets up a /contact backend route later, swap this for an api() call.
    try {
      const subject = encodeURIComponent(`[Rwad Room — ${data.topic}] from ${data.name}`);
      const body = encodeURIComponent(`${data.message}\n\nFrom: ${data.name} <${data.email}>`);
      window.location.href = `mailto:hello@rwadroom.com?subject=${subject}&body=${body}`;
      setSubmitted(true);
    } catch {
      setError("Could not open your email client. Please email hello@rwadroom.com directly.");
    }
  };

  return (
    <>
      <section className="bg-foreground text-white">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent mb-4">
            Contact
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Let&rsquo;s talk
          </h1>
          <p className="mt-4 text-white/70 max-w-2xl">
            Whether you&rsquo;re an SME, a mentor, a partner, or just curious — drop us a line.
            We read everything personally.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 sm:px-8 py-16 grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <Card className="lg:col-span-2">
          {submitted ? (
            <div className="text-center py-10">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Send className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Your email is being prepared</h2>
              <p className="text-sm text-muted max-w-sm mx-auto">
                We&rsquo;ve opened your email client with your message ready to send. Once you
                hit send we&rsquo;ll get back to you within a couple of business days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              {error && <Alert variant="error">{error}</Alert>}
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Your Name"
                  placeholder="Jane Doe"
                  error={errors.name?.message}
                  {...register("name")}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  {...register("email")}
                />
              </div>
              <Select
                label="What's it about?"
                options={TOPIC_OPTIONS}
                placeholder="Pick a topic"
                error={errors.topic?.message}
                {...register("topic")}
              />
              <Textarea
                label="Message"
                placeholder="Tell us a bit about your inquiry..."
                rows={6}
                error={errors.message?.message}
                {...register("message")}
              />
              <Button type="submit" isLoading={isSubmitting} size="lg">
                <Send className="mr-2 h-4 w-4" /> Send Message
              </Button>
              <p className="text-xs text-muted text-center">
                This will open your email client to send a message to{" "}
                <span className="font-mono">hello@rwadroom.com</span>.
              </p>
            </form>
          )}
        </Card>

        {/* Sidebar */}
        <div className="space-y-5">
          <Card>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 text-primary mb-3">
              <Mail className="h-4 w-4" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">
              Email
            </p>
            <a
              href="mailto:hello@rwadroom.com"
              className="text-sm font-semibold text-foreground hover:text-primary"
            >
              hello@rwadroom.com
            </a>
          </Card>

          <Card>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 text-primary mb-3">
              <MapPin className="h-4 w-4" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">
              Based in
            </p>
            <p className="text-sm font-semibold text-foreground">Manama, Bahrain</p>
          </Card>

          <Card>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 text-primary mb-3">
              <MessageCircle className="h-4 w-4" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">
              Response time
            </p>
            <p className="text-sm font-semibold text-foreground">A couple of business days</p>
          </Card>
        </div>
      </section>
    </>
  );
}
