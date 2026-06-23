import { listCalls } from "@/lib/data/calls";
import { listAgents } from "@/lib/data/agents";
import { listLeads } from "@/lib/data/leads";
import { CallsClient } from "./CallsClient";
import type { CallStatus, CallDirection, CallOutcome } from "@/types";

interface CallsPageProps {
  searchParams: Promise<{
    search?: string;
    statuses?: string;
    direction?: string;
    outcome?: string;
    agentId?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function CallsPage({ searchParams }: CallsPageProps) {
  const params = await searchParams;
  const search = params.search ?? "";
  const statuses = (params.statuses?.split(",").filter(Boolean) as CallStatus[]) ?? [];
  const direction = (params.direction as CallDirection) ?? "";
  const outcome = (params.outcome as CallOutcome) ?? "";
  const agentId = params.agentId ?? "";
  const sortBy = (params.sortBy as "durationSec" | "status" | "direction" | "outcome" | "startedAt") ?? "startedAt";
  const sortOrder = (params.sortOrder as "asc" | "desc") ?? "desc";

  const [calls, agents, leads] = await Promise.all([
    listCalls({ search, statuses, direction, outcome, agentId, sortBy, sortOrder }),
    listAgents(),
    listLeads(),
  ]);

  return (
    <CallsClient
      initialCalls={calls}
      initialAgents={agents}
      initialLeads={leads}
      initialSearch={search}
      initialStatuses={statuses}
      initialDirection={direction}
      initialOutcome={outcome}
      initialAgentId={agentId}
      initialSortBy={sortBy}
      initialSortOrder={sortOrder}
    />
  );
}