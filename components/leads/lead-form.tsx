"use client";

import * as React from "react";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Agent, LeadStatus, LeadSource, LeadFormData } from "@/types";

const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be at most 100 characters"),
  phone: z.string().min(7, "Phone must be at least 7 characters").max(20, "Phone must be at most 20 characters"),
  email: z.string().email("Must be a valid email"),
  status: z.enum(["new", "contacted", "qualified", "proposal_sent", "won", "lost"]),
  leadSource: z.enum(["website", "phone", "whatsapp", "referral", "google_ads", "facebook_ads", "manual"]),
  agentId: z.string().min(1, "Please select an agent"),
});

export type LeadFormSchemaData = z.infer<typeof leadSchema>;

const STATUSES: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal_sent", label: "Proposal Sent" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

const LEAD_SOURCES: { value: LeadSource; label: string }[] = [
  { value: "website", label: "Website" },
  { value: "phone", label: "Phone" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "referral", label: "Referral" },
  { value: "google_ads", label: "Google Ads" },
  { value: "facebook_ads", label: "Facebook Ads" },
  { value: "manual", label: "Manual" },
];

interface LeadFormProps {
  agents: Agent[];
  initialData?: Partial<LeadFormData>;
  onSubmit: (data: LeadFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function LeadForm({
  agents,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Save",
}: LeadFormProps) {
  const form = useForm<LeadFormSchemaData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      status: "new",
      leadSource: "website",
      agentId: "",
      ...initialData,
    },
  });

  const handleSubmit = async (data: LeadFormSchemaData) => {
    await onSubmit(data as LeadFormData);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="e.g., John Doe"
          {...form.register("name")}
          disabled={isLoading}
          aria-invalid={form.formState.errors.name ? "true" : "false"}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive" role="alert">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            {...form.register("email")}
            disabled={isLoading}
            aria-invalid={form.formState.errors.email ? "true" : "false"}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive" role="alert">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            {...form.register("phone")}
            disabled={isLoading}
            aria-invalid={form.formState.errors.phone ? "true" : "false"}
          />
          {form.formState.errors.phone && (
            <p className="text-sm text-destructive" role="alert">{form.formState.errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="leadSource">Lead source</Label>
        <Select
          value={useWatch({ control: form.control, name: "leadSource" })}
          onValueChange={(value: LeadSource) => form.setValue("leadSource", value)}
          disabled={isLoading}
        >
          <SelectTrigger id="leadSource" aria-invalid={form.formState.errors.leadSource ? "true" : "false"}>
            <SelectValue placeholder="Select source" />
          </SelectTrigger>
          <SelectContent>
            {LEAD_SOURCES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.leadSource && (
          <p className="text-sm text-destructive" role="alert">{form.formState.errors.leadSource.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="agentId">Assigned agent</Label>
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
          onValueChange={(value: LeadStatus) => form.setValue("status", value)}
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
        {form.formState.errors.status && (
          <p className="text-sm text-destructive" role="alert">{form.formState.errors.status.message}</p>
        )}
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