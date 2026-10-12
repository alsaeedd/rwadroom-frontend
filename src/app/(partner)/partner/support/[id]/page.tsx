"use client";

import { useParams } from "next/navigation";
import { TicketThread } from "@/components/support";

export default function PartnerSupportTicketPage() {
  const { id } = useParams<{ id: string }>();
  return <TicketThread id={id} backHref="/partner/support" />;
}
