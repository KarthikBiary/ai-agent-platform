import { listLeads } from "@/lib/data/leads";
import { listAgents } from "@/lib/data/agents";
import { LeadsClient } from "./LeadsClient";
import type { LeadStatus, LeadSource } from "@/types";

interface LeadsPageProps {
  searchParams: Promise<{
    search?: string;
    statuses?: string;
    leadSource?: string;
    agentId?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const params = await searchParams;
  const search = params.search ?? "";
  const statuses = (params.statuses?.split(",").filter(Boolean) as LeadStatus[]) ?? [];
  const leadSource = (params.leadSource as LeadSource) ?? "";
  const agentId = params.agentId ?? "";
  const sortBy = (params.sortBy as "name" | "status" | "score" | "leadSource" | "createdAt") ?? "createdAt";
  const sortOrder = (params.sortOrder as "asc" | "desc") ?? "desc";

  const [leads, agents] = await Promise.all([
    listLeads({ search, statuses, leadSource, agentId, sortBy, sortOrder }),
    listAgents(),
  ]);

  return (
    <LeadsClient
      initialLeads={leads}
      initialAgents={agents}
      initialSearch={search}
      initialStatuses={statuses}
      initialLeadSource={leadSource}
      initialAgentId={agentId}
      initialSortBy={sortBy}
      initialSortOrder={sortOrder}
    />
  );
}