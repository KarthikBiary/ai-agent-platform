"use client";

import * as React from "react";
import { Edit2, FileText, Globe, File, Calendar, Clock, Tag, User, Circle } from "lucide-react";

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
import type { KnowledgeSource, KnowledgeSourceStatus } from "@/types";

interface KnowledgeDetailSheetProps {
  source: KnowledgeSource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (source: KnowledgeSource) => void;
}

const typeIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  docx: File,
  url: Globe,
};

const statusVariants: Record<KnowledgeSourceStatus, "default" | "secondary" | "outline"> = {
  ready: "default",
  processing: "secondary",
};

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

export function KnowledgeDetailSheet({
  source,
  open,
  onOpenChange,
  onEdit,
}: KnowledgeDetailSheetProps) {
  if (!source) return null;

  const TypeIcon = typeIcons[source.sourceType] ?? File;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-6 border-b">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <TypeIcon className="size-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-lg truncate">{source.name}</SheetTitle>
              <SheetDescription>Knowledge source details</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="py-6 space-y-6">
          <DetailRow icon={Tag} label="Source type">
            <div className="flex items-center gap-2">
              <TypeIcon className="size-4 text-muted-foreground" />
              <span className="font-medium">{source.sourceType.toUpperCase()}</span>
            </div>
          </DetailRow>

          <DetailRow icon={File} label="File name">
            <span className="break-all">{source.fileName}</span>
          </DetailRow>

          <DetailRow icon={Circle} label="Status">
            <Badge variant={statusVariants[source.status]}>{source.status}</Badge>
          </DetailRow>

          <DetailRow icon={User} label="Linked agent">
            <span>{source.agentId}</span>
          </DetailRow>

          <DetailRow icon={Calendar} label="Created">
            <span>{new Date(source.createdAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
          </DetailRow>

          <DetailRow icon={Clock} label="Updated">
            <span>{new Date(source.createdAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
          </DetailRow>
        </div>

        <SheetFooter className="border-t pt-6">
          <Button
            variant="default"
            className="w-full"
            onClick={() => {
              onEdit(source);
              onOpenChange(false);
            }}
          >
            <Edit2 className="size-4 mr-2" />
            Edit source
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}