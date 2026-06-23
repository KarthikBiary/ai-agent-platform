import { listAgents } from "@/lib/data/agents";
import { AgentsClient } from "./AgentsClient";
import type { Industry, AgentStatus } from "@/types";

interface AgentsPageProps {
  searchParams: Promise<{
    search?: string;
    industries?: string;
    statuses?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function AgentsPage({ searchParams }: AgentsPageProps) {
  const params = await searchParams;
  const search = params.search ?? "";
  const industries = (params.industries?.split(",").filter(Boolean) as Industry[]) ?? [];
  const statuses = (params.statuses?.split(",").filter(Boolean) as AgentStatus[]) ?? [];
  const sortBy = (params.sortBy as "name" | "industry" | "createdAt") ?? "createdAt";
  const sortOrder = (params.sortOrder as "asc" | "desc") ?? "desc";

  const agents = await listAgents({ search, industries, statuses, sortBy, sortOrder });

  return (
    <AgentsClient
      initialAgents={agents}
      initialSearch={search}
      initialIndustries={industries}
      initialStatuses={statuses}
      initialSortBy={sortBy}
      initialSortOrder={sortOrder}
    />
  );
}