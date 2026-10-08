"use client";

import { RoleDashboardLayout } from "@/components/layout/role-dashboard-layout";
import { AGENT_NAV } from "@/lib/constants";

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleDashboardLayout
      role="agent"
      nav={AGENT_NAV}
    >
      {children}
    </RoleDashboardLayout>
  );
}
