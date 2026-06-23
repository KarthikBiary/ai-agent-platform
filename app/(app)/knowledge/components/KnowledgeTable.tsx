"use client";

import * as React from "react";
import { Eye, Edit2, Trash2, FileText, Globe, File, ChevronUp, ChevronDown } from "lucide-react";

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
import type { KnowledgeSource, KnowledgeSourceStatus, Agent } from "@/types";

interface KnowledgeTableProps {
  sources: KnowledgeSource[];
  agents: Agent[];
  sortBy: "name" | "sourceType" | "createdAt";
  sortOrder: "asc" | "desc";
  onView: (source: KnowledgeSource) => void;
  onEdit: (source: KnowledgeSource) => void;
  onDelete: (source: KnowledgeSource) => void;
}

const statusVariants: Record<KnowledgeSourceStatus, "default" | "secondary" | "outline"> = {
  ready: "default",
  processing: "secondary",
};

const typeIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  docx: File,
  url: Globe,
};

function SortableHeader({
  children,
  sortBy,
  currentSortBy,
  currentSortOrder,
  onClick,
}: {
  children: React.ReactNode;
  sortBy: "name" | "sourceType" | "createdAt";
  currentSortBy: "name" | "sourceType" | "createdAt";
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
          <span className="size-4 text-muted-foreground">{'\u21C5'}</span>
        )}
      </div>
    </TableHead>
  );
}

export function KnowledgeTable({
  sources,
  agents,
  sortBy,
  sortOrder,
  onView,
  onEdit,
  onDelete,
}: KnowledgeTableProps) {
  function getAgentName(agentId: string): string {
    return agents.find((a) => a.id === agentId)?.name ?? agentId;
  }

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
              sortBy="sourceType"
              currentSortBy={sortBy}
              currentSortOrder={sortOrder}
              onClick={() => {}}
            >
              Type
            </SortableHeader>
            <TableHead>Agent</TableHead>
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
          {sources.map((source) => {
            const TypeIcon = typeIcons[source.sourceType] ?? File;
            return (
              <TableRow key={source.id}>
                <TableCell className="font-medium">{source.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <TypeIcon className="size-4 text-muted-foreground" />
                    {source.sourceType.toUpperCase()}
                  </div>
                </TableCell>
                <TableCell>{getAgentName(source.agentId)}</TableCell>
                <TableCell>
                  <Badge variant={statusVariants[source.status]}>{source.status}</Badge>
                </TableCell>
                <TableCell>{new Date(source.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(source)}
                      aria-label="View source"
                    >
                      <Eye className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(source)}
                      aria-label="Edit source"
                    >
                      <Edit2 className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(source)}
                      aria-label="Delete source"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}