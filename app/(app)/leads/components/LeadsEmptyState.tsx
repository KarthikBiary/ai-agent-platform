"use client";

import * as React from "react";
import { Users, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

interface LeadsEmptyStateProps {
  onCreateClick: () => void;
}

export function LeadsEmptyState({ onCreateClick }: LeadsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <Users className="size-8 text-muted-foreground" />
      </div>
      <h3 className="mt-6 text-xl font-semibold">No leads yet</h3>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Create your first lead to start tracking prospects across all channels.
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={onCreateClick}>
          <Plus className="size-4 mr-2" />
          Create lead
        </Button>
      </div>
    </div>
  );
}

export function LeadsFilteredEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <Search className="size-8 text-muted-foreground" />
      </div>
      <h3 className="mt-6 text-xl font-semibold">No matching leads</h3>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Try adjusting your search or filters to find what you are looking for.
      </p>
    </div>
  );
}