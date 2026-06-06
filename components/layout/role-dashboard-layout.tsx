"use client";

import { usePathname } from "next/navigation";
import { DashboardShell } from "./dashboard-shell";
import type { NavItem } from "@/lib/constants";

interface RoleDashboardLayoutProps {
  role: "agent" | "landlord" | "admin";
  nav: NavItem[];
  identity: { name: string; sub: string; photo?: string };
  subtitle?: string;
  children: React.ReactNode;
}

/** Wraps a role's pages in the dashboard shell, deriving the page title
 *  from the active nav item so individual pages stay focused on content. */
export function RoleDashboardLayout({ role, nav, identity, subtitle, children }: RoleDashboardLayoutProps) {
  const pathname = usePathname();
  const active =
    [...nav].sort((a, b) => b.href.length - a.href.length).find(
      (n) => pathname === n.href || pathname.startsWith(n.href + "/"),
    ) ?? nav[0];

  return (
    <DashboardShell role={role} nav={nav} identity={identity} title={active.label} subtitle={subtitle}>
      {children}
    </DashboardShell>
  );
}
