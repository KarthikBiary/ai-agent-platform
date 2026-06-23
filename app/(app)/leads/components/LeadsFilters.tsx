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
import type { Agent, LeadStatus, LeadSource } from "@/types";

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

interface LeadsFiltersProps {
  agents: Agent[];
  initialSearch: string;
  initialStatuses: LeadStatus[];
  initialLeadSource: LeadSource | "";
  initialAgentId: string;
  initialSortBy: "name" | "status" | "score" | "leadSource" | "createdAt";
  initialSortOrder: "asc" | "desc";
  onSearchChange: (value: string) => void;
  onStatusesChange: (value: LeadStatus[]) => void;
  onLeadSourceChange: (value: LeadSource | "") => void;
  onAgentIdChange: (value: string) => void;
  onSortChange: (sortBy: "name" | "status" | "score" | "leadSource" | "createdAt", sortOrder: "asc" | "desc") => void;
}

export function LeadsFilters({
  agents,
  initialSearch,
  initialStatuses,
  initialLeadSource,
  initialAgentId,
  initialSortBy,
  initialSortOrder,
  onSearchChange,
  onStatusesChange,
  onLeadSourceChange,
  onAgentIdChange,
  onSortChange,
}: LeadsFiltersProps) {
  const [search, setSearch] = React.useState(initialSearch);
  const [statuses, setStatuses] = React.useState<LeadStatus[]>(initialStatuses);
  const [leadSource, setLeadSource] = React.useState<LeadSource | "">(initialLeadSource);
  const [agentId, setAgentId] = React.useState(initialAgentId);
  const [sortBy, setSortBy] = React.useState<"name" | "status" | "score" | "leadSource" | "createdAt">(initialSortBy);
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">(initialSortOrder);
  const [statusOpen, setStatusOpen] = React.useState(false);
  const [sourceOpen, setSourceOpen] = React.useState(false);
  const [agentOpen, setAgentOpen] = React.useState(false);

  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);

    debounceTimeoutRef.current = setTimeout(() => {
      onSearchChange(search);
      onStatusesChange(statuses);
      onLeadSourceChange(leadSource);
      onAgentIdChange(agentId);
      onSortChange(sortBy, sortOrder);
    }, 300);

    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, [search, statuses, leadSource, agentId, sortBy, sortOrder, onSearchChange, onStatusesChange, onLeadSourceChange, onAgentIdChange, onSortChange]);

  const handleStatusToggle = (status: LeadStatus) => {
    const newStatuses = statuses.includes(status)
      ? statuses.filter((s) => s !== status)
      : [...statuses, status];
    setStatuses(newStatuses);
  };

  const handleSourceToggle = (source: LeadSource) => {
    const newSource = leadSource === source ? "" : source;
    setLeadSource(newSource);
  };

  const handleAgentToggle = (agentIdVal: string) => {
    const newAgentId = agentId === agentIdVal ? "" : agentIdVal;
    setAgentId(newAgentId);
  };

  const handleSortChange = (newSortBy: "name" | "status" | "score" | "leadSource" | "createdAt") => {
    let newSortOrder: "asc" | "desc" = "asc";
    if (sortBy === newSortBy && sortOrder === "asc") {
      newSortOrder = "desc";
    }
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const clearAllFilters = () => {
    setSearch("");
    setStatuses([]);
    setLeadSource("");
    setAgentId("");
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  const selectedAgent = agents.find((a) => a.id === agentId);
  const hasActiveFilters = search || statuses.length > 0 || leadSource || agentId || sortBy !== "createdAt" || sortOrder !== "desc";

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search leads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu open={statusOpen} onOpenChange={setStatusOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="size-4" />
              Status
              <ChevronDown className="size-4" />
              {statuses.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {statuses.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" side="bottom" align="end">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {STATUSES.map((s) => (
                <DropdownMenuCheckboxItem
                  key={s.value}
                  checked={statuses.includes(s.value)}
                  onCheckedChange={() => handleStatusToggle(s.value)}
                >
                  {s.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu open={sourceOpen} onOpenChange={setSourceOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="size-4" />
              Source
              <ChevronDown className="size-4" />
              {leadSource && (
                <Badge variant="secondary" className="ml-1">
                  {leadSource.replace("_", " ")}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" side="bottom" align="end">
            <DropdownMenuLabel>Filter by Source</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {LEAD_SOURCES.map((s) => (
                <DropdownMenuCheckboxItem
                  key={s.value}
                  checked={leadSource === s.value}
                  onCheckedChange={() => handleSourceToggle(s.value)}
                >
                  {s.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

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
              {agents.map((a) => (
                <DropdownMenuCheckboxItem
                  key={a.id}
                  checked={agentId === a.id}
                  onCheckedChange={() => handleAgentToggle(a.id)}
                >
                  {a.name}
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
                { value: "status", label: "Status" },
                { value: "score", label: "Score" },
                { value: "leadSource", label: "Source" },
                { value: "createdAt", label: "Created Date" },
              ].map((opt) => (
                <DropdownMenuCheckboxItem
                  key={opt.value}
                  checked={sortBy === opt.value}
                  onCheckedChange={() => handleSortChange(opt.value as "name" | "status" | "score" | "leadSource" | "createdAt")}
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