/**
 * Domain model for the AI Agent Platform.
 *
 * Mirrors the database schema defined in design.md (agents, leads,
 * knowledge_sources, calls). These types are shared across the data layer
 * (`lib/data/*`) and all UI components, so a record's shape is defined once
 * and flows everywhere type-safely.
 */

/* ---------------------------------- Enums --------------------------------- */

export type Industry =
  | "healthcare"
  | "real_estate"
  | "restaurant"
  | "spa"
  | "convention_hall"
  | "hospitality";

export type Voice =
  | "alloy"
  | "nova"
  | "shimmer"
  | "echo"
  | "onyx";

export type AgentStatus = "active" | "draft" | "paused";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "booked"
  | "lost";

export type KnowledgeSourceType = "pdf" | "docx" | "url";

export type KnowledgeSourceStatus = "ready" | "processing";

export type ActivityType = "lead" | "call" | "upload";

/* --------------------------------- Records -------------------------------- */

/** `agents` table. */
export interface Agent {
  id: string;
  name: string;
  industry: Industry;
  prompt: string;
  voice: Voice;
  status: AgentStatus;
  createdAt: string; // ISO 8601
}

/** Form data for creating/editing an agent (excludes server-generated fields). */
export interface AgentFormData {
  name: string;
  industry: Industry;
  prompt: string;
  voice: Voice;
  status: AgentStatus;
}

/** `leads` table. */
export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: LeadStatus;
  score: number; // 0–100
  agentId: string;
  createdAt: string; // ISO 8601
}

/** `knowledge_sources` table. */
export interface KnowledgeSource {
  id: string;
  agentId: string;
  name: string;
  fileName: string;
  sourceType: KnowledgeSourceType;
  status: KnowledgeSourceStatus;
  createdAt: string; // ISO 8601
}

/** Form data for creating/editing a knowledge source (excludes server-generated fields). */
export interface KnowledgeSourceFormData {
  name: string;
  sourceType: KnowledgeSourceType;
  agentId: string;
  url?: string;
  file?: File;
  status: "processing" | "ready";
}

/** `calls` table. */
export interface Call {
  id: string;
  agentId: string;
  leadId: string;
  durationSec: number;
  recordingUrl: string | null;
  transcript: string | null;
  summary: string | null;
  createdAt: string; // ISO 8601
}

/* --------------------------- Dashboard primitives ------------------------- */

/** A single point in a time-series chart. */
export interface SeriesPoint {
  /** ISO date (YYYY-MM-DD) used as the x-axis key. */
  date: string;
  value: number;
}

/** A normalized entry in the recent-activity feed (merged from many sources). */
export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  /** ISO 8601 timestamp; the feed is sorted descending by this. */
  createdAt: string;
}
