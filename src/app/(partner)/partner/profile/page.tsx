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
import type { PartnerProfile } from "@/lib/types";

const schema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  discountDescription: z.string().min(1, "Discount description is required"),
  discountCode: z.string().optional(),
  description: z.string().max(500).optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ProfileForm = z.infer<typeof schema>;

export default function PartnerProfilePage() {
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreate, setIsCreate] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProfileForm>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    api<PartnerProfile>("/users/profile")
      .then((p) => {
        setProfile(p);
        reset({
          companyName: p.companyName,
          discountDescription: p.discountDescription,
          discountCode: p.discountCode || "",
          description: p.description || "",
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
      const result = await api<PartnerProfile>("/users/profile", {
        method,
        body: JSON.stringify({ ...data, website: data.website || undefined, discountCode: data.discountCode || undefined }),
      });
      setProfile(result);
      setIsCreate(false);
      setSuccess(isCreate ? "Profile created!" : "Profile updated.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save profile.");
    }
  };

  const handleLogoUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await apiUpload<PartnerProfile>("/users/profile/logo", formData);
      setProfile(result);
      setSuccess("Logo updated.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed.");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">{isCreate ? "Create Your Profile" : "Company Profile"}</h1>
        <p className="text-muted mt-1">{isCreate ? "Set up your partner profile and discount offer." : "Manage your company listing and discount."}</p>
      </div>

      {success && <Alert variant="success" className="mb-5">{success}</Alert>}
      {error && <Alert variant="error" className="mb-5">{error}</Alert>}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input label="Company Name" error={errors.companyName?.message} {...register("companyName")} />
            <Textarea label="Company Description" placeholder="What does your company do?" error={errors.description?.message} {...register("description")} />
            <Input label="Discount Description" placeholder="e.g. 20% off all services for Rwad Room members" error={errors.discountDescription?.message} {...register("discountDescription")} />
            <Input label="Discount Code (optional)" placeholder="e.g. RWAD20" error={errors.discountCode?.message} {...register("discountCode")} />
            <Input label="Website" type="url" placeholder="https://your-company.com" error={errors.website?.message} {...register("website")} />
            <Button type="submit" isLoading={isSubmitting} size="lg">{isCreate ? "Create Profile" : "Save Changes"}</Button>
          </form>
        </Card>

        {!isCreate && (
          <Card>
            <h3 className="font-semibold mb-4">Company Logo</h3>
            <FileUpload accept="image/jpeg,image/png,image/webp" maxSizeMB={5} onFile={handleLogoUpload} currentUrl={profile?.logoUrl} />
          </Card>
        )}
      </div>
    </div>
  );
}
