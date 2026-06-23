import "server-only";

import { leads, leadsSeries30 } from "@/lib/data/seed";
import type { Lead, LeadStatus, SeriesPoint } from "@/types";

export async function listLeads(): Promise<Lead[]> {
  return [...leads].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
}

export async function countLeads(): Promise<number> {
  return leads.length;
}

/** Number of leads broken down by status. */
export async function countLeadsByStatus(): Promise<Record<LeadStatus, number>> {
  const counts: Record<string, number> = {
    new: 0,
    contacted: 0,
    qualified: 0,
    booked: 0,
    lost: 0,
  };
  for (const lead of leads) {
    counts[lead.status] = (counts[lead.status] ?? 0) + 1;
  }
  return counts as Record<LeadStatus, number>;
}

/**
 * Daily lead counts for the last `days` days.
 * Returns only the tail of the full 30-day series when `days < 30`.
 */
export async function getLeadsSeries(days: number = 30): Promise<SeriesPoint[]> {
  return leadsSeries30.slice(-days);
}
