"use client";

import * as React from "react";
import { Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

interface LeadsHeaderProps {
  onCreateClick: () => void;
}

export function LeadsHeader({ onCreateClick }: LeadsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Users className="size-6 text-primary" />
          Leads
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage and track your leads across all channels.
        </p>
      </div>
      <Button onClick={onCreateClick}>
        <Plus className="size-4 mr-2" />
        Create lead
      </Button>
    </div>
  );
}