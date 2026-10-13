"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChipMultiSelect } from "@/components/ui/chip-multi-select";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { DeleteAccountCard } from "@/components/delete-account-card";
import { api, apiUpload, ApiError } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import {
  INDUSTRY_FOCUS_OPTIONS,
  LANGUAGE_OPTIONS,
  PROFILE_STATUS_LABEL,
} from "@/lib/enums";
import type { IndustryFocus, Language, MentorProfile } from "@/lib/types";

const INDUSTRY_VALUES = INDUSTRY_FOCUS_OPTIONS.map((o) => o.value) as [
  IndustryFocus,
  ...IndustryFocus[],
];
const LANGUAGE_VALUES = LANGUAGE_OPTIONS.map((o) => o.value) as [Language, ...Language[]];

const LINK_HELP = "Add your LinkedIn profile or website so we can verify you.";

const schema = z.object({
  title: z.string().optional(),
  bio: z.string().max(2000, "Bio must be 2000 characters or fewer").optional(),
  expertise: z.string().min(1, "Add at least one area of expertise"),
  industryFocus: z.array(z.enum(INDUSTRY_VALUES)),
  languages: z.array(z.enum(LANGUAGE_VALUES)).min(1, "Choose at least one language"),
  discountNote: z.string().max(500, "Discount note must be 500 characters or fewer").optional(),
  linkedinUrl: z.string().url("Enter your LinkedIn URL in the correct format, like https://linkedin.com/in/yourname").optional().or(z.literal("")),
  website: z.string().url("Enter your website in the correct format, like https://example.com").optional().or(z.literal("")),
}).refine((d) => d.linkedinUrl || d.website, { message: LINK_HELP, path: ["linkedinUrl"] });

type ProfileForm = z.infer<typeof schema>;

export default function MentorProfilePage() {
  const [profile, setProfile] = useState<MentorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreate, setIsCreate] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const noteRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (success || error) noteRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [success, error]);
  const [visibilityBusy, setVisibilityBusy] = useState(false);
  const fetchUser = useAuthStore((s) => s.fetchUser);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(schema),
    defaultValues: { industryFocus: [], languages: ["ENGLISH"] },
  });

  useEffect(() => {
    api<MentorProfile>("/users/profile")
      .then((p) => {
        setProfile(p);
        reset({
          title: p.title || "",
          bio: p.bio || "",
          expertise: p.expertise.join(", "),
          industryFocus: p.industryFocus ?? [],
          languages: p.languages?.length ? p.languages : ["ENGLISH"],
          discountNote: p.discountNote || "",
          linkedinUrl: p.linkedinUrl || "",
          website: p.website || "",
        });
      })
      .catch(() => setIsCreate(true))
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data: ProfileForm) => {
    setError("");
    setSuccess("");
    try {
      const method = isCreate ? "POST" : "PATCH";
      const result = await api<MentorProfile>("/users/profile", {
        method,
        body: JSON.stringify({
          ...data,
          expertise: data.expertise
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          discountNote: data.discountNote || undefined,
          linkedinUrl: data.linkedinUrl || undefined,
          website: data.website || undefined,
        }),
      });
      setProfile(result);
      setIsCreate(false);
      setSuccess(
        !isCreate
          ? "Profile updated."
          : result.status === "APPROVED"
            ? "Profile created. Your account is approved."
            : "Profile submitted for review.",
      );
      await fetchUser();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save profile.");
    }
  };

  const handlePhotoUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await apiUpload<{ imageUrl: string }>("/users/profile/logo", formData);
      setProfile((p) => (p ? { ...p, photoUrl: result.imageUrl } : p));
      setSuccess("Photo updated.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed.");
    }
  };

  const toggleVisibility = async () => {
    if (!profile) return;
    setVisibilityBusy(true);
    setError("");
    setSuccess("");
    try {
      const next = !profile.isPubliclyVisible;
      const result = await api<MentorProfile>("/users/profile/visibility", {
        method: "PATCH",
        body: JSON.stringify({ isPubliclyVisible: next }),
      });
      setProfile(result);
      setSuccess(next ? "You are now publicly listed." : "You are hidden from public mentor listings.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update visibility.");
    } finally {
      setVisibilityBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          {isCreate ? "Create Your Profile" : "My Profile"}
        </h1>
        <p className="text-muted mt-1">
          {isCreate
            ? "Set up your mentor profile so startups can find you."
            : "Keep your profile up to date."}
        </p>
      </div>

      <div ref={noteRef}>
        {success && (
          <Alert variant="success" className="mb-5">
            {success}
          </Alert>
        )}
        {error && (
          <Alert variant="error" className="mb-5">
            {error}
          </Alert>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              label="Title"
              placeholder="e.g. CEO, Business Consultant"
              error={errors.title?.message}
              {...register("title")}
            />
            <Textarea
              label="Bio"
              placeholder="Tell startups about your experience..."
              error={errors.bio?.message}
              {...register("bio")}
            />
            <Input
              label="Expertise (comma-separated)"
              placeholder="e.g. Product Strategy, Fundraising, Growth"
              error={errors.expertise?.message}
              {...register("expertise")}
            />
            <Controller
              control={control}
              name="industryFocus"
              render={({ field }) => (
                <ChipMultiSelect<IndustryFocus>
                  label="Industry Focus"
                  helper="Industries you specialize in mentoring."
                  options={INDUSTRY_FOCUS_OPTIONS}
                  value={field.value as IndustryFocus[]}
                  onChange={field.onChange}
                  error={errors.industryFocus?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="languages"
              render={({ field }) => (
                <ChipMultiSelect<Language>
                  label="Languages"
                  helper="Languages you can mentor in."
                  options={LANGUAGE_OPTIONS}
                  value={field.value as Language[]}
                  onChange={field.onChange}
                  error={errors.languages?.message}
                />
              )}
            />
            <Textarea
              label="Community Discount Note (optional)"
              placeholder="e.g. First 30-min session free for Rwad Room members."
              error={errors.discountNote?.message}
              {...register("discountNote")}
            />
            <Input
              label="LinkedIn URL"
              type="url"
              placeholder="https://linkedin.com/in/your-profile"
              helper={LINK_HELP}
              error={errors.linkedinUrl?.message}
              {...register("linkedinUrl")}
            />
            <Input
              label="Website"
              type="url"
              placeholder="https://your-site.com"
              helper={LINK_HELP}
              error={errors.website?.message}
              {...register("website")}
            />
            <Button type="submit" isLoading={isSubmitting} size="lg">
              {isCreate ? "Create Profile" : "Save Changes"}
            </Button>
          </form>
        </Card>

        <div className="flex flex-col gap-6">
          {!isCreate && (
            <Card>
              <h3 className="font-semibold mb-4">Profile Photo</h3>
              <FileUpload
                accept="image/jpeg,image/png,image/webp"
                maxSizeMB={5}
                onFile={handlePhotoUpload}
                currentUrl={profile?.photoUrl}
              />
            </Card>
          )}

          {!isCreate && profile && (
            <Card>
              <h3 className="font-semibold mb-3">Status</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Approval</span>
                <Badge
                  variant={
                    profile.status === "APPROVED"
                      ? "success"
                      : profile.status === "REJECTED"
                        ? "danger"
                        : "warning"
                  }
                >
                  {PROFILE_STATUS_LABEL[profile.status]}
                </Badge>
              </div>

              <div className="mt-5 pt-5 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">Public listing</span>
                  <Badge variant={profile.isPubliclyVisible ? "success" : "neutral"}>
                    {profile.isPubliclyVisible ? "Visible" : "Hidden"}
                  </Badge>
                </div>
                <p className="text-xs text-muted mb-3">
                  {profile.status === "APPROVED"
                    ? "Toggle whether you appear in the public mentor directory."
                    : "Visibility controls unlock once your profile is approved by an admin."}
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  disabled={profile.status !== "APPROVED" || visibilityBusy}
                  onClick={toggleVisibility}
                  isLoading={visibilityBusy}
                >
                  {profile.isPubliclyVisible ? "Hide from directory" : "Show in directory"}
                </Button>
              </div>
            </Card>
          )}

          {!isCreate && <DeleteAccountCard />}
        </div>
      </div>
    </div>
  );
}
