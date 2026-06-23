import { countAgents } from "@/lib/data/agents";
import { countCalls, getCallsSeries, getConversionSeries } from "@/lib/data/calls";
import { getRecentActivity } from "@/lib/data/activity";
import { countKnowledgeSources } from "@/lib/data/knowledge";
import { countLeads, getLeadsSeries } from "@/lib/data/leads";
import { dashboardMetrics } from "@/lib/dashboard-config";
import { StatCards } from "@/components/dashboard/stat-cards";
import { LeadsCallsChart } from "@/components/dashboard/leads-calls-chart";
import { ConversionChart } from "@/components/dashboard/conversion-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";

/**
 * Dashboard page — async Server Component.
 *
 * All data fetching happens here on the server. The result is passed as plain,
 * serializable props to child components (cards, charts, activity feed). No
 * client-side fetching. Adding a new metric requires:
 *   1. An entry in `lib/dashboard-config.ts`
 *   2. A `count*` function in `lib/data/*.ts`
 *   3. An additional `await` here + a key in `dataByKey`
 */
export default async function DashboardPage() {
  // Fetch all data in parallel for maximum server-side throughput.
  const [
    agentCount,
    leadCount,
    callCount,
    knowledgeCount,
    leadsSeries,
    callsSeries,
    conversionData,
    activity,
  ] = await Promise.all([
    countAgents(),
    countLeads(),
    countCalls(),
    countKnowledgeSources(),
    getLeadsSeries(30),
    getCallsSeries(30),
    getConversionSeries(),
    getRecentActivity(6),
  ]);

  // Config-driven data lookup — the card renderer reads from this map.
  const dataByKey: Record<string, number> = {
    agents: agentCount,
    leads: leadCount,
    calls: callCount,
    knowledge: knowledgeCount,

    // Future metrics plug in here:
    // bookings: bookingCount,
    // revenue: revenueAmount,
    // reviews: reviewCount,
    // reservations: reservationCount,
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Your workspace at a glance.
        </p>
      </div>

      {/* Metric cards (config-driven) */}
      <StatCards metrics={dashboardMetrics} dataByKey={dataByKey} />

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <LeadsCallsChart leads={leadsSeries} calls={callsSeries} />
        <ConversionChart data={conversionData} />
      </div>

      {/* Recent activity */}
      <RecentActivity items={activity} />
    </div>
  );
}
