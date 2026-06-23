"use client";

import * as React from "react";
import { Bot, Mic, FileText, BadgeCheck, Calendar } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Agent, AgentStatus } from "@/types";

interface AgentDetailSheetProps {
  agent: Agent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (agent: Agent) => void;
}

const statusVariants: Record<AgentStatus, "default" | "secondary" | "outline" | "destructive"> = {
  active: "default",
  draft: "secondary",
  paused: "outline",
};

export function AgentDetailSheet({ agent, open, onOpenChange, onEdit }: AgentDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle>{agent?.name ?? "Agent Details"}</SheetTitle>
              <SheetDescription>View and manage agent configuration</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {agent && (
          <div className="space-y-6 px-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Bot className="size-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">{agent.industry.replace("_", " ")}</p>
                <p className="text-sm text-muted-foreground">
                  {agent.voice} voice
                </p>
              </div>
              <Badge variant={statusVariants[agent.status]} className="ml-auto">
                {agent.status}
              </Badge>
            </div>

            <div className="space-y-4 border-t pt-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Prompt</label>
                <p className="mt-1 text-sm whitespace-pre-wrap">{agent.prompt}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Voice</label>
                  <p className="mt-1 flex items-center gap-2 text-sm">
                    <Mic className="size-4 text-muted-foreground" />
                    {agent.voice}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p className="mt-1 flex items-center gap-2 text-sm">
                    <BadgeCheck className="size-4 text-muted-foreground" />
                    <Badge variant={statusVariants[agent.status]}>{agent.status}</Badge>
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="mt-1 flex items-center gap-2 text-sm">
                  <Calendar className="size-4 text-muted-foreground" />
                  {new Date(agent.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" className="flex-1" onClick={() => onEdit(agent)}>
                <FileText className="size-4 mr-2" />
                Edit Agent
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}