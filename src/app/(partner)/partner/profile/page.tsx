"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { api, apiUpload, ApiError } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import { PROFILE_STATUS_LABEL, SECTOR_OPTIONS } from "@/lib/enums";
import type { PartnerProfile, Sector } from "@/lib/types";

const SECTOR_VALUES = SECTOR_OPTIONS.map((o) => o.value) as [Sector, ...Sector[]];

const schema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  serviceCategory: z.enum(SECTOR_VALUES).optional().or(z.literal("")),
  discountDescription: z.string().min(5, "Discount description is required").max(500),
  discountCode: z.string().max(100).optional(),
  description: z.string().max(2000).optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ProfileForm = z.infer<typeof schema>;

export default function PartnerProfilePage() {
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreate, setIsCreate] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [visibilityBusy, setVisibilityBusy] = useState(false);
  const fetchUser = useAuthStore((s) => s.fetchUser);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    api<PartnerProfile>("/users/profile")
      .then((p) => {
        setProfile(p);
        reset({
          companyName: p.companyName,
          serviceCategory: p.serviceCategory || "",
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
        body: JSON.stringify({
          ...data,
          serviceCategory: data.serviceCategory || undefined,
          website: data.website || undefined,
          discountCode: data.discountCode || undefined,
        }),
      });
      setProfile(result);
      setIsCreate(false);
      // Invited partners are pre-approved, so their profile goes live on create.
      setSuccess(isCreate ? "Profile created and published." : "Profile updated.");
      await fetchUser();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save profile.");
    }
  };

  const handleLogoUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await apiUpload<{ imageUrl: string }>("/users/profile/logo", formData);
      setProfile((p) => (p ? { ...p, logoUrl: result.imageUrl } : p));
      setSuccess("Logo updated.");
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
      const result = await api<PartnerProfile>("/users/profile/visibility", {
        method: "PATCH",
        body: JSON.stringify({ isPubliclyVisible: next }),
      });
      setProfile(result);
      setSuccess(next ? "Your company is now publicly listed." : "Your company is hidden from public listings.");
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
          {isCreate ? "Create Your Profile" : "Company Profile"}
        </h1>
        <p className="text-muted mt-1">
          {isCreate
            ? "Set up your partner profile and discount offer."
            : "Manage your company listing and discount."}
        </p>
      </div>

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

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              label="Company Name"
              error={errors.companyName?.message}
              {...register("companyName")}
            />
            <Select
              label="Service Category"
              placeholder="Select a category"
              options={SECTOR_OPTIONS}
              error={errors.serviceCategory?.message}
              {...register("serviceCategory")}
            />
            <Textarea
              label="Company Description"
              placeholder="What does your company do?"
              error={errors.description?.message}
              {...register("description")}
            />
            <Input
              label="Discount Description"
              placeholder="e.g. 20% off all services for Rwad Room members"
              error={errors.discountDescription?.message}
              {...register("discountDescription")}
            />
            <Input
              label="Discount Code (optional)"
              placeholder="e.g. RWAD20"
              error={errors.discountCode?.message}
              {...register("discountCode")}
            />
            <Input
              label="Website"
              type="url"
              placeholder="https://your-company.com"
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
              <h3 className="font-semibold mb-4">Company Logo</h3>
              <FileUpload
                accept="image/jpeg,image/png,image/webp"
                maxSizeMB={5}
                onFile={handleLogoUpload}
                currentUrl={profile?.logoUrl}
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
                    ? "Toggle whether your company appears in the public partners directory."
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
        </div>
      </div>
    </div>
  );
}
