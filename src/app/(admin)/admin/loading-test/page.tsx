"use client";

import { FullPageSpinner, Spinner } from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function LoadingTestPage() {
  const [showFullPage, setShowFullPage] = useState(false);

  if (showFullPage) {
    return (
      <>
        <FullPageSpinner />
        <button
          onClick={() => setShowFullPage(false)}
          className="fixed top-4 right-4 z-[60] bg-foreground text-white px-4 py-2 rounded-xl text-sm font-medium cursor-pointer"
        >
          Close
        </button>
      </>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Loading Animation Preview</h1>
        <p className="text-muted mt-1">Test page for the Rwad Room loading animations.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="font-semibold mb-6">Full Page Loader</h3>
          <p className="text-sm text-muted mb-4">The SVG path-draw sequence. Leaf traces, fills, "r" materializes.</p>
          <Button onClick={() => setShowFullPage(true)}>Show Full Page Loader</Button>
        </Card>

        <Card>
          <h3 className="font-semibold mb-6">Inline Spinner</h3>
          <p className="text-sm text-muted mb-6">Used inside buttons, tables, and small loading states.</p>
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <Spinner />
              <span className="text-xs text-muted">Default</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner className="h-8 w-8" />
              <span className="text-xs text-muted">32px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner className="h-12 w-12" />
              <span className="text-xs text-muted">48px</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-6">Button Loading States</h3>
          <div className="flex flex-wrap gap-3">
            <Button isLoading>Saving...</Button>
            <Button variant="secondary" isLoading>Loading</Button>
            <Button variant="outline" isLoading>Please wait</Button>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-6">Inline in Context</h3>
          <div className="flex items-center gap-3 rounded-xl border border-border p-4">
            <Spinner />
            <span className="text-sm text-muted">Fetching your data...</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
