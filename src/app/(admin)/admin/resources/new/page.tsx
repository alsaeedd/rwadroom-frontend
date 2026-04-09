"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { api, apiUpload, ApiError } from "@/lib/api";
import type { ResourceCategory } from "@/lib/types";
import { ArrowLeft } from "lucide-react";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional(),
  type: z.enum(["FILE", "LINK"]),
  categoryId: z.string().min(1, "Category is required"),
  visibility: z.enum(["PUBLIC", "MEMBERS_ONLY"]),
  externalUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ResourceForm = z.infer<typeof schema>;

export default function NewResourcePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ResourceForm>({
    resolver: zodResolver(schema),
    defaultValues: { type: "FILE", visibility: "MEMBERS_ONLY" },
  });

  const resourceType = watch("type");

  useEffect(() => {
    api<ResourceCategory[]>("/resources/categories")
      .then(setCategories)
      .catch(() => {});
  }, []);

  const onSubmit = async (data: ResourceForm) => {
    setError("");
    try {
      if (data.type === "FILE") {
        if (!file) {
          setError("Please select a file to upload.");
          return;
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", data.title);
        if (data.description) formData.append("description", data.description);
        formData.append("type", data.type);
        formData.append("categoryId", data.categoryId);
        formData.append("visibility", data.visibility);
        await apiUpload("/admin/resources", formData);
      } else {
        await api("/admin/resources", {
          method: "POST",
          body: JSON.stringify({
            ...data,
            externalUrl: data.externalUrl || undefined,
          }),
        });
      }
      router.push("/admin/resources");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create resource.");
    }
  };

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  return (
    <div>
      <button
        onClick={() => router.push("/admin/resources")}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Resources
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">New Resource</h1>
        <p className="text-muted mt-1">Upload a file or add an external link.</p>
      </div>

      {error && <Alert variant="error" className="mb-5">{error}</Alert>}

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <Input label="Title" placeholder="Resource title" error={errors.title?.message} {...register("title")} />

          <Textarea label="Description" placeholder="Brief description (optional)" error={errors.description?.message} {...register("description")} />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Type"
              options={[
                { value: "FILE", label: "File Upload" },
                { value: "LINK", label: "External Link" },
              ]}
              error={errors.type?.message}
              {...register("type")}
            />
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
              label="File"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,.zip"
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
            <Button type="button" variant="ghost" onClick={() => router.push("/admin/resources")}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting} size="lg">Create Resource</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
