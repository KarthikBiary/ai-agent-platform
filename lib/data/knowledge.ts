import { knowledgeSources } from "@/lib/data/seed";
import type { KnowledgeSource, KnowledgeSourceType } from "@/types";

let knowledgeStore: KnowledgeSource[] = [...knowledgeSources];

function generateId(): string {
  return `ks_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export interface ListKnowledgeSourcesParams {
  search?: string;
  agentId?: string;
  sourceType?: KnowledgeSourceType | "";
  sortBy?: "name" | "sourceType" | "createdAt";
  sortOrder?: "asc" | "desc";
}

function matchesSearch(source: KnowledgeSource, search: string): boolean {
  const query = search.toLowerCase();
  return (
    source.name.toLowerCase().includes(query) ||
    source.fileName.toLowerCase().includes(query) ||
    source.sourceType.toLowerCase().includes(query)
  );
}

function matchesAgent(source: KnowledgeSource, agentId: string): boolean {
  return agentId === "" || source.agentId === agentId;
}

function matchesSourceType(source: KnowledgeSource, sourceType: KnowledgeSourceType | ""): boolean {
  return sourceType === "" || source.sourceType === sourceType;
}

export async function listKnowledgeSources(params: ListKnowledgeSourcesParams = {}): Promise<KnowledgeSource[]> {
  const { search = "", agentId = "", sourceType = "", sortBy = "createdAt", sortOrder = "desc" } = params;

  const filtered = knowledgeStore.filter((source) => {
    return matchesSearch(source, search) && matchesAgent(source, agentId) && matchesSourceType(source, sourceType);
  });

  filtered.sort((a, b) => {
    let aVal: string | Date;
    let bVal: string | Date;

    switch (sortBy) {
      case "name":
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      case "sourceType":
        aVal = a.sourceType;
        bVal = b.sourceType;
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

export async function getKnowledgeSource(id: string): Promise<KnowledgeSource | undefined> {
  return knowledgeStore.find((s) => s.id === id);
}

export async function countKnowledgeSources(): Promise<number> {
  return knowledgeStore.length;
}

export async function createKnowledgeSource(data: Omit<KnowledgeSource, "id" | "createdAt">): Promise<KnowledgeSource> {
  const newSource: KnowledgeSource = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  knowledgeStore = [newSource, ...knowledgeStore];
  return newSource;
}

export async function updateKnowledgeSource(id: string, data: Partial<Omit<KnowledgeSource, "id" | "createdAt">>): Promise<KnowledgeSource | undefined> {
  const index = knowledgeStore.findIndex((s) => s.id === id);
  if (index === -1) return undefined;
  knowledgeStore[index] = { ...knowledgeStore[index], ...data };
  return knowledgeStore[index];
}

export async function deleteKnowledgeSource(id: string): Promise<boolean> {
  const index = knowledgeStore.findIndex((s) => s.id === id);
  if (index === -1) return false;
  knowledgeStore.splice(index, 1);
  return true;
}