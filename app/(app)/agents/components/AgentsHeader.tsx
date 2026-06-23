"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AgentsHeaderProps {
  onCreateClick: () => void;
}

export function AgentsHeader({ onCreateClick }: AgentsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Agents</h1>
        <p className="text-muted-foreground">Create and manage your AI agents</p>
      </div>
      <Button onClick={onCreateClick}>
        <Plus className="size-4 mr-2" />
        Create Agent
      </Button>
    </div>
  );
}