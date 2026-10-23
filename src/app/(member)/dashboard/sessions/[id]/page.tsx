"use client";

import { useParams } from "next/navigation";
import { SessionDetail } from "@/components/session-detail";

export default function MemberSessionPage() {
  const { id } = useParams<{ id: string }>();
  return <SessionDetail id={id} backHref="/dashboard/sessions" backLabel="Back to My Sessions" />;
}
