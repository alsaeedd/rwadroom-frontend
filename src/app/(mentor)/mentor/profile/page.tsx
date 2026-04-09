"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { api, apiUpload, ApiError } from "@/lib/api";
import type { MentorProfile } from "@/lib/types";

const schema = z.object({
  title: z.string().optional(),
  bio: z.string().max(1000).optional(),
  expertise: z.string().min(1, "At least one area of expertise"),
  linkedinUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ProfileForm = z.infer<typeof schema>;

export default function MentorProfilePage() {
  const [profile, setProfile] = useState<MentorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreate, setIsCreate] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProfileForm>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    api<MentorProfile>("/users/profile")
      .then((p) => {
        setProfile(p);
        reset({
          title: p.title || "",
          bio: p.bio || "",
          expertise: p.expertise.join(", "),
          linkedinUrl: p.linkedinUrl || "",
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
          expertise: data.expertise.split(",").map((s) => s.trim()).filter(Boolean),
          linkedinUrl: data.linkedinUrl || undefined,
        }),
      });
      setProfile(result);
      setIsCreate(false);
      setSuccess(isCreate ? "Profile created!" : "Profile updated.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save profile.");
    }
  };

  const handlePhotoUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await apiUpload<MentorProfile>("/users/profile/logo", formData);
      setProfile(result);
      setSuccess("Photo updated.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed.");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">{isCreate ? "Create Your Profile" : "My Profile"}</h1>
        <p className="text-muted mt-1">{isCreate ? "Set up your mentor profile so startups can find you." : "Keep your profile up to date."}</p>
      </div>

      {success && <Alert variant="success" className="mb-5">{success}</Alert>}
      {error && <Alert variant="error" className="mb-5">{error}</Alert>}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input label="Title" placeholder="e.g. CEO, Business Consultant" error={errors.title?.message} {...register("title")} />
            <Textarea label="Bio" placeholder="Tell startups about your experience..." error={errors.bio?.message} {...register("bio")} />
            <Input label="Expertise (comma-separated)" placeholder="e.g. Marketing, Fundraising, Growth" error={errors.expertise?.message} {...register("expertise")} />
            <Input label="LinkedIn URL" type="url" placeholder="https://linkedin.com/in/your-profile" error={errors.linkedinUrl?.message} {...register("linkedinUrl")} />
            <Button type="submit" isLoading={isSubmitting} size="lg">{isCreate ? "Create Profile" : "Save Changes"}</Button>
          </form>
        </Card>

        {!isCreate && (
          <Card>
            <h3 className="font-semibold mb-4">Profile Photo</h3>
            <FileUpload accept="image/jpeg,image/png,image/webp" maxSizeMB={5} onFile={handlePhotoUpload} currentUrl={profile?.photoUrl} />
          </Card>
        )}
      </div>
    </div>
  );
}
