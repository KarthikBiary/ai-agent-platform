"use client";

import * as React from "react";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Agent, KnowledgeSourceType } from "@/types";

const knowledgeSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100, "Name must be at most 100 characters"),
  sourceType: z.enum(["pdf", "docx", "url"]),
  agentId: z.string().min(1, "Please select an agent"),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["processing", "ready"]),
});

export type KnowledgeFormData = z.infer<typeof knowledgeSchema>;

const SOURCE_TYPES: { value: KnowledgeSourceType; label: string }[] = [
  { value: "pdf", label: "PDF" },
  { value: "docx", label: "DOCX" },
  { value: "url", label: "Website URL" },
];

const STATUSES: { value: "processing" | "ready"; label: string }[] = [
  { value: "processing", label: "Processing" },
  { value: "ready", label: "Ready" },
];

interface KnowledgeFormProps {
  agents: Agent[];
  initialData?: Partial<KnowledgeFormData>;
  onSubmit: (data: KnowledgeFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function KnowledgeForm({
  agents,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Save",
}: KnowledgeFormProps) {
  const form = useForm<KnowledgeFormData>({
    resolver: zodResolver(knowledgeSchema),
    defaultValues: {
      name: "",
      sourceType: "pdf",
      agentId: "",
      url: "",
      status: "processing",
      ...initialData,
    },
  });

  const sourceType = useWatch({ control: form.control, name: "sourceType" });

  const handleSubmit = async (data: KnowledgeFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="e.g., Clinic Services Brochure"
          {...form.register("name")}
          disabled={isLoading}
          aria-invalid={form.formState.errors.name ? "true" : "false"}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive" role="alert">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sourceType">Source type</Label>
        <Select
          value={sourceType}
          onValueChange={(value: KnowledgeSourceType) => form.setValue("sourceType", value)}
          disabled={isLoading}
        >
          <SelectTrigger id="sourceType" aria-invalid={form.formState.errors.sourceType ? "true" : "false"}>
            <SelectValue placeholder="Select source type" />
          </SelectTrigger>
          <SelectContent>
            {SOURCE_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.sourceType && (
          <p className="text-sm text-destructive" role="alert">{form.formState.errors.sourceType.message}</p>
        )}
      </div>

      {sourceType === "url" && (
        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com/document"
            {...form.register("url")}
            disabled={isLoading}
            aria-invalid={form.formState.errors.url ? "true" : "false"}
          />
          {form.formState.errors.url && (
            <p className="text-sm text-destructive" role="alert">{form.formState.errors.url.message}</p>
          )}
        </div>
      )}

      {sourceType !== "url" && (
        <div className="space-y-2">
          <Label htmlFor="file">File</Label>
          <Input
            id="file"
            type="file"
            accept={sourceType === "pdf" ? ".pdf" : ".docx"}
            disabled={isLoading}
            className="cursor-pointer"
          />
          <p className="text-xs text-muted-foreground">
            Upload a {sourceType.toUpperCase()} file (UI demo only — file is not actually stored)
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="agentId">Linked agent</Label>
        <Select
          value={useWatch({ control: form.control, name: "agentId" })}
          onValueChange={(value: string) => form.setValue("agentId", value)}
          disabled={isLoading}
        >
          <SelectTrigger id="agentId" aria-invalid={form.formState.errors.agentId ? "true" : "false"}>
            <SelectValue placeholder="Select an agent" />
          </SelectTrigger>
          <SelectContent>
            {agents.length === 0 && (
              <SelectItem value="" disabled>
                No agents available
              </SelectItem>
            )}
            {agents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.agentId && (
          <p className="text-sm text-destructive" role="alert">{form.formState.errors.agentId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={useWatch({ control: form.control, name: "status" })}
          onValueChange={(value: "processing" | "ready") => form.setValue("status", value)}
          disabled={isLoading}
        >
          <SelectTrigger id="status" aria-invalid={form.formState.errors.status ? "true" : "false"}>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}