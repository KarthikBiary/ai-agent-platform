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
import { LeadForm, type LeadFormSchemaData } from "./lead-form";
import type { Lead, Agent, LeadFormData } from "@/types";

interface LeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  agents: Agent[];
  lead?: Lead | null;
  onSubmit: (data: LeadFormData) => Promise<void>;
  isLoading?: boolean;
}

export function LeadDialog({
  open,
  onOpenChange,
  mode,
  agents,
  lead,
  onSubmit,
  isLoading = false,
}: LeadDialogProps) {
  const handleSubmit = async (data: LeadFormSchemaData) => {
    await onSubmit(data as LeadFormData);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const initialData = lead
    ? {
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        status: lead.status,
        leadSource: lead.leadSource,
        agentId: lead.agentId,
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
              {mode === "create" ? "Create lead" : "Edit lead"}
            </DialogTitle>
          </div>
          <DialogDescription>
            {mode === "create"
              ? "Add a new lead to track and manage."
              : `Update details for ${lead?.name ?? "this lead"}.`}
          </DialogDescription>
        </DialogHeader>

        <LeadForm
          agents={agents}
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          submitLabel={mode === "create" ? "Create lead" : "Save changes"}
        />
      </DialogContent>
    </Dialog>
  );
}