"use client";

import { useParams } from "next/navigation";
import { TicketThread } from "@/components/support";

export default function AdminTicketPage() {
  const { id } = useParams<{ id: string }>();
  return <TicketThread id={id} backHref="/admin/tickets" admin />;
}
