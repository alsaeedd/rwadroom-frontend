"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { ResourceForm } from "@/components/resource-form";
import { api } from "@/lib/api";
import type { ResourceCategory } from "@/lib/types";
import { ArrowLeft } from "lucide-react";

export default function NewResourcePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ResourceCategory[]>([]);

  useEffect(() => {
    api<ResourceCategory[]>("/admin/resources/categories")
      .then(setCategories)
      .catch(() => {});
  }, []);

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

      <Card className="max-w-2xl">
        <ResourceForm
          endpoint="/admin/resources"
          categories={categories}
          submitLabel="Create Resource"
          onDone={() => router.push("/admin/resources")}
          onCancel={() => router.push("/admin/resources")}
        />
      </Card>
    </div>
  );
}
