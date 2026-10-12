"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { MySubmissions } from "@/components/my-resources";
import { useAuthStore } from "@/lib/auth";
import { BookOpen, Plus } from "lucide-react";

export default function PartnerResourcesPage() {
  const canShare = useAuthStore((s) => s.user?.status === "APPROVED");

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resources</h1>
          <p className="text-muted mt-1">
            Share guides, templates and tools with the Rwad Room community. Each one goes live after a quick review.
          </p>
        </div>
        {canShare && (
          <Link href="/partner/resources/new">
            <Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> Share a resource</Button>
          </Link>
        )}
      </div>

      <MySubmissions
        base="/partner/resources"
        empty={
          <EmptyState
            icon={<BookOpen className="h-8 w-8" />}
            title="Nothing shared yet"
            description="Your submissions and their review status will show up here."
          />
        }
      />
    </div>
  );
}
