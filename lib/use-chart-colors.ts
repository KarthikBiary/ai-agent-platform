"use client";

import { useSyncExternalStore } from "react";

const FALLBACK = [
  "oklch(0.646 0.222 41.116)",
  "oklch(0.6 0.118 184.704)",
  "oklch(0.398 0.07 227.392)",
  "oklch(0.828 0.189 84.429)",
  "oklch(0.769 0.188 70.08)",
];

function subscribe(notify: () => void) {
  // Theme changes via next-themes swap the `class` on <html>. A MutationObserver
  // is the reliable way to detect CSS variable changes.
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function getSnapshot(): string[] {
  const style = getComputedStyle(document.documentElement);
  const next = Array.from({ length: 5 }, (_, i) =>
    style.getPropertyValue(`--chart-${i + 1}`).trim(),
  );
  return next.every((v) => v.length > 0) ? next : FALLBACK;
}

function getServerSnapshot(): string[] {
  return FALLBACK;
}

/**
 * Reads the themed `--chart-N` CSS variables so Recharts uses the same tokens
 * the design system uses. Re-renders on theme changes (light ↔ dark) via
 * MutationObserver — no effect+setState needed.
 */
export function useChartColors(): string[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
