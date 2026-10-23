import { MessageSquare, Paperclip, Video } from "lucide-react";
import type { CallSummary } from "@/lib/types";

/** One line under a session card: how long the call ran and what was shared. Details live on the session page. */
export function CallDetails({ call }: { call?: CallSummary | null }) {
  if (!call) return null;
  return (
    <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
      <span className="flex items-center gap-1">
        <Video className="h-3.5 w-3.5 text-primary" />
        {call.durationMin != null ? `${call.durationMin} min call` : "Call still open"}
      </span>
      {call.messageCount > 0 && (
        <span className="flex items-center gap-1">
          <MessageSquare className="h-3.5 w-3.5" />
          {call.messageCount} {call.messageCount === 1 ? "message" : "messages"}
        </span>
      )}
      {call.fileCount > 0 && (
        <span className="flex items-center gap-1">
          <Paperclip className="h-3.5 w-3.5" />
          {call.fileCount} {call.fileCount === 1 ? "file" : "files"}
        </span>
      )}
    </p>
  );
}
