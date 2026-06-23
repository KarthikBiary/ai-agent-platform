import {
  PhoneCall,
  Upload,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ActivityItem, ActivityType } from "@/types";

/* ---------------------------------------------------------------------------
 * Helpers
 * --------------------------------------------------------------------------- */

const ACTIVITY_META: Record<
  ActivityType,
  { icon: typeof Users; variant: "default" | "secondary" | "outline" }
> = {
  lead: { icon: Users, variant: "default" },
  call: { icon: PhoneCall, variant: "secondary" },
  upload: { icon: Upload, variant: "outline" },
};

function formatRelativeDate(iso: string): string {
  const diff = Date.now() - +new Date(iso);
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/* ---------------------------------------------------------------------------
 * Component
 * --------------------------------------------------------------------------- */

interface RecentActivityProps {
  items: ActivityItem[];
}

/**
 * Activity feed panel — shows the latest leads, calls, and uploads.
 * Server Component; receives pre-sorted, serializable data as props.
 */
export function RecentActivity({ items }: RecentActivityProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recent activity.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {items.map((item) => {
            const meta = ACTIVITY_META[item.type];
            const Icon = meta.icon;
            return (
              <li key={item.id} className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                  <Icon className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-tight">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatRelativeDate(item.createdAt)}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
