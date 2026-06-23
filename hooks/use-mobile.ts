import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * `useSyncExternalStore` plumbing. The `subscribe` callback receives a
 * `notify` function and must call it whenever the external value (viewport
 * width) changes; React then re-reads `getSnapshot`. This replaces the old
 * effect+setState pattern that react-hooks/set-state-in-effect flags.
 */
function subscribe(notify: () => void) {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
  mql.addEventListener("change", notify);
  return () => mql.removeEventListener("change", notify);
}

function getSnapshot() {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

function getServerSnapshot() {
  // Assume desktop during SSR to avoid a hydration mismatch.
  return false;
}

/**
 * Returns `true` when the viewport is below the mobile breakpoint.
 */
export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
}
