"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
import type { Agent, CallStatus, CallDirection, CallOutcome } from "@/types";

const STATUSES: { value: CallStatus; label: string }[] = [
  { value: "queued", label: "Queued" },
  { value: "ringing", label: "Ringing" },
  { value: "completed", label: "Completed" },
  { value: "missed", label: "Missed" },
  { value: "failed", label: "Failed" },
];

const DIRECTIONS: { value: CallDirection; label: string }[] = [
  { value: "inbound", label: "Inbound" },
  { value: "outbound", label: "Outbound" },
];

const OUTCOMES: { value: CallOutcome; label: string }[] = [
  { value: "interested", label: "Interested" },
  { value: "follow_up", label: "Follow Up" },
  { value: "not_interested", label: "Not Interested" },
  { value: "booked_meeting", label: "Booked Meeting" },
  { value: "voicemail", label: "Voicemail" },
  { value: "unknown", label: "Unknown" },
];

interface CallsFiltersProps {
  agents: Agent[];
  initialSearch: string;
  initialStatuses: CallStatus[];
  initialDirection: CallDirection | "";
  initialOutcome: CallOutcome | "";
  initialAgentId: string;
  initialSortBy: "durationSec" | "status" | "direction" | "outcome" | "startedAt";
  initialSortOrder: "asc" | "desc";
}

export function CallsFilters({
  agents,
  initialSearch,
  initialStatuses,
  initialDirection,
  initialOutcome,
  initialAgentId,
  initialSortBy,
  initialSortOrder,
}: CallsFiltersProps) {
  const router = useRouter();

  const [search, setSearch] = React.useState(initialSearch);
  const [statuses, setStatuses] = React.useState<CallStatus[]>(initialStatuses);
  const [direction, setDirection] = React.useState<CallDirection | "">(initialDirection);
  const [outcome, setOutcome] = React.useState<CallOutcome | "">(initialOutcome);
  const [agentId, setAgentId] = React.useState(initialAgentId);
  const [sortBy, setSortBy] = React.useState<"durationSec" | "status" | "direction" | "outcome" | "startedAt">(initialSortBy);
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">(initialSortOrder);
  const [statusOpen, setStatusOpen] = React.useState(false);
  const [directionOpen, setDirectionOpen] = React.useState(false);
  const [outcomeOpen, setOutcomeOpen] = React.useState(false);
  const [agentOpen, setAgentOpen] = React.useState(false);

  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);

    debounceTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statuses.length > 0) params.set("statuses", statuses.join(","));
      if (direction) params.set("direction", direction);
      if (outcome) params.set("outcome", outcome);
      if (agentId) params.set("agentId", agentId);
      if (sortBy !== "startedAt") params.set("sortBy", sortBy);
      if (sortOrder !== "desc") params.set("sortOrder", sortOrder);
      router.push(`/calls?${params.toString()}`, { scroll: false });
    }, 300);

    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, [search, statuses, direction, outcome, agentId, sortBy, sortOrder, router]);

  const handleStatusToggle = (s: CallStatus) => {
    const next = statuses.includes(s) ? statuses.filter((x) => x !== s) : [...statuses, s];
    setStatuses(next);
  };

  const handleDirectionToggle = (d: CallDirection) => {
    setDirection(direction === d ? "" : d);
  };

  const handleOutcomeToggle = (o: CallOutcome) => {
    setOutcome(outcome === o ? "" : o);
  };

  const handleAgentToggle = (id: string) => {
    setAgentId(agentId === id ? "" : id);
  };

  const handleSortChange = (newSortBy: "durationSec" | "status" | "direction" | "outcome" | "startedAt") => {
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
    setDirection("");
    setOutcome("");
    setAgentId("");
    setSortBy("startedAt");
    setSortOrder("desc");
    router.push("/calls", { scroll: false });
  };

  const selectedAgent = agents.find((a) => a.id === agentId);
  const hasActiveFilters = search || statuses.length > 0 || direction || outcome || agentId || sortBy !== "startedAt" || sortOrder !== "desc";

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search calls..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <DropdownMenu open={statusOpen} onOpenChange={setStatusOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="size-4" />
              Status
              <ChevronDown className="size-4" />
              {statuses.length > 0 && (
                <Badge variant="secondary" className="ml-1">{statuses.length}</Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" side="bottom" align="end">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {STATUSES.map((s) => (
                <DropdownMenuCheckboxItem key={s.value} checked={statuses.includes(s.value)} onCheckedChange={() => handleStatusToggle(s.value)}>
                  {s.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu open={directionOpen} onOpenChange={setDirectionOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="size-4" />
              Direction
              <ChevronDown className="size-4" />
              {direction && (
                <Badge variant="secondary" className="ml-1">{direction}</Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" side="bottom" align="end">
            <DropdownMenuLabel>Filter by Direction</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {DIRECTIONS.map((d) => (
                <DropdownMenuCheckboxItem key={d.value} checked={direction === d.value} onCheckedChange={() => handleDirectionToggle(d.value)}>
                  {d.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu open={outcomeOpen} onOpenChange={setOutcomeOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="size-4" />
              Outcome
              <ChevronDown className="size-4" />
              {outcome && (
                <Badge variant="secondary" className="ml-1">{outcome.replace("_", " ")}</Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" side="bottom" align="end">
            <DropdownMenuLabel>Filter by Outcome</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {OUTCOMES.map((o) => (
                <DropdownMenuCheckboxItem key={o.value} checked={outcome === o.value} onCheckedChange={() => handleOutcomeToggle(o.value)}>
                  {o.label}
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
                <Badge variant="secondary" className="ml-1">{selectedAgent?.name ?? "1"}</Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" side="bottom" align="end">
            <DropdownMenuLabel>Filter by Agent</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {agents.length === 0 && (
                <DropdownMenuCheckboxItem disabled>No agents available</DropdownMenuCheckboxItem>
              )}
              {agents.map((a) => (
                <DropdownMenuCheckboxItem key={a.id} checked={agentId === a.id} onCheckedChange={() => handleAgentToggle(a.id)}>
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
              Sort: {sortBy.replace("Sec", "").replace("startedAt", "date")} ({sortOrder === "asc" ? "\u2191" : "\u2193"})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" side="bottom" align="end">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {[
                { value: "startedAt", label: "Date" },
                { value: "durationSec", label: "Duration" },
                { value: "status", label: "Status" },
                { value: "direction", label: "Direction" },
                { value: "outcome", label: "Outcome" },
              ].map((opt) => (
                <DropdownMenuCheckboxItem
                  key={opt.value}
                  checked={sortBy === opt.value}
                  onCheckedChange={() => handleSortChange(opt.value as "durationSec" | "status" | "direction" | "outcome" | "startedAt")}
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