"use client";

import * as React from "react";
import { Eye, Trash2, ChevronUp, ChevronDown, ArrowUpRight, ArrowDownLeft } from "lucide-react";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Call, CallStatus, Agent, Lead } from "@/types";

const statusVariants: Record<CallStatus, "default" | "secondary" | "outline" | "destructive"> = {
  queued: "outline",
  ringing: "secondary",
  completed: "default",
  missed: "destructive",
  failed: "destructive",
};

const outcomeVariants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  interested: "default",
  follow_up: "secondary",
  not_interested: "destructive",
  booked_meeting: "default",
  voicemail: "outline",
  unknown: "outline",
};

function formatDuration(sec: number): string {
  if (sec <= 0) return "--";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function SortableHeader({
  children,
  sortKey,
  currentSortBy,
  currentSortOrder,
  onClick,
}: {
  children: React.ReactNode;
  sortKey: "durationSec" | "status" | "direction" | "outcome" | "startedAt";
  currentSortBy: "durationSec" | "status" | "direction" | "outcome" | "startedAt";
  currentSortOrder: "asc" | "desc";
  onClick: () => void;
}) {
  const isActive = currentSortBy === sortKey;
  return (
    <TableHead className="cursor-pointer select-none hover:bg-muted/50" onClick={onClick}>
      <div className="flex items-center gap-1">
        {children}
        {isActive ? (
          currentSortOrder === "asc" ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />
        ) : (
          <span className="size-4 text-muted-foreground">{'\u21C5'}</span>
        )}
      </div>
    </TableHead>
  );
}

interface CallsTableProps {
  calls: Call[];
  agents: Agent[];
  leads: Lead[];
  sortBy: "durationSec" | "status" | "direction" | "outcome" | "startedAt";
  sortOrder: "asc" | "desc";
  onView: (call: Call) => void;
  onDelete: (call: Call) => void;
}

export function CallsTable({
  calls,
  agents,
  leads,
  sortBy,
  sortOrder,
  onView,
  onDelete,
}: CallsTableProps) {
  function getAgentName(agentId: string): string {
    return agents.find((a) => a.id === agentId)?.name ?? agentId;
  }

  function getLeadName(leadId: string): string {
    return leads.find((l) => l.id === leadId)?.name ?? leadId;
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Agent</TableHead>
            <TableHead>Lead</TableHead>
            <SortableHeader sortKey="direction" currentSortBy={sortBy} currentSortOrder={sortOrder} onClick={() => {}}>
              Direction
            </SortableHeader>
            <SortableHeader sortKey="status" currentSortBy={sortBy} currentSortOrder={sortOrder} onClick={() => {}}>
              Status
            </SortableHeader>
            <SortableHeader sortKey="outcome" currentSortBy={sortBy} currentSortOrder={sortOrder} onClick={() => {}}>
              Outcome
            </SortableHeader>
            <SortableHeader sortKey="durationSec" currentSortBy={sortBy} currentSortOrder={sortOrder} onClick={() => {}}>
              Duration
            </SortableHeader>
            <SortableHeader sortKey="startedAt" currentSortBy={sortBy} currentSortOrder={sortOrder} onClick={() => {}}>
              Started
            </SortableHeader>
            <TableHead className="w-32 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calls.map((call) => (
            <TableRow key={call.id}>
              <TableCell className="font-medium">{getAgentName(call.agentId)}</TableCell>
              <TableCell>{getLeadName(call.leadId)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  {call.direction === "inbound" ? (
                    <ArrowDownLeft className="size-4 text-muted-foreground" />
                  ) : (
                    <ArrowUpRight className="size-4 text-muted-foreground" />
                  )}
                  <span className="text-sm capitalize">{call.direction}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariants[call.status]}>{call.status}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={outcomeVariants[call.outcome]}>{call.outcome.replace("_", " ")}</Badge>
              </TableCell>
              <TableCell className="font-mono text-sm">{formatDuration(call.durationSec)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(call.startedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onView(call)} aria-label="View call">
                    <Eye className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(call)}
                    aria-label="Delete call"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}