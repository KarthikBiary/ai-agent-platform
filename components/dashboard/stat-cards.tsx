import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MetricConfig } from "@/lib/dashboard-config";

/* ---------------------------------------------------------------------------
 * Props
 * --------------------------------------------------------------------------- */

interface MetricCardProps {
  label: string;
  description: string;
  value: number;
  icon: LucideIcon;
}

interface StatCardsProps {
  /** Metric definitions (order, labels, icons). */
  metrics: MetricConfig[];
  /** Look-up map: metric key → resolved value. Missing keys render "–". */
  dataByKey: Record<string, number>;
}

/* ---------------------------------------------------------------------------
 * Individual card (Server Component — no interactivity).
 * --------------------------------------------------------------------------- */

function MetricCard({ label, description, value, icon: Icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

/* ---------------------------------------------------------------------------
 * Card grid — reads config, never hardcodes metric names.
 * --------------------------------------------------------------------------- */

export function StatCards({ metrics, dataByKey }: StatCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m) => (
        <MetricCard
          key={m.key}
          label={m.label}
          description={m.description}
          value={dataByKey[m.key] ?? 0}
          icon={m.icon}
        />
      ))}
    </div>
  );
}
