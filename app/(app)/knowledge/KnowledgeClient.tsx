"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";

import { listKnowledgeSources, createKnowledgeSource, updateKnowledgeSource, deleteKnowledgeSource } from "@/lib/data/knowledge";
import { KnowledgeHeader } from "./components/KnowledgeHeader";
import { KnowledgeFilters } from "./components/KnowledgeFilters";
import { KnowledgeTable } from "./components/KnowledgeTable";
import { KnowledgeEmptyState } from "./components/KnowledgeEmptyState";
import { KnowledgeDetailSheet } from "./components/KnowledgeDetailSheet";
import { KnowledgeDialog } from "@/components/knowledge/knowledge-dialog";
import { DeleteConfirmDialog } from "@/components/knowledge/delete-confirm-dialog";
import type { KnowledgeSource, Agent, KnowledgeSourceType, KnowledgeSourceFormData } from "@/types";

export function KnowledgeClient({
  initialSources,
  initialAgents,
  initialSearch,
  initialAgentId,
  initialSourceType,
  initialSortBy,
  initialSortOrder,
}: {
  initialSources: KnowledgeSource[];
  initialAgents: Agent[];
  initialSearch: string;
  initialAgentId: string;
  initialSourceType: KnowledgeSourceType | "";
  initialSortBy: "name" | "sourceType" | "createdAt";
  initialSortOrder: "asc" | "desc";
}) {
  const router = useRouter();
  const [sources, setSources] = React.useState<KnowledgeSource[]>(initialSources);
  const [agents] = React.useState<Agent[]>(initialAgents);
  const [isLoading, setIsLoading] = React.useState(false);

  const [search, setSearch] = React.useState(initialSearch);
  const [agentId, setAgentId] = React.useState(initialAgentId);
  const [sourceType, setSourceType] = React.useState<KnowledgeSourceType | "">(initialSourceType);
  const [sortBy, setSortBy] = React.useState<"name" | "sourceType" | "createdAt">(initialSortBy);
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">(initialSortOrder);

  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editingSource, setEditingSource] = React.useState<KnowledgeSource | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deletingSource, setDeletingSource] = React.useState<KnowledgeSource | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = React.useState(false);
  const [viewedSource, setViewedSource] = React.useState<KnowledgeSource | null>(null);
  const [submitLoading, setSubmitLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchSources() {
      setIsLoading(true);
      const data = await listKnowledgeSources({ search, agentId, sourceType: sourceType || undefined, sortBy, sortOrder });
      setSources(data);
      setIsLoading(false);
    }
    fetchSources();
  }, [search, agentId, sourceType, sortBy, sortOrder]);

  const handleCreateSubmit = async (data: KnowledgeSourceFormData) => {
    setSubmitLoading(true);
    try {
      await createKnowledgeSource(data as Omit<KnowledgeSource, "id" | "createdAt">);
      router.refresh();
      import("sonner").then(({ toast }) => toast.success("Knowledge source created successfully"));
    } catch {
      import("sonner").then(({ toast }) => toast.error("Failed to create knowledge source"));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditSubmit = async (data: KnowledgeSourceFormData) => {
    if (!editingSource) return;
    setSubmitLoading(true);
    try {
      await updateKnowledgeSource(editingSource.id, data);
      router.refresh();
      import("sonner").then(({ toast }) => toast.success("Knowledge source updated successfully"));
    } catch {
      import("sonner").then(({ toast }) => toast.error("Failed to update knowledge source"));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSource) return;
    setSubmitLoading(true);
    try {
      await deleteKnowledgeSource(deletingSource.id);
      router.refresh();
      import("sonner").then(({ toast }) => toast.success("Knowledge source deleted successfully"));
    } catch {
      import("sonner").then(({ toast }) => toast.error("Failed to delete knowledge source"));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleView = (source: KnowledgeSource) => {
    setViewedSource(source);
    setDetailSheetOpen(true);
  };

  const handleEdit = (source: KnowledgeSource) => {
    setEditingSource(source);
    setEditDialogOpen(true);
  };

  const handleDelete = (source: KnowledgeSource) => {
    setDeletingSource(source);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <KnowledgeHeader onCreateClick={() => setCreateDialogOpen(true)} />

      <KnowledgeFilters
        agents={agents}
        initialSearch={search}
        initialAgentId={agentId}
        initialSourceType={sourceType}
        initialSortBy={sortBy}
        initialSortOrder={sortOrder}
        onSearchChange={setSearch}
        onAgentIdChange={setAgentId}
        onSourceTypeChange={setSourceType}
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
      ) : sources.length > 0 ? (
        <KnowledgeTable
          sources={sources}
          agents={agents}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <KnowledgeEmptyState onCreateClick={() => setCreateDialogOpen(true)} />
      )}

      <KnowledgeDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        mode="create"
        agents={agents}
        onSubmit={handleCreateSubmit}
        isLoading={submitLoading}
      />

      <KnowledgeDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        mode="edit"
        agents={agents}
        source={editingSource}
        onSubmit={handleEditSubmit}
        isLoading={submitLoading}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        source={deletingSource}
        onConfirm={handleDeleteConfirm}
        isLoading={submitLoading}
      />

      <KnowledgeDetailSheet
        source={viewedSource}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        onEdit={handleEdit}
      />

      <Toaster position="top-right" />
    </div>
  );
}