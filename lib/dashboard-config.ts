import type { LucideIcon } from "lucide-react";
import {
  Bot,
  BookOpen,
  Users,
  PhoneCall,
} from "lucide-react";

/* ---------------------------------------------------------------------------
 * Dashboard metrics configuration
 *
 * Adding a new metric (e.g. Bookings, Revenue) requires only:
 *   1. Add an entry to this array with a unique `key`.
 *   2. Add a `count*` accessor in `lib/data/*.ts`.
 *   3. Await it in the dashboard page and pass the value via `dataByKey`.
 *
 * The card renderer is fully generic — no UI changes needed.
 * --------------------------------------------------------------------------- */

export interface MetricConfig {
  /** Unique key matching the key in `dataByKey` passed to the card renderer. */
  key: string;
  /** Human-readable label rendered on the card. */
  label: string;
  /** Description shown under the value. */
  description: string;
  /** Lucide icon rendered in the card header. */
  icon: LucideIcon;
}

/**
 * Active dashboard metrics in display order.
 *
 * V1 scope shows 4 cards (agents, leads, calls, knowledge). Future metrics
 * (bookings, revenue, reviews, reservations) are commented below — uncomment
 * and wire their data accessor to activate them.
 */
export const dashboardMetrics: MetricConfig[] = [
  {
    key: "agents",
    label: "Total Agents",
    description: "Active & draft agents",
    icon: Bot,
  },
  {
    key: "leads",
    label: "Total Leads",
    description: "All tracked leads",
    icon: Users,
  },
  {
    key: "calls",
    label: "Total Calls",
    description: "Agent conversations",
    icon: PhoneCall,
  },
  {
    key: "knowledge",
    label: "Knowledge Sources",
    description: "Uploaded files & URLs",
    icon: BookOpen,
  },

  /* ── Future metrics (uncomment when data accessors are wired) ── */
  // {
  //   key: "bookings",
  //   label: "Bookings",
  //   description: "Appointments booked",
  //   icon: CalendarCheck,
  // },
  // {
  //   key: "revenue",
  //   label: "Revenue",
  //   description: "Generated this month",
  //   icon: DollarSign,
  // },
  // {
  //   key: "reviews",
  //   label: "Reviews",
  //   description: "Customer feedback",
  //   icon: Star,
  // },
  // {
  //   key: "reservations",
  //   label: "Reservations",
  //   description: "Upcoming reservations",
  //   icon: UtensilsCrossed,
  // },
];
