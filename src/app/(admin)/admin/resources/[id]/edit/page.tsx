"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { api, ApiError } from "@/lib/api";
import type { Resource, ResourceCategory } from "@/lib/types";
import { ArrowLeft } from "lucide-react";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional(),
  categoryId: z.string().min(1, "Category is required"),
  visibility: z.enum(["PUBLIC", "MEMBERS_ONLY"]),
  externalUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type EditForm = z.infer<typeof schema>;

export default function EditResourcePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [resource, setResource] = useState<Resource | null>(null);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EditForm>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    Promise.all([
      api<Resource>(`/admin/resources/${id}`).catch(() => null),
      api<ResourceCategory[]>("/resources/categories").catch(() => []),
    ]).then(([r, cats]) => {
      setResource(r);
      setCategories(cats as ResourceCategory[]);
      if (r) {
        reset({
          title: r.title,
          description: r.description || "",
          categoryId: r.categoryId,
          visibility: r.visibility,
          externalUrl: r.externalUrl || "",
        });
      }
      setLoading(false);
    });
  }, [id, reset]);

  const onSubmit = async (data: EditForm) => {
    setError("");
    try {
      await api(`/admin/resources/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...data,
          externalUrl: data.externalUrl || undefined,
        }),
      });
      router.push("/admin/resources");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update resource.");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Spinner className="h-8 w-8" /></div>;
  }

  if (!resource) {
    return (
      <div className="py-10 text-center">
        <p className="text-muted">Resource not found.</p>
        <Button variant="ghost" className="mt-4" onClick={() => router.push("/admin/resources")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => router.push("/admin/resources")}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Resources
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Edit Resource</h1>
      </div>

      {error && <Alert variant="error" className="mb-5">{error}</Alert>}

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <Input label="Title" error={errors.title?.message} {...register("title")} />
          <Textarea label="Description" error={errors.description?.message} {...register("description")} />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              error={errors.categoryId?.message}
              {...register("categoryId")}
            />
            <Select
              label="Visibility"
              options={[
                { value: "MEMBERS_ONLY", label: "Members Only" },
                { value: "PUBLIC", label: "Public" },
              ]}
              error={errors.visibility?.message}
              {...register("visibility")}
            />
          </div>

          {resource.type === "LINK" && (
            <Input label="External URL" type="url" error={errors.externalUrl?.message} {...register("externalUrl")} />
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => router.push("/admin/resources")}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting} size="lg">Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
