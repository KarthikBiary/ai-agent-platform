"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";

import { listLeads, createLead, updateLead, deleteLead } from "@/lib/data/leads";
import { LeadsHeader } from "./components/LeadsHeader";
import { LeadsFilters } from "./components/LeadsFilters";
import { LeadsTable } from "./components/LeadsTable";
import { LeadsEmptyState } from "./components/LeadsEmptyState";
import { LeadDetailSheet } from "./components/LeadDetailSheet";
import { LeadDialog } from "@/components/leads/lead-dialog";
import { DeleteConfirmDialog } from "@/components/leads/delete-confirm-dialog";
import type { Lead, Agent, LeadStatus, LeadSource, LeadFormData } from "@/types";

export function LeadsClient({
  initialLeads,
  initialAgents,
  initialSearch,
  initialStatuses,
  initialLeadSource,
  initialAgentId,
  initialSortBy,
  initialSortOrder,
}: {
  initialLeads: Lead[];
  initialAgents: Agent[];
  initialSearch: string;
  initialStatuses: LeadStatus[];
  initialLeadSource: LeadSource | "";
  initialAgentId: string;
  initialSortBy: "name" | "status" | "score" | "leadSource" | "createdAt";
  initialSortOrder: "asc" | "desc";
}) {
  const router = useRouter();

  const [leads, setLeads] = React.useState<Lead[]>(initialLeads);
  const [agents] = React.useState<Agent[]>(initialAgents);
  const [isLoading, setIsLoading] = React.useState(false);

  const [search, setSearch] = React.useState(initialSearch);
  const [statuses, setStatuses] = React.useState<LeadStatus[]>(initialStatuses);
  const [leadSource, setLeadSource] = React.useState<LeadSource | "">(initialLeadSource);
  const [agentId, setAgentId] = React.useState(initialAgentId);
  const [sortBy, setSortBy] = React.useState<"name" | "status" | "score" | "leadSource" | "createdAt">(initialSortBy);
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">(initialSortOrder);

  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editingLead, setEditingLead] = React.useState<Lead | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deletingLead, setDeletingLead] = React.useState<Lead | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = React.useState(false);
  const [viewedLead, setViewedLead] = React.useState<Lead | null>(null);
  const [submitLoading, setSubmitLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchLeads() {
      setIsLoading(true);
      const data = await listLeads({ search, statuses, leadSource: leadSource || undefined, agentId, sortBy, sortOrder });
      setLeads(data);
      setIsLoading(false);
    }
    fetchLeads();
  }, [search, statuses, leadSource, agentId, sortBy, sortOrder]);

  const handleCreateSubmit = async (data: LeadFormData) => {
    setSubmitLoading(true);
    try {
      await createLead({ ...data, score: 0 } as Omit<Lead, "id" | "createdAt">);
      router.refresh();
      import("sonner").then(({ toast }) => toast.success("Lead created successfully"));
    } catch {
      import("sonner").then(({ toast }) => toast.error("Failed to create lead"));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditSubmit = async (data: LeadFormData) => {
    if (!editingLead) return;
    setSubmitLoading(true);
    try {
      await updateLead(editingLead.id, { ...data, score: editingLead.score });
      router.refresh();
      import("sonner").then(({ toast }) => toast.success("Lead updated successfully"));
    } catch {
      import("sonner").then(({ toast }) => toast.error("Failed to update lead"));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingLead) return;
    setSubmitLoading(true);
    try {
      await deleteLead(deletingLead.id);
      router.refresh();
      import("sonner").then(({ toast }) => toast.success("Lead deleted successfully"));
    } catch {
      import("sonner").then(({ toast }) => toast.error("Failed to delete lead"));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleView = (lead: Lead) => {
    setViewedLead(lead);
    setDetailSheetOpen(true);
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setEditDialogOpen(true);
  };

  const handleDelete = (lead: Lead) => {
    setDeletingLead(lead);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <LeadsHeader onCreateClick={() => setCreateDialogOpen(true)} />

      <LeadsFilters
        agents={agents}
        initialSearch={search}
        initialStatuses={statuses}
        initialLeadSource={leadSource}
        initialAgentId={agentId}
        initialSortBy={sortBy}
        initialSortOrder={sortOrder}
        onSearchChange={setSearch}
        onStatusesChange={setStatuses}
        onLeadSourceChange={setLeadSource}
        onAgentIdChange={setAgentId}
        onSortChange={(newSortBy, newSortOrder) => {
          setSortBy(newSortBy);
          setSortOrder(newSortOrder);
        }}
      />

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-lg" />
          ))}
        </div>
      ) : leads.length > 0 ? (
        <LeadsTable
          leads={leads}
          agents={agents}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <LeadsEmptyState onCreateClick={() => setCreateDialogOpen(true)} />
      )}

      <LeadDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        mode="create"
        agents={agents}
        onSubmit={handleCreateSubmit}
        isLoading={submitLoading}
      />

      <LeadDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        mode="edit"
        agents={agents}
        lead={editingLead}
        onSubmit={handleEditSubmit}
        isLoading={submitLoading}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        lead={deletingLead}
        onConfirm={handleDeleteConfirm}
        isLoading={submitLoading}
      />

      <LeadDetailSheet
        lead={viewedLead}
        agents={agents}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        onEdit={handleEdit}
      />

      <Toaster position="top-right" />
    </div>
  );
}