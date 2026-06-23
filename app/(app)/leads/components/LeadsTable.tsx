"use client";

import * as React from "react";
import { Eye, Edit2, Trash2, ChevronUp, ChevronDown } from "lucide-react";

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
import type { Lead, LeadStatus, Agent } from "@/types";

const statusVariants: Record<LeadStatus, "default" | "secondary" | "outline" | "destructive"> = {
  new: "outline",
  contacted: "secondary",
  qualified: "default",
  proposal_sent: "secondary",
  won: "default",
  lost: "destructive",
};

function scoreBadgeVariant(score: number): "default" | "secondary" | "outline" | "destructive" {
  if (score >= 70) return "default";
  if (score >= 40) return "secondary";
  return "outline";
}

function SortableHeader({
  children,
  sortKey,
  currentSortBy,
  currentSortOrder,
  onClick,
}: {
  children: React.ReactNode;
  sortKey: "name" | "status" | "score" | "leadSource" | "createdAt";
  currentSortBy: "name" | "status" | "score" | "leadSource" | "createdAt";
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

interface LeadsTableProps {
  leads: Lead[];
  agents: Agent[];
  sortBy: "name" | "status" | "score" | "leadSource" | "createdAt";
  sortOrder: "asc" | "desc";
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export function LeadsTable({
  leads,
  agents,
  sortBy,
  sortOrder,
  onView,
  onEdit,
  onDelete,
}: LeadsTableProps) {
  function getAgentName(agentId: string): string {
    return agents.find((a) => a.id === agentId)?.name ?? agentId;
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader sortKey="name" currentSortBy={sortBy} currentSortOrder={sortOrder} onClick={() => {}}>
              Name
            </SortableHeader>
            <TableHead>Contact</TableHead>
            <SortableHeader sortKey="status" currentSortBy={sortBy} currentSortOrder={sortOrder} onClick={() => {}}>
              Status
            </SortableHeader>
            <SortableHeader sortKey="score" currentSortBy={sortBy} currentSortOrder={sortOrder} onClick={() => {}}>
              Score
            </SortableHeader>
            <SortableHeader sortKey="leadSource" currentSortBy={sortBy} currentSortOrder={sortOrder} onClick={() => {}}>
              Source
            </SortableHeader>
            <TableHead>Agent</TableHead>
            <SortableHeader sortKey="createdAt" currentSortBy={sortBy} currentSortOrder={sortOrder} onClick={() => {}}>
              Created
            </SortableHeader>
            <TableHead className="w-48 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="font-medium">{lead.name}</TableCell>
              <TableCell>
                <div className="flex flex-col text-sm">
                  <span>{lead.email}</span>
                  <span className="text-muted-foreground">{lead.phone}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariants[lead.status]}>{lead.status.replace("_", " ")}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={scoreBadgeVariant(lead.score)}>{lead.score}</Badge>
              </TableCell>
              <TableCell className="text-sm">{lead.leadSource.replace("_", " ")}</TableCell>
              <TableCell className="text-sm">{getAgentName(lead.agentId)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(lead.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onView(lead)} aria-label="View lead">
                    <Eye className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(lead)} aria-label="Edit lead">
                    <Edit2 className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(lead)}
                    aria-label="Delete lead"
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