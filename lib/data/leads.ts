import { leads, agents, calls } from "@/lib/data/seed";
import type { Lead, LeadStatus, LeadSource, SeriesPoint, ActivityItem } from "@/types";

let leadsStore: Lead[] = [...leads];

function generateId(): string {
  return `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export interface ListLeadsParams {
  search?: string;
  statuses?: LeadStatus[];
  leadSource?: LeadSource;
  agentId?: string;
  sortBy?: "name" | "status" | "score" | "leadSource" | "createdAt";
  sortOrder?: "asc" | "desc";
}

function matchesSearch(lead: Lead, search: string): boolean {
  const query = search.toLowerCase();
  return (
    lead.name.toLowerCase().includes(query) ||
    lead.email.toLowerCase().includes(query) ||
    lead.phone.includes(query)
  );
}

function matchesStatuses(lead: Lead, statuses: LeadStatus[]): boolean {
  return statuses.length === 0 || statuses.includes(lead.status);
}

function matchesLeadSource(lead: Lead, leadSource: LeadSource | ""): boolean {
  return leadSource === "" || lead.leadSource === leadSource;
}

function matchesAgent(lead: Lead, agentId: string): boolean {
  return agentId === "" || lead.agentId === agentId;
}

export async function listLeads(params: ListLeadsParams = {}): Promise<Lead[]> {
  const { search = "", statuses = [], leadSource = "", agentId = "", sortBy = "createdAt", sortOrder = "desc" } = params;

  const filtered = leadsStore.filter((lead) => {
    return matchesSearch(lead, search) && matchesStatuses(lead, statuses) && matchesLeadSource(lead, leadSource) && matchesAgent(lead, agentId);
  });

  filtered.sort((a, b) => {
    let aVal: string | number | Date;
    let bVal: string | number | Date;

    switch (sortBy) {
      case "name":
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      case "status":
        aVal = a.status;
        bVal = b.status;
        break;
      case "score":
        aVal = a.score;
        bVal = b.score;
        break;
      case "leadSource":
        aVal = a.leadSource;
        bVal = b.leadSource;
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

export async function getLead(id: string): Promise<Lead | undefined> {
  return leadsStore.find((l) => l.id === id);
}

export async function countLeads(): Promise<number> {
  return leadsStore.length;
}

export async function countLeadsByStatus(): Promise<Record<LeadStatus, number>> {
  const counts: Record<string, number> = {
    new: 0,
    contacted: 0,
    qualified: 0,
    proposal_sent: 0,
    won: 0,
    lost: 0,
  };
  for (const lead of leadsStore) {
    counts[lead.status] = (counts[lead.status] ?? 0) + 1;
  }
  return counts as Record<LeadStatus, number>;
}

export async function getLeadsSeries(days: number = 30): Promise<SeriesPoint[]> {
  const { leadsSeries30 } = await import("@/lib/data/seed");
  return leadsSeries30.slice(-days);
}

export async function createLead(data: Omit<Lead, "id" | "createdAt">): Promise<Lead> {
  const newLead: Lead = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  leadsStore = [newLead, ...leadsStore];
  return newLead;
}

export async function updateLead(id: string, data: Partial<Omit<Lead, "id" | "createdAt">>): Promise<Lead | undefined> {
  const index = leadsStore.findIndex((l) => l.id === id);
  if (index === -1) return undefined;
  leadsStore[index] = { ...leadsStore[index], ...data };
  return leadsStore[index];
}

export async function deleteLead(id: string): Promise<boolean> {
  const index = leadsStore.findIndex((l) => l.id === id);
  if (index === -1) return false;
  leadsStore.splice(index, 1);
  return true;
}

export async function getLeadActivity(leadId: string): Promise<ActivityItem[]> {
  const lead = leadsStore.find((l) => l.id === leadId);
  if (!lead) return [];

  const agent = agents.find((a) => a.id === lead.agentId);
  const agentName = agent?.name ?? lead.agentId;

  const leadCalls = calls.filter((c) => c.leadId === leadId);

  const activity: ActivityItem[] = [
    {
      id: `act_created_${lead.id}`,
      type: "lead",
      title: "Lead created",
      description: `Source: ${lead.leadSource.replace("_", " ")} · Score: ${lead.score} · Assigned to ${agentName}`,
      createdAt: lead.createdAt,
    },
    ...leadCalls.map((call) => ({
      id: `act_call_${call.id}`,
      type: "call" as const,
      title: `Call completed · ${Math.floor(call.durationSec / 60)}m ${call.durationSec % 60}s`,
      description: call.summary ?? "No summary",
      createdAt: call.startedAt,
    })),
  ];

  return activity.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}