"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";

import { deleteCall } from "@/lib/data/calls-client";
import { CallsHeader } from "./components/CallsHeader";
import { CallsFilters } from "./components/CallsFilters";
import { CallsTable } from "./components/CallsTable";
import { CallsEmptyState } from "./components/CallsEmptyState";
import { CallDetailSheet } from "./components/CallDetailSheet";
import { DeleteConfirmDialog } from "@/components/calls/delete-confirm-dialog";
import type { Call, Agent, Lead, CallStatus, CallDirection, CallOutcome } from "@/types";

export function CallsClient({
  initialCalls,
  initialAgents,
  initialLeads,
  initialSearch,
  initialStatuses,
  initialDirection,
  initialOutcome,
  initialAgentId,
  initialSortBy,
  initialSortOrder,
}: {
  initialCalls: Call[];
  initialAgents: Agent[];
  initialLeads: Lead[];
  initialSearch: string;
  initialStatuses: CallStatus[];
  initialDirection: CallDirection | "";
  initialOutcome: CallOutcome | "";
  initialAgentId: string;
  initialSortBy: "durationSec" | "status" | "direction" | "outcome" | "startedAt";
  initialSortOrder: "asc" | "desc";
}) {
  const router = useRouter();

  const [calls, setCalls] = React.useState<Call[]>(initialCalls);
  const [agents] = React.useState<Agent[]>(initialAgents);
  const [leads] = React.useState<Lead[]>(initialLeads);

  const [search] = React.useState(initialSearch);
  const [statuses] = React.useState<CallStatus[]>(initialStatuses);
  const [direction] = React.useState<CallDirection | "">(initialDirection);
  const [outcome] = React.useState<CallOutcome | "">(initialOutcome);
  const [agentId] = React.useState(initialAgentId);
  const [sortBy] = React.useState<"durationSec" | "status" | "direction" | "outcome" | "startedAt">(initialSortBy);
  const [sortOrder] = React.useState<"asc" | "desc">(initialSortOrder);

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deletingCall, setDeletingCall] = React.useState<Call | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = React.useState(false);
  const [viewedCall, setViewedCall] = React.useState<Call | null>(null);
  const [submitLoading, setSubmitLoading] = React.useState(false);

  const handleDeleteConfirm = async () => {
    if (!deletingCall) return;
    setSubmitLoading(true);
    try {
      await deleteCall(deletingCall.id);
      setCalls((prev) => prev.filter((c) => c.id !== deletingCall.id));
      router.refresh();
      import("sonner").then(({ toast }) => toast.success("Call deleted successfully"));
    } catch {
      import("sonner").then(({ toast }) => toast.error("Failed to delete call"));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleView = (call: Call) => {
    setViewedCall(call);
    setDetailSheetOpen(true);
  };

  const handleDelete = (call: Call) => {
    setDeletingCall(call);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <CallsHeader />

      <CallsFilters
        agents={agents}
        initialSearch={search}
        initialStatuses={statuses}
        initialDirection={direction}
        initialOutcome={outcome}
        initialAgentId={agentId}
        initialSortBy={sortBy}
        initialSortOrder={sortOrder}
      />

      {calls.length > 0 ? (
        <CallsTable
          calls={calls}
          agents={agents}
          leads={leads}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onView={handleView}
          onDelete={handleDelete}
        />
      ) : (
        <CallsEmptyState />
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={submitLoading}
      />

      <CallDetailSheet
        call={viewedCall}
        agents={agents}
        leads={leads}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
      />

      <Toaster position="top-right" />
    </div>
  );
}