import { listKnowledgeSources } from "@/lib/data/knowledge";
import { listAgents } from "@/lib/data/agents";
import { KnowledgeClient } from "./KnowledgeClient";
import type { KnowledgeSourceType } from "@/types";

interface KnowledgePageProps {
  searchParams: Promise<{
    search?: string;
    agentId?: string;
    sourceType?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function KnowledgePage({ searchParams }: KnowledgePageProps) {
  const params = await searchParams;
  const search = params.search ?? "";
  const agentId = params.agentId ?? "";
  const sourceType = (params.sourceType as KnowledgeSourceType) ?? "";
  const sortBy = (params.sortBy as "name" | "sourceType" | "createdAt") ?? "createdAt";
  const sortOrder = (params.sortOrder as "asc" | "desc") ?? "desc";

  const [sources, agents] = await Promise.all([
    listKnowledgeSources({ search, agentId, sourceType, sortBy, sortOrder }),
    listAgents(),
  ]);

  return (
    <KnowledgeClient
      initialSources={sources}
      initialAgents={agents}
      initialSearch={search}
      initialAgentId={agentId}
      initialSourceType={sourceType}
      initialSortBy={sortBy}
      initialSortOrder={sortOrder}
    />
  );
}