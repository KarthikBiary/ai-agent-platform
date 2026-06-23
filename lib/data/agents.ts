import { agents } from "@/lib/data/seed";
import type { Agent, Industry, AgentStatus } from "@/types";

let agentsStore: Agent[] = [...agents];

function generateId(): string {
  return `agt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export interface ListAgentsParams {
  search?: string;
  industries?: Industry[];
  statuses?: AgentStatus[];
  sortBy?: "name" | "industry" | "createdAt";
  sortOrder?: "asc" | "desc";
}

function matchesSearch(agent: Agent, search: string): boolean {
  const query = search.toLowerCase();
  return (
    agent.name.toLowerCase().includes(query) ||
    agent.industry.toLowerCase().includes(query) ||
    agent.voice.toLowerCase().includes(query)
  );
}

function matchesIndustry(agent: Agent, industries: Industry[]): boolean {
  return industries.length === 0 || industries.includes(agent.industry);
}

function matchesStatus(agent: Agent, statuses: AgentStatus[]): boolean {
  return statuses.length === 0 || statuses.includes(agent.status);
}

export async function listAgents(params: ListAgentsParams = {}): Promise<Agent[]> {
  const { search = "", industries = [], statuses = [], sortBy = "createdAt", sortOrder = "desc" } = params;

  const filtered = agentsStore.filter((agent) => {
    return matchesSearch(agent, search) && matchesIndustry(agent, industries) && matchesStatus(agent, statuses);
  });

  filtered.sort((a, b) => {
    let aVal: string | Date;
    let bVal: string | Date;

    switch (sortBy) {
      case "name":
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      case "industry":
        aVal = a.industry;
        bVal = b.industry;
        break;
      case "createdAt":
      default:
        aVal = new Date(a.createdAt);
        bVal = new Date(b.createdAt);
        break;
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return filtered;
}

export async function getAgent(id: string): Promise<Agent | undefined> {
  return agentsStore.find((a) => a.id === id);
}

export async function countAgents(): Promise<number> {
  return agentsStore.length;
}

export async function createAgent(data: Omit<Agent, "id" | "createdAt">): Promise<Agent> {
  const newAgent: Agent = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  agentsStore = [newAgent, ...agentsStore];
  return newAgent;
}

export async function updateAgent(id: string, data: Partial<Omit<Agent, "id" | "createdAt">>): Promise<Agent | undefined> {
  const index = agentsStore.findIndex((a) => a.id === id);
  if (index === -1) return undefined;
  agentsStore[index] = { ...agentsStore[index], ...data };
  return agentsStore[index];
}

export async function deleteAgent(id: string): Promise<boolean> {
  const index = agentsStore.findIndex((a) => a.id === id);
  if (index === -1) return false;
  agentsStore.splice(index, 1);
  return true;
}