"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KnowledgeHeaderProps {
  onCreateClick: () => void;
}

export function KnowledgeHeader({ onCreateClick }: KnowledgeHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Knowledge Base</h1>
        <p className="text-muted-foreground">Manage knowledge sources for your agents</p>
      </div>
      <Button onClick={onCreateClick}>
        <Plus className="size-4 mr-2" />
        Add Source
      </Button>
    </div>
  );
}