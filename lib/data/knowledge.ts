import "server-only";

import { knowledgeSources } from "@/lib/data/seed";
import type { KnowledgeSource } from "@/types";

export async function listKnowledgeSources(): Promise<KnowledgeSource[]> {
  return [...knowledgeSources].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
}

export async function countKnowledgeSources(): Promise<number> {
  return knowledgeSources.length;
}
