"use client";

import { TenantTopNav } from "@/components/layout/top-nav";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useRequireRole } from "@/hooks/use-require-role";
import { usePathname } from "next/navigation";
import { LiveFeatureUnavailable } from "@/components/shared/live-feature-unavailable";

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  const authorized = useRequireRole("tenant");
  const pathname = usePathname();

  if (!authorized) {
    return (
      <div className="col center" style={{ minHeight: "100vh" }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="app">
      <TenantTopNav />
      <main className="grow">{pathname === "/tenant/dashboard" || pathname === "/tenant/loyalty" || pathname === "/tenant/notifications" || pathname === "/tenant/inspections" || pathname.startsWith("/tenant/inspections/") || pathname === "/tenant/escrow" || pathname.startsWith("/tenant/escrow/") || pathname === "/tenant/subscription" || pathname === "/tenant/saved" || pathname === "/tenant/profile" || pathname === "/tenant/kyc" || pathname === "/tenant/disputes" || pathname === "/tenant/receipts"
        ? children
        : <LiveFeatureUnavailable feature="This dashboard" />}</main>
      <BottomNav />
    </div>
  );
}
