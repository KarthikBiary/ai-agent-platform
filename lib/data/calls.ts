import "server-only";

import { calls } from "@/lib/data/seed";
import type { Call, CallStatus, CallDirection, CallOutcome } from "@/types";

export interface ListCallsParams {
  search?: string;
  statuses?: CallStatus[];
  direction?: CallDirection | "";
  outcome?: CallOutcome | "";
  agentId?: string;
  sortBy?: "durationSec" | "direction" | "status" | "outcome" | "startedAt";
  sortOrder?: "asc" | "desc";
}

function matchesStatuses(call: Call, statuses: CallStatus[]): boolean {
  return statuses.length === 0 || statuses.includes(call.status);
}

function matchesDirection(call: Call, direction: CallDirection | ""): boolean {
  return direction === "" || call.direction === direction;
}

function matchesOutcome(call: Call, outcome: CallOutcome | ""): boolean {
  return outcome === "" || call.outcome === outcome;
}

function matchesAgent(call: Call, agentId: string): boolean {
  return agentId === "" || call.agentId === agentId;
}

export async function listCalls(params: ListCallsParams = {}): Promise<Call[]> {
  const { search = "", statuses = [], direction = "", outcome = "", agentId = "", sortBy = "startedAt", sortOrder = "desc" } = params;
  const query = search.toLowerCase();

  const filtered = calls.filter((call) => {
    if (!matchesStatuses(call, statuses)) return false;
    if (!matchesDirection(call, direction)) return false;
    if (!matchesOutcome(call, outcome)) return false;
    if (!matchesAgent(call, agentId)) return false;
    if (query) {
      const searchable = [call.id, call.leadId, call.agentId].join(" ").toLowerCase();
      if (!searchable.includes(query)) return false;
    }
    return true;
  });

  filtered.sort((a, b) => {
    let aVal: string | number | Date;
    let bVal: string | number | Date;

    switch (sortBy) {
      case "durationSec":
        aVal = a.durationSec;
        bVal = b.durationSec;
        break;
      case "direction":
        aVal = a.direction;
        bVal = b.direction;
        break;
      case "status":
        aVal = a.status;
        bVal = b.status;
        break;
      case "outcome":
        aVal = a.outcome;
        bVal = b.outcome;
        break;
      case "startedAt":
      default:
        aVal = new Date(a.startedAt);
        bVal = new Date(b.startedAt);
        break;
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return filtered;
}

export async function getCall(id: string): Promise<Call | undefined> {
  return calls.find((c) => c.id === id);
}

export async function countCalls(): Promise<number> {
  return calls.length;
}

export async function getCallsSeries(days: number = 30): Promise<{ date: string; value: number }[]> {
  const { callsSeries30 } = await import("@/lib/data/seed");
  return callsSeries30.slice(-days);
}

export async function getConversionSeries(): Promise<{ week: string; rate: number }[]> {
  const { conversionSeriesWeekly } = await import("@/lib/data/seed");
  return [...conversionSeriesWeekly];
}

export async function countCallsByStatus(): Promise<Record<CallStatus, number>> {
  const counts: Record<string, number> = {
    queued: 0,
    ringing: 0,
    completed: 0,
    missed: 0,
    failed: 0,
  };
  for (const call of calls) {
    counts[call.status] = (counts[call.status] ?? 0) + 1;
  }
  return counts as Record<CallStatus, number>;
}