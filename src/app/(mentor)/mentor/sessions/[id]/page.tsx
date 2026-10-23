"use client";

import { useParams } from "next/navigation";
import { SessionDetail } from "@/components/session-detail";

export default function MentorSessionPage() {
  const { id } = useParams<{ id: string }>();
  return <SessionDetail id={id} backHref="/mentor/sessions" backLabel="Back to Sessions" />;
}
