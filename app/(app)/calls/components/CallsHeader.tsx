"use client";

import * as React from "react";
import { Phone } from "lucide-react";

export function CallsHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Phone className="size-6 text-primary" />
          Calls
        </h1>
        <p className="text-sm text-muted-foreground">
          View and manage call history across all agents.
        </p>
      </div>
    </div>
  );
}