"use client";

import { usePathname } from "next/navigation";
import { DashboardShell } from "./dashboard-shell";
import { useRequireRole } from "@/hooks/use-require-role";
import { useAuthStore } from "@/store/auth-store";
import type { NavItem } from "@/lib/constants";
import { LiveFeatureUnavailable } from "@/components/shared/live-feature-unavailable";

interface RoleDashboardLayoutProps {
  role: "agent" | "landlord" | "admin";
  nav: NavItem[];
  subtitle?: string;
  children: React.ReactNode;
}

/** Wraps a role's pages in the dashboard shell, gated to that role and
 *  showing the signed-in account's identity. Title comes from the active nav item. */
export function RoleDashboardLayout({ role, nav, subtitle, children }: RoleDashboardLayoutProps) {
  const pathname = usePathname();
  const authorized = useRequireRole(role);
  const account = useAuthStore((s) => s.account);

  if (!authorized) {
    return (
      <div className="col center" style={{ minHeight: "100vh" }}>
        <div className="spinner" />
      </div>
    );
  }

  const active =
    [...nav].sort((a, b) => b.href.length - a.href.length).find(
      (n) => pathname === n.href || pathname.startsWith(n.href + "/"),
    ) ?? nav[0];

  const resolved = {
    name: account?.name ?? role,
    photo: account?.photo,
    sub: account?.id ?? role,
  };

  const liveSupported = role === "agent"
    ? pathname === "/agent/dashboard" || pathname === "/agent/notifications" || pathname === "/agent/inspections" || pathname === "/agent/inspection-settings" || pathname === "/agent/landlord-authorizations" || pathname === "/agent/profile" || pathname === "/agent/kyc" || pathname.startsWith("/agent/properties/") || pathname === "/agent/properties" || pathname === "/agent/earnings" || pathname === "/agent/commissions"
    : role === "landlord"
      ? pathname === "/landlord/dashboard" || pathname === "/landlord/notifications" || pathname === "/landlord/agents" || pathname === "/landlord/agent-matrix" || pathname === "/landlord/profile" || pathname === "/landlord/kyc" || pathname === "/landlord/properties" || pathname === "/landlord/properties/new" || pathname.startsWith("/landlord/properties/") || pathname === "/landlord/rent-ledger" || pathname === "/landlord/payouts" || pathname === "/landlord/disputes" || pathname === "/landlord/inspections"
      : pathname === "/admin/dashboard" || pathname === "/admin/notifications" || pathname === "/admin/users" || pathname === "/admin/settings" || pathname === "/admin/audit-logs" || pathname === "/admin/trust-scores" || pathname === "/admin/kyc" || pathname === "/admin/escrow" || pathname === "/admin/disputes" || pathname === "/admin/revenue" || pathname === "/admin/commissions" || pathname === "/admin/inspections" || pathname.startsWith("/admin/properties/") || pathname === "/admin/properties";

  return (
    <DashboardShell role={role} nav={nav} identity={resolved} title={active.label} subtitle={subtitle}>
      {liveSupported ? children : <LiveFeatureUnavailable feature={active.label} />}
    </DashboardShell>
  );
}
