"use client";

import * as React from "react";
import { Eye, Edit2, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { format } from "date-fns";

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
import type { Agent, AgentStatus } from "@/types";

interface AgentsTableProps {
  agents: Agent[];
  sortBy: "name" | "industry" | "createdAt";
  sortOrder: "asc" | "desc";
  onView: (agent: Agent) => void;
  onEdit: (agent: Agent) => void;
  onDelete: (agent: Agent) => void;
}

const statusVariants: Record<AgentStatus, "default" | "secondary" | "outline" | "destructive"> = {
  active: "default",
  draft: "secondary",
  paused: "outline",
};

function SortableHeader({
  children,
  sortBy,
  currentSortBy,
  currentSortOrder,
  onClick,
}: {
  children: React.ReactNode;
  sortBy: "name" | "industry" | "createdAt";
  currentSortBy: "name" | "industry" | "createdAt";
  currentSortOrder: "asc" | "desc";
  onClick: () => void;
}) {
  const isActive = currentSortBy === sortBy;
  return (
    <TableHead className="cursor-pointer select-none hover:bg-muted/50" onClick={onClick}>
      <div className="flex items-center gap-1">
        {children}
        {isActive ? (
          currentSortOrder === "asc" ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />
        ) : (
          <span className="size-4 text-muted-foreground">⇅</span>
        )}
      </div>
    </TableHead>
  );
}

function StatusBadge({ status }: { status: AgentStatus }) {
  return <Badge variant={statusVariants[status]}>{status}</Badge>;
}

export function AgentsTable({
  agents,
  sortBy,
  sortOrder,
  onView,
  onEdit,
  onDelete,
}: AgentsTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader
              sortBy="name"
              currentSortBy={sortBy}
              currentSortOrder={sortOrder}
              onClick={() => {}}
            >
              Name
            </SortableHeader>
            <SortableHeader
              sortBy="industry"
              currentSortBy={sortBy}
              currentSortOrder={sortOrder}
              onClick={() => {}}
            >
              Industry
            </SortableHeader>
            <TableHead>Voice</TableHead>
            <TableHead>Status</TableHead>
            <SortableHeader
              sortBy="createdAt"
              currentSortBy={sortBy}
              currentSortOrder={sortOrder}
              onClick={() => {}}
            >
              Created
            </SortableHeader>
            <TableHead className="w-48 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent) => (
            <TableRow key={agent.id}>
              <TableCell className="font-medium">{agent.name}</TableCell>
              <TableCell>{agent.industry.replace("_", " ")}</TableCell>
              <TableCell>{agent.voice}</TableCell>
              <TableCell>
                <StatusBadge status={agent.status} />
              </TableCell>
              <TableCell>{format(new Date(agent.createdAt), "MMM d, yyyy")}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(agent)}
                    aria-label="View agent"
                  >
                    <Eye className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(agent)}
                    aria-label="Edit agent"
                  >
                    <Edit2 className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(agent)}
                    aria-label="Delete agent"
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