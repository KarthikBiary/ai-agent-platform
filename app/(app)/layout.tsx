import { cookies } from "next/headers";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// Must match SIDEBAR_COOKIE_NAME in components/ui/sidebar.tsx.
const SIDEBAR_COOKIE_NAME = "sidebar_state";

/**
 * Shell layout for the authenticated app surface (route group `(app)`).
 *
 * Kept distinct from the root layout so Week-3 landing pages render WITHOUT
 * the sidebar. Server Component — it reads the sidebar cookie to set the
 * initial open/collapsed state without a client flash.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen =
    cookieStore.get(SIDEBAR_COOKIE_NAME)?.value !== "false";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
