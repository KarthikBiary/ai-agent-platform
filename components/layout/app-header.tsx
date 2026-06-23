import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme/theme-toggle";

/**
 * Top bar shown inside the sidebar inset. Server Component — it composes
 * client primitives (<SidebarTrigger>, <ThemeToggle>) without itself needing
 * hooks, so it stays on the server.
 */
export function AppHeader() {
  return (
    <header className="flex h-14 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-4!" />
      <div className="flex-1" />
      <ThemeToggle />
    </header>
  );
}
