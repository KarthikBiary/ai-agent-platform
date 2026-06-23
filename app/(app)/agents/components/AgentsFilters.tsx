"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import type { Industry, AgentStatus } from "@/types";

const INDUSTRIES: { value: Industry; label: string }[] = [
  { value: "healthcare", label: "Healthcare" },
  { value: "real_estate", label: "Real Estate" },
  { value: "restaurant", label: "Restaurant" },
  { value: "spa", label: "Spa" },
  { value: "convention_hall", label: "Convention Hall" },
  { value: "hospitality", label: "Hospitality" },
];

const STATUSES: { value: AgentStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "paused", label: "Paused" },
];

interface AgentsFiltersProps {
  initialSearch: string;
  initialIndustries: Industry[];
  initialStatuses: AgentStatus[];
  initialSortBy: "name" | "industry" | "createdAt";
  initialSortOrder: "asc" | "desc";
}

export function AgentsFilters({
  initialSearch,
  initialIndustries,
  initialStatuses,
  initialSortBy,
  initialSortOrder,
}: AgentsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = React.useState(initialSearch);
  const [industries, setIndustries] = React.useState<Industry[]>(initialIndustries);
  const [statuses, setStatuses] = React.useState<AgentStatus[]>(initialStatuses);
  const [sortBy, setSortBy] = React.useState<"name" | "industry" | "createdAt">(initialSortBy);
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">(initialSortOrder);
  const [industryOpen, setIndustryOpen] = React.useState(false);
  const [statusOpen, setStatusOpen] = React.useState(false);

  const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);

    debounceTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (industries.length > 0) params.set("industries", industries.join(","));
      if (statuses.length > 0) params.set("statuses", statuses.join(","));
      if (sortBy !== "createdAt") params.set("sortBy", sortBy);
      if (sortOrder !== "desc") params.set("sortOrder", sortOrder);
      router.push(`/agents?${params.toString()}`, { scroll: false });
    }, 300);

    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, [search, industries, statuses, sortBy, sortOrder, router]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleIndustryToggle = (industry: Industry) => {
    const newIndustries = industries.includes(industry)
      ? industries.filter((i) => i !== industry)
      : [...industries, industry];
    setIndustries(newIndustries);
  };

  const handleStatusToggle = (status: AgentStatus) => {
    const newStatuses = statuses.includes(status)
      ? statuses.filter((s) => s !== status)
      : [...statuses, status];
    setStatuses(newStatuses);
  };

  const handleSortChange = (newSortBy: "name" | "industry" | "createdAt") => {
    let newSortOrder: "asc" | "desc" = "asc";
    if (sortBy === newSortBy && sortOrder === "asc") {
      newSortOrder = "desc";
    }
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const clearAllFilters = () => {
    setSearch("");
    setIndustries([]);
    setStatuses([]);
    setSortBy("createdAt");
    setSortOrder("desc");
    router.push("/agents", { scroll: false });
  };

  const hasActiveFilters = search || industries.length > 0 || statuses.length > 0 || sortBy !== "createdAt" || sortOrder !== "desc";

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search agents..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu open={industryOpen} onOpenChange={setIndustryOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="size-4" />
              Industry
              <ChevronDown className="size-4" />
              {industries.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {industries.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" side="bottom" align="end">
            <DropdownMenuLabel>Filter by Industry</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {INDUSTRIES.map((industry) => (
                <DropdownMenuCheckboxItem
                  key={industry.value}
                  checked={industries.includes(industry.value)}
                  onCheckedChange={() => handleIndustryToggle(industry.value)}
                >
                  {industry.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

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
          <DropdownMenuContent className="w-48" side="bottom" align="end">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {STATUSES.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status.value}
                  checked={statuses.includes(status.value)}
                  onCheckedChange={() => handleStatusToggle(status.value)}
                >
                  {status.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <ChevronDown className="size-4" />
              Sort: {sortBy} ({sortOrder === "asc" ? "↑" : "↓"})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" side="bottom" align="end">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {[
                { value: "name", label: "Name" },
                { value: "industry", label: "Industry" },
                { value: "createdAt", label: "Created Date" },
              ].map((opt) => (
                <DropdownMenuCheckboxItem
                  key={opt.value}
                  checked={sortBy === opt.value}
                  onCheckedChange={() => handleSortChange(opt.value as "name" | "industry" | "createdAt")}
                >
                  {opt.label} {sortBy === opt.value && (sortOrder === "asc" ? "↑" : "↓")}
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