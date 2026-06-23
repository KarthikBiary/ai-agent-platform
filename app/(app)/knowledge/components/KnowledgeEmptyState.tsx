"use client";

import * as React from "react";
import { BookOpen, Plus, Search, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";

interface KnowledgeEmptyStateProps {
  onCreateClick: () => void;
}

export function KnowledgeEmptyState({ onCreateClick }: KnowledgeEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <BookOpen className="size-8 text-muted-foreground" />
      </div>
      <h3 className="mt-6 text-xl font-semibold">No knowledge sources yet</h3>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Add documents, URLs, or files to give your AI agents the information they need.
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={onCreateClick}>
          <Plus className="size-4 mr-2" />
          Add knowledge source
        </Button>
      </div>
    </div>
  );
}

export function KnowledgeFilteredEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <Search className="size-8 text-muted-foreground" />
      </div>
      <h3 className="mt-6 text-xl font-semibold">No matching sources</h3>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Try adjusting your search or filters to find what you are looking for.
      </p>
    </div>
  );
}

export function KnowledgeErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
        <Filter className="size-8 text-destructive" />
      </div>
      <h3 className="mt-6 text-xl font-semibold">Something went wrong</h3>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Failed to load knowledge sources. Please try again.
      </p>
      <Button variant="outline" className="mt-8" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}