"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ChipMultiSelect } from "@/components/ui/chip-multi-select";
import { DescriptiveSelect } from "@/components/ui/descriptive-select";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { api, apiUpload, ApiError } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import {
  BUSINESS_STAGE_DESCRIBED_OPTIONS,
  BUSINESS_STAGE_OPTIONS,
  COUNTRY_OPTIONS,
  PROFILE_STATUS_LABEL,
  SECTOR_OPTIONS,
} from "@/lib/enums";
import type { BusinessStage, Country, Sector, StartupProfile } from "@/lib/types";

const SECTOR_VALUES = SECTOR_OPTIONS.map((o) => o.value) as [Sector, ...Sector[]];
const STAGE_VALUES = BUSINESS_STAGE_OPTIONS.map((o) => o.value) as [BusinessStage, ...BusinessStage[]];
const COUNTRY_VALUES = COUNTRY_OPTIONS.map((o) => o.value) as [Country, ...Country[]];

const schema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  description: z.string().max(2000).optional(),
  sector: z.enum(SECTOR_VALUES).optional().or(z.literal("")),
  businessStage: z.enum(STAGE_VALUES).optional().or(z.literal("")),
  locations: z.array(z.enum(COUNTRY_VALUES)).min(1, "Pick at least one location"),
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
    defaultValues: { locations: ["BAHRAIN"] },
  });

  useEffect(() => {
    api<StartupProfile>("/users/profile")
      .then((p) => {
        setProfile(p);
        reset({
          companyName: p.companyName,
          description: p.description || "",
          sector: p.sector || "",
          businessStage: p.businessStage || "",
          locations: p.locations?.length ? p.locations : ["BAHRAIN"],
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
        body: JSON.stringify({
          ...data,
          sector: data.sector || undefined,
          businessStage: data.businessStage || undefined,
          website: data.website || undefined,
        }),
      });
      setProfile(result);
      setIsCreate(false);
      setSuccess(isCreate ? "Profile submitted for review." : "Profile updated.");
      // Submitting/resubmitting flips the account status (INCOMPLETE/REJECTED ->
      // PENDING). Refresh the cached user so the layout reflects the new state.
      await fetchUser();
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
      const result = await apiUpload<{ imageUrl: string }>("/users/profile/logo", formData);
      setProfile((p) => (p ? { ...p, logoUrl: result.imageUrl } : p));
      setSuccess("Logo updated.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Logo upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const toggleVisibility = async () => {
    if (!profile) return;
    setVisibilityBusy(true);
    setError("");
    setSuccess("");
    try {
      const next = !profile.isPubliclyVisible;
      const result = await api<StartupProfile>("/users/profile/visibility", {
        method: "PATCH",
        body: JSON.stringify({ isPubliclyVisible: next }),
      });
      setProfile(result);
      setSuccess(next ? "Your profile is now publicly listed." : "Your profile is hidden from public listings.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update visibility.");
    } finally {
      setVisibilityBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
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
            ? "Set up your startup profile to get started."
            : "Keep your company information up to date."}
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
            <Textarea
              label="Description"
              placeholder="Tell us about your startup..."
              error={errors.description?.message}
              {...register("description")}
            />
            <div className="grid gap-5 sm:grid-cols-2 sm:items-start">
              <Select
                label="Sector / Category"
                placeholder="Select a sector"
                options={SECTOR_OPTIONS}
                error={errors.sector?.message}
                {...register("sector")}
              />
              <Controller
                control={control}
                name="businessStage"
                render={({ field }) => (
                  <DescriptiveSelect<BusinessStage>
                    label="Business Stage"
                    placeholder="Select a stage"
                    options={BUSINESS_STAGE_DESCRIBED_OPTIONS}
                    value={(field.value as BusinessStage) ?? ""}
                    onChange={field.onChange}
                    error={errors.businessStage?.message}
                  />
                )}
              />
            </div>
            <Controller
              control={control}
              name="locations"
              render={({ field }) => (
                <ChipMultiSelect<Country>
                  label="Locations"
                  helper="Where do you operate? Pick all that apply."
                  options={COUNTRY_OPTIONS}
                  value={field.value as Country[]}
                  onChange={field.onChange}
                  error={errors.locations?.message}
                />
              )}
            />
            <Input
              label="Website"
              type="url"
              placeholder="https://your-startup.com"
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
              {uploading && <p className="text-xs text-muted mt-2">Uploading...</p>}
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
                    ? "Toggle whether your company appears in the public community directory."
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
