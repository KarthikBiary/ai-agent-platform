"use client";

import * as React from "react";
import { Phone, Search } from "lucide-react";

export function CallsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <Phone className="size-8 text-muted-foreground" />
      </div>
      <h3 className="mt-6 text-xl font-semibold">No calls found</h3>
      <p className="mt-2 max-w-sm text-muted-foreground">
        There are no call records matching your criteria.
      </p>
    </div>
  );
}

export function CallsFilteredEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <Search className="size-8 text-muted-foreground" />
      </div>
      <h3 className="mt-6 text-xl font-semibold">No matching calls</h3>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Try adjusting your search or filters to find what you are looking for.
      </p>
    </div>
  );
}