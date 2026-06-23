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

interface ConversionChartProps {
  data: { week: string; rate: number }[];
}

export function ConversionChart({ data }: ConversionChartProps) {
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
            <Bar dataKey="rate" fill="var(--chart-3)" radius={[4, 4, 0, 0]} name="Conversion" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}