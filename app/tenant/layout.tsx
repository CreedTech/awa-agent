"use client";

import { TenantTopNav } from "@/components/layout/top-nav";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useRequireRole } from "@/hooks/use-require-role";

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  const authorized = useRequireRole("tenant");

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
      <main className="grow">{children}</main>
      <BottomNav />
    </div>
  );
}
