"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Alert } from "@/components/ui/alert";
import { apiUpload, ApiError } from "@/lib/api";
import type { Resource, ResourceCategory } from "@/lib/types";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional(),
  type: z.enum(["FILE", "LINK"]),
  categoryId: z.string().min(1, "Category is required"),
  visibility: z.enum(["PUBLIC", "MEMBERS_ONLY"]),
  externalUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ResourceFormValues = z.infer<typeof schema>;

/**
 * Create (POST) or, given `resource`, edit (PATCH) a resource. Shared by the
 * admin library and member submissions; always multipart, like the API.
 */
export function ResourceForm({
  endpoint,
  categories,
  resource,
  submitLabel,
  onDone,
  onCancel,
}: {
  endpoint: string;
  categories: ResourceCategory[];
  resource?: Resource;
  submitLabel: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ResourceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: resource
      ? {
          title: resource.title,
          description: resource.description ?? "",
          type: resource.type,
          categoryId: resource.categoryId,
          visibility: resource.visibility,
          externalUrl: resource.externalUrl ?? "",
        }
      : { type: "FILE", visibility: "MEMBERS_ONLY" },
  });

  // Type is fixed once created (the API rejects changing it).
  const resourceType = resource?.type ?? watch("type");

  const onSubmit = async (data: ResourceFormValues) => {
    setError("");
    if (resourceType === "FILE" && !file && !resource) {
      setError("Please select a file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description ?? "");
    formData.append("categoryId", data.categoryId);
    formData.append("visibility", data.visibility);
    if (!resource) formData.append("type", resourceType);
    if (resourceType === "LINK" && data.externalUrl) formData.append("externalUrl", data.externalUrl);
    if (resourceType === "FILE" && file) formData.append("file", file);
    try {
      await apiUpload(endpoint, formData, resource ? "PATCH" : "POST");
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save resource.");
    }
  };

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {error && <Alert variant="error">{error}</Alert>}

      <Input label="Title" placeholder="Resource title" error={errors.title?.message} {...register("title")} />

      <Textarea label="Description" placeholder="Brief description (optional)" error={errors.description?.message} {...register("description")} />

      <div className="grid grid-cols-2 gap-4">
        {!resource && (
          <Select
            label="Type"
            options={[
              { value: "FILE", label: "File Upload" },
              { value: "LINK", label: "External Link" },
            ]}
            error={errors.type?.message}
            {...register("type")}
          />
        )}
        <Select
          label="Category"
          options={categoryOptions}
          placeholder="Select category"
          error={errors.categoryId?.message}
          {...register("categoryId")}
        />
      </div>

      <Select
        label="Visibility"
        options={[
          { value: "MEMBERS_ONLY", label: "Members Only" },
          { value: "PUBLIC", label: "Public" },
        ]}
        error={errors.visibility?.message}
        {...register("visibility")}
      />

      {resourceType === "FILE" ? (
        <FileUpload
          label={resource ? "Replace file (optional)" : "File"}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.webp"
          maxSizeMB={50}
          onFile={setFile}
        />
      ) : (
        <Input
          label="External URL"
          type="url"
          placeholder="https://example.com/resource"
          error={errors.externalUrl?.message}
          {...register("externalUrl")}
        />
      )}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isSubmitting} size="lg">{submitLabel}</Button>
      </div>
    </form>
  );
}
