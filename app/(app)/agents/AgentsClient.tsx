"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";

import { listAgents, createAgent, updateAgent, deleteAgent } from "@/lib/data/agents";
import { AgentsHeader } from "./components/AgentsHeader";
import { AgentsFilters } from "./components/AgentsFilters";
import { AgentsTable } from "./components/AgentsTable";
import { AgentsEmptyState } from "./components/AgentsEmptyState";
import { AgentDetailSheet } from "./components/AgentDetailSheet";
import { AgentDialog } from "@/components/agents/agent-dialog";
import { DeleteConfirmDialog } from "@/components/agents/delete-confirm-dialog";
import type { Agent, Industry, AgentStatus, AgentFormData } from "@/types";

export function AgentsClient({
  initialAgents,
  initialSearch,
  initialIndustries,
  initialStatuses,
  initialSortBy,
  initialSortOrder,
}: {
  initialAgents: Agent[];
  initialSearch: string;
  initialIndustries: Industry[];
  initialStatuses: AgentStatus[];
  initialSortBy: "name" | "industry" | "createdAt";
  initialSortOrder: "asc" | "desc";
}) {
  const router = useRouter();

  const [agents, setAgents] = React.useState<Agent[]>(initialAgents);
  const [isLoading, setIsLoading] = React.useState(false);

  const [search] = React.useState(initialSearch);
  const [industries] = React.useState<Industry[]>(initialIndustries);
  const [statuses] = React.useState<AgentStatus[]>(initialStatuses);
  const [sortBy] = React.useState<"name" | "industry" | "createdAt">(initialSortBy);
  const [sortOrder] = React.useState<"asc" | "desc">(initialSortOrder);

  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editingAgent, setEditingAgent] = React.useState<Agent | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deletingAgent, setDeletingAgent] = React.useState<Agent | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = React.useState(false);
  const [viewedAgent, setViewedAgent] = React.useState<Agent | null>(null);
  const [submitLoading, setSubmitLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchAgents() {
      setIsLoading(true);
      const data = await listAgents({ search, industries, statuses, sortBy, sortOrder });
      setAgents(data);
      setIsLoading(false);
    }
    fetchAgents();
  }, [search, industries, statuses, sortBy, sortOrder]);

  const handleCreateSubmit = async (data: AgentFormData) => {
    setSubmitLoading(true);
    try {
      await createAgent(data);
      router.refresh();
      import("sonner").then(({ toast }) => toast.success("Agent created successfully"));
    } catch {
      import("sonner").then(({ toast }) => toast.error("Failed to create agent"));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditSubmit = async (data: AgentFormData) => {
    if (!editingAgent) return;
    setSubmitLoading(true);
    try {
      await updateAgent(editingAgent.id, data);
      router.refresh();
      import("sonner").then(({ toast }) => toast.success("Agent updated successfully"));
    } catch {
      import("sonner").then(({ toast }) => toast.error("Failed to update agent"));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAgent) return;
    setSubmitLoading(true);
    try {
      await deleteAgent(deletingAgent.id);
      router.refresh();
      import("sonner").then(({ toast }) => toast.success("Agent deleted successfully"));
    } catch {
      import("sonner").then(({ toast }) => toast.error("Failed to delete agent"));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleView = (agent: Agent) => {
    setViewedAgent(agent);
    setDetailSheetOpen(true);
  };

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setEditDialogOpen(true);
  };

  const handleDelete = (agent: Agent) => {
    setDeletingAgent(agent);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <AgentsHeader onCreateClick={() => setCreateDialogOpen(true)} />

      <AgentsFilters
        initialSearch={search}
        initialIndustries={industries}
        initialStatuses={statuses}
        initialSortBy={sortBy}
        initialSortOrder={sortOrder}
      />

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-lg" />
          ))}
        </div>
      ) : agents.length > 0 ? (
        <AgentsTable
          agents={agents}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <AgentsEmptyState onCreateClick={() => setCreateDialogOpen(true)} />
      )}

      <AgentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        mode="create"
        onSubmit={handleCreateSubmit}
        isLoading={submitLoading}
      />

      <AgentDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        mode="edit"
        agent={editingAgent}
        onSubmit={handleEditSubmit}
        isLoading={submitLoading}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        agent={deletingAgent}
        onConfirm={handleDeleteConfirm}
        isLoading={submitLoading}
      />

      <AgentDetailSheet
        agent={viewedAgent}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        onEdit={handleEdit}
      />

      <Toaster position="top-right" />
    </div>
  );
}