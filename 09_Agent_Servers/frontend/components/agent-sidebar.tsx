"use client";

import { Cat, FileText, MessageSquare, Search, Settings2, Wrench } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const TOOLS = [
  { name: "Web search", icon: Search },
  { name: "Arxiv", icon: FileText },
  { name: "Knowledge base", icon: Wrench },
];

const NAV = [
  { name: "Chat", icon: MessageSquare, active: true },
  { name: "Settings", icon: Settings2, active: false },
];

export function AgentSidebar({
  assistantId,
  model,
  isLoading,
  isError,
}: {
  assistantId: string;
  model: string;
  isLoading: boolean;
  isError: boolean;
}) {
  const status = isError ? "error" : isLoading ? "running" : "idle";

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex items-center gap-2 px-4 py-4">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Cat className="size-4" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-medium">Cat Health Agent</p>
          <p className="text-xs text-muted-foreground">LangGraph + Next.js</p>
        </div>
      </div>

      <Separator />

      <nav className="flex flex-col gap-0.5 px-2 py-3">
        {NAV.map((item) => (
          <div
            key={item.name}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
              item.active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="size-4" />
            {item.name}
          </div>
        ))}
      </nav>

      <Separator />

      <div className="flex flex-col gap-3 px-4 py-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Status</span>
          <StatusBadge status={status} />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Assistant</span>
          <span className="font-mono text-foreground">{assistantId}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Model</span>
          <span className="font-mono text-foreground">{model}</span>
        </div>
      </div>

      <Separator />

      <div className="flex flex-1 flex-col gap-2 px-4 py-4">
        <p className="text-xs font-medium text-muted-foreground">Tool belt</p>
        <div className="flex flex-col gap-1.5">
          {TOOLS.map((tool) => (
            <Tooltip key={tool.name}>
              <TooltipTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <tool.icon className="size-3.5" />
                {tool.name}
              </TooltipTrigger>
              <TooltipContent side="right">
                Available to the agent via {tool.name.toLowerCase()}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </aside>
  );
}

function StatusBadge({ status }: { status: "idle" | "running" | "error" }) {
  if (status === "error") {
    return (
      <Badge variant="destructive" className="text-[10px]">
        Error
      </Badge>
    );
  }
  if (status === "running") {
    return (
      <Badge className="bg-amber-500/15 text-amber-500 text-[10px] hover:bg-amber-500/15">
        <span className="mr-1 inline-block size-1.5 animate-pulse rounded-full bg-amber-500" />
        Running
      </Badge>
    );
  }
  return (
    <Badge className="bg-emerald-500/15 text-emerald-500 text-[10px] hover:bg-emerald-500/15">
      <span className="mr-1 inline-block size-1.5 rounded-full bg-emerald-500" />
      Online
    </Badge>
  );
}
