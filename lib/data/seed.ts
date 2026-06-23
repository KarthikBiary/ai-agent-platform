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
    leadSource: "website",
    agentId: "agt_1",
    createdAt: "2026-06-23T08:12:00Z",
  },
  {
    id: "lead_2",
    name: "Diego Romero",
    phone: "+1 (305) 555-0144",
    email: "d.romero@example.com",
    status: "won",
    score: 95,
    leadSource: "google_ads",
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
    leadSource: "facebook_ads",
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
    leadSource: "referral",
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
    leadSource: "phone",
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
    direction: "inbound",
    status: "completed",
    outcome: "booked_meeting",
    recordingUrl: null,
    transcript:
      "Agent: Welcome to Smile Dental Clinic, how can I help you?\nCaller: Hi, I'm calling about your whitening packages.\nAgent: We offer several options. Our in-office Zoom whitening is $499 and includes take-home trays. Would you like to book a consultation?\nCaller: Yes, that sounds great.\nAgent: Great, I have availability next Tuesday at 10am or 2pm.\nCaller: 10am works.\nAgent: Perfect, you're all set for Tuesday at 10am with Dr. Chen.",
    summary:
      "Caller asked about whitening packages; booked a consultation for next Tuesday.",
    startedAt: "2026-06-23T08:08:00Z",
    endedAt: "2026-06-23T08:12:00Z",
  },
  {
    id: "call_2",
    agentId: "agt_2",
    leadId: "lead_2",
    durationSec: 308,
    direction: "inbound",
    status: "completed",
    outcome: "interested",
    recordingUrl: null,
    transcript:
      "Agent: Hello, this is Diego from Listings Qualifier. How can I help?\nCaller: Hi, I'm looking for a property in the Oakwood area.\nAgent: Great area. What's your budget range?\nCaller: Around $800k to $900k.\nAgent: We have several listings in that range. Are you pre-approved?\nCaller: Yes, we are.\nAgent: Excellent. I can schedule a viewing this weekend. Does Saturday work?\nCaller: Saturday at 11am would be perfect.\nAgent: I'll set that up. You'll receive a confirmation via email.",
    summary:
      "Qualified buyer, $850k budget; viewing scheduled for the Oakwood listing.",
    startedAt: "2026-06-23T07:35:00Z",
    endedAt: "2026-06-23T07:40:00Z",
  },
  {
    id: "call_3",
    agentId: "agt_4",
    leadId: "lead_4",
    durationSec: 142,
    direction: "outbound",
    status: "completed",
    outcome: "voicemail",
    recordingUrl: null,
    transcript: null,
    summary: "Guest requested a couples massage; sent booking link via SMS.",
    startedAt: "2026-06-22T15:19:00Z",
    endedAt: "2026-06-22T15:22:00Z",
  },
  {
    id: "call_4",
    agentId: "agt_1",
    leadId: "lead_3",
    durationSec: 45,
    direction: "outbound",
    status: "missed",
    outcome: "unknown",
    recordingUrl: null,
    transcript: null,
    summary: null,
    startedAt: "2026-06-22T10:00:00Z",
    endedAt: "2026-06-22T10:00:45Z",
  },
  {
    id: "call_5",
    agentId: "agt_3",
    leadId: "lead_2",
    durationSec: 0,
    direction: "inbound",
    status: "failed",
    outcome: "unknown",
    recordingUrl: null,
    transcript: null,
    summary: null,
    startedAt: "2026-06-21T18:30:00Z",
    endedAt: "2026-06-21T18:30:05Z",
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
 * Conversion series: share of leads that reached "won" per week over the
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
    description: "Scored 95 · qualified and won",
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
