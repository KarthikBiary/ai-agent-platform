"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Client-boundary wrapper around next-themes.
 *
 * React context is not available in Server Components, so this provider must
 * be a Client Component (see Next.js docs: server-and-client-components →
 * Context providers). It is rendered as close to the leaf as practical —
 * wrapping only {children} inside the root layout, not the <html> document.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
