"use client";

import * as React from "react";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Industry, Voice, AgentStatus } from "@/types";

const agentSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100, "Name must be at most 100 characters"),
  industry: z.enum(["healthcare", "real_estate", "restaurant", "spa", "convention_hall", "hospitality"]),
  prompt: z.string().min(20, "Prompt must be at least 20 characters").max(5000, "Prompt must be at most 5000 characters"),
  voice: z.enum(["alloy", "nova", "shimmer", "echo", "onyx"]),
  status: z.enum(["active", "draft", "paused"]),
});

export type AgentFormData = z.infer<typeof agentSchema>;

const INDUSTRIES: { value: Industry; label: string }[] = [
  { value: "healthcare", label: "Healthcare" },
  { value: "real_estate", label: "Real Estate" },
  { value: "restaurant", label: "Restaurant" },
  { value: "spa", label: "Spa" },
  { value: "convention_hall", label: "Convention Hall" },
  { value: "hospitality", label: "Hospitality" },
];

const VOICES: { value: Voice; label: string }[] = [
  { value: "alloy", label: "Alloy" },
  { value: "nova", label: "Nova" },
  { value: "shimmer", label: "Shimmer" },
  { value: "echo", label: "Echo" },
  { value: "onyx", label: "Onyx" },
];

const STATUSES: { value: AgentStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "paused", label: "Paused" },
];

interface AgentFormProps {
  initialData?: Partial<AgentFormData>;
  onSubmit: (data: AgentFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function AgentForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Save",
}: AgentFormProps) {
  const form = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      name: "",
      industry: "healthcare",
      prompt: "",
      voice: "nova",
      status: "draft",
      ...initialData,
    },
  });

  const handleSubmit = async (data: AgentFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="e.g., Front Desk Concierge"
          {...form.register("name")}
          disabled={isLoading}
          aria-invalid={form.formState.errors.name ? "true" : "false"}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive" role="alert">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Select
          value={useWatch({ control: form.control, name: "industry" })}
          onValueChange={(value: Industry) => form.setValue("industry", value)}
          disabled={isLoading}
        >
          <SelectTrigger id="industry" aria-invalid={form.formState.errors.industry ? "true" : "false"}>
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            {INDUSTRIES.map((industry) => (
              <SelectItem key={industry.value} value={industry.value}>
                {industry.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.industry && (
          <p className="text-sm text-destructive" role="alert">{form.formState.errors.industry.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="prompt">Prompt</Label>
        <Textarea
          id="prompt"
          placeholder="Describe the agent's behavior, personality, and instructions..."
          rows={6}
          {...form.register("prompt")}
          disabled={isLoading}
          aria-invalid={form.formState.errors.prompt ? "true" : "false"}
        />
        {form.formState.errors.prompt && (
          <p className="text-sm text-destructive" role="alert">{form.formState.errors.prompt.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {useWatch({ control: form.control, name: "prompt" })?.length ?? 0} / 5000 characters
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="voice">Voice</Label>
          <Select
            value={useWatch({ control: form.control, name: "voice" })}
            onValueChange={(value: Voice) => form.setValue("voice", value)}
            disabled={isLoading}
          >
            <SelectTrigger id="voice" aria-invalid={form.formState.errors.voice ? "true" : "false"}>
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent>
              {VOICES.map((voice) => (
                <SelectItem key={voice.value} value={voice.value}>
                  {voice.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={useWatch({ control: form.control, name: "status" })}
            onValueChange={(value: AgentStatus) => form.setValue("status", value)}
            disabled={isLoading}
          >
            <SelectTrigger id="status" aria-invalid={form.formState.errors.status ? "true" : "false"}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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