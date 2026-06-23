"use client";

import * as React from "react";
import { Phone, User, Calendar, Clock, ArrowUpRight, ArrowDownLeft, FileText, MessageSquareText } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import type { Call, CallStatus, Agent, Lead } from "@/types";

const statusVariants: Record<CallStatus, "default" | "secondary" | "outline" | "destructive"> = {
  queued: "outline",
  ringing: "secondary",
  completed: "default",
  missed: "destructive",
  failed: "destructive",
};

const outcomeVariants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  interested: "default",
  follow_up: "secondary",
  not_interested: "destructive",
  booked_meeting: "default",
  voicemail: "outline",
  unknown: "outline",
};

function formatDuration(sec: number): string {
  if (sec <= 0) return "--";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
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

interface CallDetailSheetProps {
  call: Call | null;
  agents: Agent[];
  leads: Lead[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CallDetailSheet({
  call,
  agents,
  leads,
  open,
  onOpenChange,
}: CallDetailSheetProps) {
  if (!call) return null;

  const agent = agents.find((a) => a.id === call.agentId);
  const lead = leads.find((l) => l.id === call.leadId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-6 border-b">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Phone className="size-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-lg truncate">Call Details</SheetTitle>
              <SheetDescription>Call record summary</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Call Information */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <Phone className="size-4" />
              Call Information
            </h4>
            <div className="space-y-4">
              <DetailRow icon={User} label="Agent">
                <span className="font-medium">{agent?.name ?? call.agentId}</span>
              </DetailRow>
              <DetailRow icon={User} label="Lead">
                <span>{lead?.name ?? call.leadId}</span>
              </DetailRow>
              <DetailRow icon={ArrowUpRight} label="Direction">
                <div className="flex items-center gap-1.5">
                  {call.direction === "inbound" ? (
                    <ArrowDownLeft className="size-4 text-muted-foreground" />
                  ) : (
                    <ArrowUpRight className="size-4 text-muted-foreground" />
                  )}
                  <span className="capitalize">{call.direction}</span>
                </div>
              </DetailRow>
              <DetailRow icon={Calendar} label="Status">
                <Badge variant={statusVariants[call.status]}>{call.status}</Badge>
              </DetailRow>
              <DetailRow icon={Clock} label="Outcome">
                <Badge variant={outcomeVariants[call.outcome]}>{call.outcome.replace("_", " ")}</Badge>
              </DetailRow>
            </div>
          </div>

          {/* Summary */}
          <div className="border-t pt-6">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <FileText className="size-4" />
              Summary
            </h4>
            {call.summary ? (
              <p className="text-sm whitespace-pre-wrap">{call.summary}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">No summary available.</p>
            )}
          </div>

          {/* Transcript */}
          <div className="border-t pt-6">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <MessageSquareText className="size-4" />
              Transcript
            </h4>
            {call.transcript ? (
              <div className="rounded-lg bg-muted/50 p-4 max-h-80 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap font-sans">{call.transcript}</pre>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No transcript available.</p>
            )}
          </div>

          {/* Metadata */}
          <div className="border-t pt-6">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <Clock className="size-4" />
              Metadata
            </h4>
            <div className="space-y-4">
              <DetailRow icon={Calendar} label="Started">
                <span>{new Date(call.startedAt).toLocaleString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
              </DetailRow>
              <DetailRow icon={Calendar} label="Ended">
                <span>{new Date(call.endedAt).toLocaleString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
              </DetailRow>
              <DetailRow icon={Clock} label="Duration">
                <span className="font-mono">{formatDuration(call.durationSec)}</span>
              </DetailRow>
              <DetailRow icon={FileText} label="Call ID">
                <span className="text-sm font-mono text-muted-foreground">{call.id}</span>
              </DetailRow>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}