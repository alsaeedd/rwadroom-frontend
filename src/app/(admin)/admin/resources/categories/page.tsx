"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { api, ApiError } from "@/lib/api";
import type { ResourceCategory } from "@/lib/types";
import { ArrowLeft, FolderOpen, Trash2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").max(100).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  description: z.string().max(500).optional(),
  sortOrder: z.number().int().optional(),
});

type CategoryForm = z.infer<typeof schema>;

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CategoryForm>({
    resolver: zodResolver(schema),
    defaultValues: { sortOrder: 0 as number },
  });

  const fetchCategories = () => {
    api<ResourceCategory[]>("/admin/resources/categories")
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleDelete = async (cat: ResourceCategory) => {
    setError("");
    setSuccess("");
    try {
      await api(`/admin/resources/categories/${cat.id}`, { method: "DELETE" });
      setSuccess(`Deleted "${cat.name}".`);
      fetchCategories();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete category.");
    }
  };

  const onSubmit = async (data: CategoryForm) => {
    setError("");
    setSuccess("");
    try {
      await api("/admin/resources/categories", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setSuccess("Category created.");
      reset();
      fetchCategories();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create category.");
    }
  };

  return (
    <div>
      <button
        onClick={() => router.push("/admin/resources")}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Resources
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Resource Categories</h1>
        <p className="text-muted mt-1">Organize resources into categories.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Create form */}
        <Card>
          <h2 className="font-semibold mb-4">New Category</h2>

          {success && <Alert variant="success" className="mb-4">{success}</Alert>}
          {error && <Alert variant="error" className="mb-4">{error}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input label="Name" placeholder="e.g. Business Plans" error={errors.name?.message} {...register("name")} />
            <Input label="Slug" placeholder="e.g. business-plans" error={errors.slug?.message} {...register("slug")} />
            <Textarea label="Description" placeholder="Optional description" error={errors.description?.message} {...register("description")} />
            <Input label="Sort Order" type="number" error={errors.sortOrder?.message} {...register("sortOrder", { valueAsNumber: true })} />
            <Button type="submit" isLoading={isSubmitting}>Create Category</Button>
          </form>
        </Card>

        {/* Existing categories */}
        <Card>
          <h2 className="font-semibold mb-4">Existing Categories</h2>
          {loading ? (
            <div className="py-8 flex justify-center"><Spinner /></div>
          ) : categories.length === 0 ? (
            <div className="py-8 text-center text-muted text-sm">
              <FolderOpen className="h-8 w-8 mx-auto mb-2 opacity-40" />
              No categories yet.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{cat.name}</p>
                    <p className="text-xs text-muted truncate">{cat.slug}{cat.description ? ` — ${cat.description}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted">#{cat.sortOrder}</span>
                    <button
                      onClick={() => handleDelete(cat)}
                      className="text-muted hover:text-danger transition-colors cursor-pointer"
                      title="Delete category (only if empty)"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
