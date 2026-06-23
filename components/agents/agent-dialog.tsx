"use client";

import * as React from "react";
import { Plus, Edit2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AgentForm, type AgentFormData } from "./agent-form";
import type { Agent } from "@/types";

interface AgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  agent?: Agent | null;
  onSubmit: (data: AgentFormData) => Promise<void>;
  isLoading?: boolean;
}

export function AgentDialog({
  open,
  onOpenChange,
  mode,
  agent,
  onSubmit,
  isLoading = false,
}: AgentDialogProps) {
  const handleSubmit = async (data: AgentFormData) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {mode === "create" ? (
              <Plus className="size-5 text-primary" />
            ) : (
              <Edit2 className="size-5 text-primary" />
            )}
            <DialogTitle>
              {mode === "create" ? "Create Agent" : "Edit Agent"}
            </DialogTitle>
          </div>
          <DialogDescription>
            {mode === "create"
              ? "Configure a new AI agent for your business."
              : `Update settings for ${agent?.name ?? "this agent"}.`}
          </DialogDescription>
        </DialogHeader>

        <AgentForm
          initialData={agent ?? undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          submitLabel={mode === "create" ? "Create Agent" : "Save Changes"}
        />
      </DialogContent>
    </Dialog>
  );
}