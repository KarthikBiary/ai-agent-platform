"use client";

import * as React from "react";
import { Edit2, User, Phone, Mail, Tag, TrendingUp, Globe, Calendar, Activity } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Lead, LeadStatus, Agent, ActivityItem } from "@/types";
import { getLeadActivity } from "@/lib/data/leads";

const statusVariants: Record<LeadStatus, "default" | "secondary" | "outline" | "destructive"> = {
  new: "outline",
  contacted: "secondary",
  qualified: "default",
  proposal_sent: "secondary",
  won: "default",
  lost: "destructive",
};

function scoreLabel(score: number): string {
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

function scoreVariant(score: number): "default" | "secondary" | "outline" | "destructive" {
  if (score >= 70) return "default";
  if (score >= 40) return "secondary";
  return "outline";
}

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-8 items-center justify-center rounded-full bg-muted shrink-0">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  );
}

interface LeadDetailSheetProps {
  lead: Lead | null;
  agents: Agent[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (lead: Lead) => void;
}

export function LeadDetailSheet({
  lead,
  agents,
  open,
  onOpenChange,
  onEdit,
}: LeadDetailSheetProps) {
  const [activity, setActivity] = React.useState<ActivityItem[]>([]);

  React.useEffect(() => {
    if (!lead || !open) return;
    let cancelled = false;
    getLeadActivity(lead.id).then((items) => {
      if (!cancelled) setActivity(items);
    });
    return () => { cancelled = true; };
  }, [lead, open]);

  if (!lead) return null;

  const agent = agents.find((a) => a.id === lead.agentId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-6 border-b">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <User className="size-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-lg truncate">{lead.name}</SheetTitle>
              <SheetDescription>Lead details and activity</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="py-6 space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <User className="size-4" />
              Lead Information
            </h4>
            <div className="space-y-4">
              <DetailRow icon={Mail} label="Email">
                <span className="break-all">{lead.email}</span>
              </DetailRow>
              <DetailRow icon={Phone} label="Phone">
                <span>{lead.phone}</span>
              </DetailRow>
              <DetailRow icon={Tag} label="Status">
                <Badge variant={statusVariants[lead.status]}>{lead.status.replace("_", " ")}</Badge>
              </DetailRow>
              <DetailRow icon={TrendingUp} label="Score">
                <div className="flex items-center gap-2">
                  <Badge variant={scoreVariant(lead.score)}>{lead.score}</Badge>
                  <span className="text-sm text-muted-foreground">{scoreLabel(lead.score)}</span>
                </div>
              </DetailRow>
              <DetailRow icon={Globe} label="Source">
                <span>{lead.leadSource.replace("_", " ")}</span>
              </DetailRow>
              <DetailRow icon={Calendar} label="Created">
                <span>{new Date(lead.createdAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
              </DetailRow>
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <User className="size-4" />
              Assigned Agent
            </h4>
            {agent ? (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="size-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{agent.name}</p>
                  <p className="text-sm text-muted-foreground">{agent.industry.replace("_", " ")}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No agent assigned</p>
            )}
          </div>

          <div className="border-t pt-6">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <Activity className="size-4" />
              Activity Timeline
            </h4>
            {activity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity recorded.</p>
            ) : (
              <div className="space-y-0">
                {activity.map((item, idx) => (
                  <div key={item.id} className="relative pl-6 pb-4 last:pb-0">
                    {idx < activity.length - 1 && (
                      <div className="absolute left-2.5 top-3 bottom-0 w-px bg-border" />
                    )}
                    <div className="absolute left-0 top-1.5 size-5 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                      <div className="size-2 rounded-full bg-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <SheetFooter className="border-t pt-6">
          <Button
            variant="default"
            className="w-full"
            onClick={() => {
              onEdit(lead);
              onOpenChange(false);
            }}
          >
            <Edit2 className="size-4 mr-2" />
            Edit lead
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}