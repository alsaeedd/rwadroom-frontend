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
import type { StartupProfile } from "@/lib/types";

const schema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  description: z.string().max(500).optional(),
  industry: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ProfileForm = z.infer<typeof schema>;

export default function StartupProfilePage() {
  const [profile, setProfile] = useState<StartupProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreate, setIsCreate] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProfileForm>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    api<StartupProfile>("/users/profile")
      .then((p) => {
        setProfile(p);
        reset({
          companyName: p.companyName,
          description: p.description || "",
          industry: p.industry || "",
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
      const result = await api<StartupProfile>("/users/profile", {
        method,
        body: JSON.stringify({ ...data, website: data.website || undefined }),
      });
      setProfile(result);
      setIsCreate(false);
      setSuccess(isCreate ? "Profile created!" : "Profile updated.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save profile.");
    }
  };

  const handleLogoUpload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await apiUpload<StartupProfile>("/users/profile/logo", formData);
      setProfile(result);
      setSuccess("Logo updated.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Logo upload failed.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Spinner className="h-8 w-8" /></div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          {isCreate ? "Create Your Profile" : "My Profile"}
        </h1>
        <p className="text-muted mt-1">
          {isCreate ? "Set up your startup profile to get started." : "Keep your company information up to date."}
        </p>
      </div>

      {success && <Alert variant="success" className="mb-5">{success}</Alert>}
      {error && <Alert variant="error" className="mb-5">{error}</Alert>}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input label="Company Name" error={errors.companyName?.message} {...register("companyName")} />
            <Textarea label="Description" placeholder="Tell us about your startup..." error={errors.description?.message} {...register("description")} />
            <Input label="Industry" placeholder="e.g. FinTech, HealthTech" error={errors.industry?.message} {...register("industry")} />
            <Input label="Website" type="url" placeholder="https://your-startup.com" error={errors.website?.message} {...register("website")} />
            <Button type="submit" isLoading={isSubmitting} size="lg">
              {isCreate ? "Create Profile" : "Save Changes"}
            </Button>
          </form>
        </Card>

        {!isCreate && (
          <Card>
            <h3 className="font-semibold mb-4">Company Logo</h3>
            <FileUpload
              accept="image/jpeg,image/png,image/webp"
              maxSizeMB={5}
              onFile={handleLogoUpload}
              currentUrl={profile?.logoUrl}
            />
            {uploading && <p className="text-xs text-muted mt-2">Uploading...</p>}
          </Card>
        )}
      </div>
    </div>
  );
}
