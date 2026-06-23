import {
  LayoutDashboard,
  Bot,
  Users,
  PhoneCall,
  BookOpen,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

/**
 * Single source of truth for sidebar navigation.
 * Both the desktop sidebar and the mobile sheet render from this config,
 * so nav items are never duplicated (design.md: "Never duplicate components").
 */
export interface NavItem {
  /** Route href — must match an app route. */
  href: string;
  /** Label shown in the sidebar / mobile menu. */
  label: string;
  /** Short description used for tooltips when the sidebar is collapsed. */
  description: string;
  /** Lucide icon component. */
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Business overview & recent activity",
    icon: LayoutDashboard,
  },
  {
    href: "/agents",
    label: "Agents",
    description: "Create & manage AI agents",
    icon: Bot,
  },
  {
    href: "/leads",
    label: "Leads",
    description: "Qualify & track incoming leads",
    icon: Users,
  },
  {
    href: "/calls",
    label: "Calls",
    description: "Review call transcripts & summaries",
    icon: PhoneCall,
  },
  {
    href: "/knowledge",
    label: "Knowledge",
    description: "Manage agent knowledge sources",
    icon: BookOpen,
  },
  {
    href: "/analytics",
    label: "Analytics",
    description: "Measure business performance",
    icon: BarChart3,
  },
  {
    href: "/settings",
    label: "Settings",
    description: "Workspace & account preferences",
    icon: Settings,
  },
];
