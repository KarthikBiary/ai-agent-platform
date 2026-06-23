"use client";

import {
  Bar,
  BarChart,
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
import { useChartColors } from "@/lib/use-chart-colors";

interface ConversionChartProps {
  /** Weekly conversion data (week label, rate as percentage). */
  data: { week: string; rate: number }[];
}

/**
 * Bar chart showing weekly conversion rate (%).
 * Client Component because Recharts uses React state for SVG rendering.
 */
export function ConversionChart({ data }: ConversionChartProps) {
  const colors = useChartColors();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Conversions</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} aria-label="Weekly conversion rates" role="img">
            <title>Bar chart showing weekly conversion rate percentage over the last 4 weeks</title>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-muted-foreground"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              className="text-muted-foreground"
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
                color: "hsl(var(--popover-foreground))",
              }}
              formatter={(value) => [`${value}%`, "Conversion"]}
            />
            <Bar dataKey="rate" fill={colors[2]} radius={[4, 4, 0, 0]} name="Conversion" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
