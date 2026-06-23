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
import { KnowledgeForm, type KnowledgeFormData } from "./knowledge-form";
import type { KnowledgeSource, Agent } from "@/types";

interface KnowledgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  agents: Agent[];
  source?: KnowledgeSource | null;
  onSubmit: (data: KnowledgeFormData) => Promise<void>;
  isLoading?: boolean;
}

export function KnowledgeDialog({
  open,
  onOpenChange,
  mode,
  agents,
  source,
  onSubmit,
  isLoading = false,
}: KnowledgeDialogProps) {
  const handleSubmit = async (data: KnowledgeFormData) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const initialData = source
    ? {
        name: source.name,
        sourceType: source.sourceType,
        agentId: source.agentId,
        status: source.status,
      }
    : undefined;

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
              {mode === "create" ? "Add knowledge source" : "Edit knowledge source"}
            </DialogTitle>
          </div>
          <DialogDescription>
            {mode === "create"
              ? "Upload a document or add a URL for your AI agents to reference."
              : `Update settings for ${source?.name ?? "this source"}.`}
          </DialogDescription>
        </DialogHeader>

        <KnowledgeForm
          agents={agents}
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          submitLabel={mode === "create" ? "Create source" : "Save changes"}
        />
      </DialogContent>
    </Dialog>
  );
}