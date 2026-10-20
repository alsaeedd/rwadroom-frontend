"use client";

import { useState } from "react";
import { MessageSquare, Video } from "lucide-react";
import type { CallSummary } from "@/lib/types";

const hhmm = (iso: string | null) =>
  iso ? new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Bahrain" }) : "–";

/** What happened in the video room: who joined, for how long, and the chat. */
export function CallDetails({ call }: { call?: CallSummary | null }) {
  const [showChat, setShowChat] = useState(false);
  if (!call) return null;
  const chatLines = call.chat?.split("\n").filter(Boolean).length ?? 0;
  return (
    <div className="mt-3 border-t border-border pt-3 text-sm">
      <p className="flex items-center gap-1.5 font-medium">
        <Video className="h-3.5 w-3.5 text-primary" />
        Call {hhmm(call.startedAt)}–{hhmm(call.endedAt)}
        {call.durationMin != null ? ` · ${call.durationMin} min` : " · still open"}
      </p>
      <ul className="mt-1 space-y-0.5 text-muted">
        {call.participants.map((x, i) => (
          <li key={i}>
            {x.name}: joined {hhmm(x.joinedAt)}, left {hhmm(x.leftAt)}
            {x.minutes != null ? ` (${x.minutes} min)` : ""}
          </li>
        ))}
      </ul>
      {call.chat && (
        <>
          <button
            type="button"
            onClick={() => setShowChat((v) => !v)}
            className="mt-2 flex items-center gap-1.5 font-medium text-primary hover:underline"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            {showChat ? "Hide chat" : `Show chat (${chatLines} lines)`}
          </button>
          {showChat && <pre className="mt-2 whitespace-pre-wrap font-sans text-muted">{call.chat}</pre>}
        </>
      )}
    </div>
  );
}
