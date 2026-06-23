import "server-only";

import { calls, callsSeries30, conversionSeriesWeekly } from "@/lib/data/seed";
import type { Call, SeriesPoint } from "@/types";

export async function listCalls(): Promise<Call[]> {
  return [...calls].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
}

export async function countCalls(): Promise<number> {
  return calls.length;
}

/** Daily call counts for the last `days` days. */
export async function getCallsSeries(days: number = 30): Promise<SeriesPoint[]> {
  return callsSeries30.slice(-days);
}

/** Weekly conversion rate (percentage). */
export async function getConversionSeries(): Promise<
  { week: string; rate: number }[]
> {
  return [...conversionSeriesWeekly];
}
