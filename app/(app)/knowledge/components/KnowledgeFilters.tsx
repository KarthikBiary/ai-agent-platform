"use client";

import * as React from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { Agent, KnowledgeSourceType } from "@/types";

const SOURCE_TYPES: { value: KnowledgeSourceType; label: string }[] = [
  { value: "pdf", label: "PDF" },
  { value: "docx", label: "DOCX" },
  { value: "url", label: "Website URL" },
];

interface KnowledgeFiltersProps {
  agents: Agent[];
  initialSearch: string;
  initialAgentId: string;
  initialSourceType: KnowledgeSourceType | "";
  initialSortBy: "name" | "sourceType" | "createdAt";
  initialSortOrder: "asc" | "desc";
  onSearchChange: (value: string) => void;
  onAgentIdChange: (value: string) => void;
  onSourceTypeChange: (value: KnowledgeSourceType | "") => void;
  onSortChange: (sortBy: "name" | "sourceType" | "createdAt", sortOrder: "asc" | "desc") => void;
}

export function KnowledgeFilters({
  agents,
  initialSearch,
  initialAgentId,
  initialSourceType,
  initialSortBy,
  initialSortOrder,
  onSearchChange,
  onAgentIdChange,
  onSourceTypeChange,
  onSortChange,
}: KnowledgeFiltersProps) {
  const [search, setSearch] = React.useState(initialSearch);
  const [agentId, setAgentId] = React.useState(initialAgentId);
  const [sourceType, setSourceType] = React.useState<KnowledgeSourceType | "">(initialSourceType);
  const [sortBy, setSortBy] = React.useState<"name" | "sourceType" | "createdAt">(initialSortBy);
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">(initialSortOrder);
  const [agentOpen, setAgentOpen] = React.useState(false);
  const [typeOpen, setTypeOpen] = React.useState(false);

  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);

    debounceTimeoutRef.current = setTimeout(() => {
      onSearchChange(search);
      onAgentIdChange(agentId);
      onSourceTypeChange(sourceType);
      onSortChange(sortBy, sortOrder);
    }, 300);

    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, [search, agentId, sourceType, sortBy, sortOrder, onSearchChange, onAgentIdChange, onSourceTypeChange, onSortChange]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleAgentToggle = (agentIdVal: string) => {
    const newAgentId = agentId === agentIdVal ? "" : agentIdVal;
    setAgentId(newAgentId);
  };

  const handleTypeToggle = (type: KnowledgeSourceType) => {
    const newType = sourceType === type ? "" : type;
    setSourceType(newType);
  };

  const handleSortChange = (newSortBy: "name" | "sourceType" | "createdAt") => {
    let newSortOrder: "asc" | "desc" = "asc";
    if (sortBy === newSortBy && sortOrder === "asc") {
      newSortOrder = "desc";
    }
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const clearAllFilters = () => {
    setSearch("");
    setAgentId("");
    setSourceType("");
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  const selectedAgent = agents.find((a) => a.id === agentId);
  const hasActiveFilters = search || agentId || sourceType || sortBy !== "createdAt" || sortOrder !== "desc";

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search knowledge sources..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu open={agentOpen} onOpenChange={setAgentOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="size-4" />
              Agent
              <ChevronDown className="size-4" />
              {agentId && (
                <Badge variant="secondary" className="ml-1">
                  {selectedAgent?.name ?? "1"}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" side="bottom" align="end">
            <DropdownMenuLabel>Filter by Agent</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {agents.length === 0 && (
                <DropdownMenuCheckboxItem disabled>
                  No agents available
                </DropdownMenuCheckboxItem>
              )}
              {agents.map((agent) => (
                <DropdownMenuCheckboxItem
                  key={agent.id}
                  checked={agentId === agent.id}
                  onCheckedChange={() => handleAgentToggle(agent.id)}
                >
                  {agent.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu open={typeOpen} onOpenChange={setTypeOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="size-4" />
              Type
              <ChevronDown className="size-4" />
              {sourceType && (
                <Badge variant="secondary" className="ml-1">
                  {sourceType.toUpperCase()}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" side="bottom" align="end">
            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {SOURCE_TYPES.map((type) => (
                <DropdownMenuCheckboxItem
                  key={type.value}
                  checked={sourceType === type.value}
                  onCheckedChange={() => handleTypeToggle(type.value)}
                >
                  {type.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <ChevronDown className="size-4" />
              Sort: {sortBy} ({sortOrder === "asc" ? "\u2191" : "\u2193"})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" side="bottom" align="end">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {[
                { value: "name", label: "Name" },
                { value: "sourceType", label: "Type" },
                { value: "createdAt", label: "Created Date" },
              ].map((opt) => (
                <DropdownMenuCheckboxItem
                  key={opt.value}
                  checked={sortBy === opt.value}
                  onCheckedChange={() => handleSortChange(opt.value as "name" | "sourceType" | "createdAt")}
                >
                  {opt.label} {sortBy === opt.value && (sortOrder === "asc" ? "\u2191" : "\u2193")}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {hasActiveFilters && (
          <Button variant="ghost" size="icon" onClick={clearAllFilters} aria-label="Clear filters">
            <X className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}