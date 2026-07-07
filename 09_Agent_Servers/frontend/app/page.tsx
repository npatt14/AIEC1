"use client";

import { useStream } from "@langchain/react";

import { AgentSidebar } from "@/components/agent-sidebar";
import { Chat } from "@/components/chat";
import { Badge } from "@/components/ui/badge";

const ASSISTANT_ID = "simple_agent";
const MODEL = process.env.NEXT_PUBLIC_MODEL ?? "gpt-5.4-mini";

function resolveApiUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== "undefined") return `${window.location.origin}/api`;
  return "/api";
}

export default function Page() {
  const stream = useStream({ apiUrl: resolveApiUrl(), assistantId: ASSISTANT_ID });

  return (
    <div className="flex h-dvh w-full">
      <AgentSidebar
        assistantId={ASSISTANT_ID}
        model={MODEL}
        isLoading={stream.isLoading}
        isError={stream.error != null}
      />

      <main className="flex min-h-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-background px-6 py-3">
          <div className="leading-tight">
            <p className="text-sm font-medium">Chat</p>
            <p className="text-xs text-muted-foreground">
              Threadless run &middot; streamed via API passthrough
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[10px]">
              {MODEL}
            </Badge>
          </div>
        </header>

        <Chat stream={stream} />
      </main>
    </div>
  );
}
