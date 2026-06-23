"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SeriesPoint } from "@/types";

interface LeadsCallsChartProps {
  leads: SeriesPoint[];
  calls: SeriesPoint[];
}

export function LeadsCallsChart({ leads, calls }: LeadsCallsChartProps) {
  const merged = leads.map((l) => {
    const c = calls.find((c) => c.date === l.date);
    return { date: l.date, leads: l.value, calls: c?.value ?? 0 };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads & Calls — Last 30 Days</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={merged} aria-label="Leads and calls over the last 30 days" role="img">
            <title>Dual-area chart showing daily leads and calls count over 30 days</title>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-muted-foreground"
              tickFormatter={(v: string) => {
                const d = new Date(v + "T00:00:00");
                return d.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis tickLine={false} axisLine={false} className="text-muted-foreground" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
                color: "hsl(var(--popover-foreground))",
              }}
              labelFormatter={(v) =>
                new Date(String(v) + "T00:00:00").toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <Area
              type="monotone"
              dataKey="leads"
              stackId="a"
              stroke="var(--chart-1)"
              fill="var(--chart-1)"
              fillOpacity={0.2}
              name="Leads"
            />
            <Area
              type="monotone"
              dataKey="calls"
              stackId="a"
              stroke="var(--chart-2)"
              fill="var(--chart-2)"
              fillOpacity={0.2}
              name="Calls"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}