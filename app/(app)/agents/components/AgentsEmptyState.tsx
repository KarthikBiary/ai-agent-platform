"use client";

import { Bot, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AgentsEmptyStateProps {
  onCreateClick: () => void;
}

export function AgentsEmptyState({ onCreateClick }: AgentsEmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
          <Bot className="size-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">No agents found</h3>
        <p className="mb-6 text-muted-foreground max-w-sm">
          Get started by creating your first AI agent. Configure its personality,
          voice, and knowledge to handle conversations for your business.
        </p>
        <Button size="lg" onClick={onCreateClick}>
          <Plus className="size-4 mr-2" />
          Create Agent
        </Button>
      </CardContent>
    </Card>
  );
}