import type {
  ActivityItem,
  Agent,
  Call,
  KnowledgeSource,
  Lead,
  SeriesPoint,
} from "@/types";

/**
 * Typed mock data — the ONLY place literal records live in the app.
 *
 * Components and pages never import this module directly; they go through the
 * access functions in `lib/data/*.ts`. That indirection means swapping the
 * bodies of those functions for Prisma queries later is a 1-line change with
 * zero component edits (design.md: "Never hardcode data structures").
 *
 * Data is deterministic (seeded via a fixed pseudo-random sequence) so server
 * and client renders are stable and charts are reproducible.
 */

/* --------------------------- Deterministic PRNG --------------------------- */
// Simple seeded LCG so generated series are stable across renders/builds.
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

const NOW = new Date("2026-06-23T09:00:00Z"); // anchored "today" (currentDate)

/** Returns an ISO date (YYYY-MM-DD) for `daysAgo` before NOW. */
function isoDateDaysAgo(daysAgo: number): string {
  const d = new Date(NOW);
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

/* --------------------------------- Agents --------------------------------- */

export const agents: Agent[] = [
  {
    id: "agt_1",
    name: "Front Desk Concierge",
    industry: "healthcare",
    prompt:
      "You are the front desk concierge for a dental clinic. Be warm, concise, and always offer the earliest available appointment.",
    voice: "nova",
    status: "active",
    createdAt: "2026-05-04T10:00:00Z",
  },
  {
    id: "agt_2",
    name: "Listings Qualifier",
    industry: "real_estate",
    prompt:
      "You qualify property inquiries. Ask budget, timeline, and preferred neighborhood before booking a viewing.",
    voice: "alloy",
    status: "active",
    createdAt: "2026-05-12T14:30:00Z",
  },
  {
    id: "agt_3",
    name: "Reservation Host",
    industry: "restaurant",
    prompt:
      "You take restaurant reservations. Confirm party size, date, time, and dietary notes.",
    voice: "shimmer",
    status: "draft",
    createdAt: "2026-06-01T08:15:00Z",
  },
  {
    id: "agt_4",
    name: "Spa Booking Agent",
    industry: "spa",
    prompt:
      "You book spa treatments. Recommend packages based on the guest's goals and upsell add-ons politely.",
    voice: "echo",
    status: "active",
    createdAt: "2026-06-10T11:45:00Z",
  },
];

/* --------------------------------- Leads ---------------------------------- */

export const leads: Lead[] = [
  {
    id: "lead_1",
    name: "Amelia Hart",
    phone: "+1 (415) 555-0117",
    email: "amelia.hart@example.com",
    status: "qualified",
    score: 88,
    agentId: "agt_1",
    createdAt: "2026-06-23T08:12:00Z",
  },
  {
    id: "lead_2",
    name: "Diego Romero",
    phone: "+1 (305) 555-0144",
    email: "d.romero@example.com",
    status: "booked",
    score: 95,
    agentId: "agt_2",
    createdAt: "2026-06-23T07:40:00Z",
  },
  {
    id: "lead_3",
    name: "Priya Nair",
    phone: "+1 (646) 555-0188",
    email: "priya.nair@example.com",
    status: "contacted",
    score: 62,
    agentId: "agt_1",
    createdAt: "2026-06-22T18:05:00Z",
  },
  {
    id: "lead_4",
    name: "Marcus Webb",
    phone: "+1 (512) 555-0193",
    email: "marcus.webb@example.com",
    status: "new",
    score: 40,
    agentId: "agt_4",
    createdAt: "2026-06-22T15:22:00Z",
  },
  {
    id: "lead_5",
    name: "Sofia Lindgren",
    phone: "+1 (206) 555-0126",
    email: "sofia.l@example.com",
    status: "lost",
    score: 22,
    agentId: "agt_2",
    createdAt: "2026-06-21T12:30:00Z",
  },
];

/* ---------------------------- Knowledge sources --------------------------- */

export const knowledgeSources: KnowledgeSource[] = [
  {
    id: "ks_1",
    agentId: "agt_1",
    name: "Clinic Services Brochure",
    fileName: "clinic-services-brochure.pdf",
    sourceType: "pdf",
    status: "ready",
    createdAt: "2026-05-06T09:00:00Z",
  },
  {
    id: "ks_2",
    agentId: "agt_1",
    name: "Smile Dental FAQ",
    fileName: "https://docs.smiledental.example.com/faq",
    sourceType: "url",
    status: "ready",
    createdAt: "2026-05-08T13:10:00Z",
  },
  {
    id: "ks_3",
    agentId: "agt_2",
    name: "Neighborhood Listings",
    fileName: "neighborhood-listings.docx",
    sourceType: "docx",
    status: "processing",
    createdAt: "2026-06-22T16:40:00Z",
  },
];

/* ---------------------------------- Calls --------------------------------- */

export const calls: Call[] = [
  {
    id: "call_1",
    agentId: "agt_1",
    leadId: "lead_1",
    durationSec: 214,
    recordingUrl: null,
    transcript: null,
    summary:
      "Caller asked about whitening packages; booked a consultation for next Tuesday.",
    createdAt: "2026-06-23T08:12:00Z",
  },
  {
    id: "call_2",
    agentId: "agt_2",
    leadId: "lead_2",
    durationSec: 308,
    recordingUrl: null,
    transcript: null,
    summary:
      "Qualified buyer, $850k budget; viewing scheduled for the Oakwood listing.",
    createdAt: "2026-06-23T07:40:00Z",
  },
  {
    id: "call_3",
    agentId: "agt_4",
    leadId: "lead_4",
    durationSec: 142,
    recordingUrl: null,
    transcript: null,
    summary: "Guest requested a couples massage; sent booking link via SMS.",
    createdAt: "2026-06-22T15:22:00Z",
  },
];

/* ------------------------- Generated 30-day series ------------------------ */

/** Builds a deterministic N-day series with a gentle upward trend + noise. */
function buildSeries(
  days: number,
  base: number,
  variance: number,
  seed: number,
): SeriesPoint[] {
  const rng = makeRng(seed);
  const out: SeriesPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const trend = Math.round((days - i) * (base * 0.02));
    const noise = Math.round((rng() - 0.4) * variance);
    out.push({ date: isoDateDaysAgo(i), value: Math.max(0, base + trend + noise) });
  }
  return out;
}

export const leadsSeries30: SeriesPoint[] = buildSeries(30, 18, 10, 0x5eed);
export const callsSeries30: SeriesPoint[] = buildSeries(30, 24, 12, 0xca11);

/**
 * Conversion series: share of leads that reached "booked" per week over the
 * last `weeks` weeks. Values are percentages.
 */
export const conversionSeriesWeekly: { week: string; rate: number }[] = [
  { week: "W-3", rate: 18 },
  { week: "W-2", rate: 22 },
  { week: "W-1", rate: 27 },
  { week: "This week", rate: 31 },
];

/* ------------------------- Derived recent activity ------------------------ */
// Normalized feed merged from leads, calls, and knowledge uploads.
export const recentActivity: ActivityItem[] = [
  {
    id: "act_1",
    type: "lead",
    title: "New lead: Amelia Hart",
    description: "Scored 88 · assigned to Front Desk Concierge",
    createdAt: "2026-06-23T08:12:00Z",
  },
  {
    id: "act_2",
    type: "call",
    title: "Call completed · 3m 34s",
    description: "Booked a consultation for next Tuesday",
    createdAt: "2026-06-23T08:12:00Z",
  },
  {
    id: "act_3",
    type: "lead",
    title: "New lead: Diego Romero",
    description: "Scored 95 · qualified and booked",
    createdAt: "2026-06-23T07:40:00Z",
  },
  {
    id: "act_4",
    type: "call",
    title: "Call completed · 5m 08s",
    description: "Viewing scheduled for the Oakwood listing",
    createdAt: "2026-06-23T07:40:00Z",
  },
  {
    id: "act_5",
    type: "upload",
    title: "Knowledge uploaded",
    description: "neighborhood-listings.docx · processing",
    createdAt: "2026-06-22T16:40:00Z",
  },
  {
    id: "act_6",
    type: "lead",
    title: "New lead: Marcus Webb",
    description: "Scored 40 · assigned to Spa Booking Agent",
    createdAt: "2026-06-22T15:22:00Z",
  },
];
