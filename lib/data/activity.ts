import "server-only";

import { recentActivity } from "@/lib/data/seed";
import type { ActivityItem } from "@/types";

/**
 * Returns the `limit` most recent activity items, sorted by date descending.
 * Data is merged from leads, calls, and knowledge uploads in the seed layer;
 * this accessor just slices the pre-merged feed.
 */
export async function getRecentActivity(
  limit: number = 6,
): Promise<ActivityItem[]> {
  return [...recentActivity]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, limit);
}
