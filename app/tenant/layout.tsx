"use client";

import { TenantTopNav } from "@/components/layout/top-nav";
import { BottomNav } from "@/components/layout/bottom-nav";
import { RoleSwitcher } from "@/components/layout/role-switcher";

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <TenantTopNav />
      <main className="grow">{children}</main>
      <BottomNav />
      <RoleSwitcher />
    </div>
  );
}
