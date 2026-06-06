"use client";

import { RoleDashboardLayout } from "@/components/layout/role-dashboard-layout";
import { AGENT_NAV } from "@/lib/constants";
import { AGENT_ME } from "@/lib/mock-data";

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleDashboardLayout
      role="agent"
      nav={AGENT_NAV}
      identity={{ name: AGENT_ME.name, sub: `${AGENT_ME.id} · ${AGENT_ME.tier}`, photo: AGENT_ME.photo }}
    >
      {children}
    </RoleDashboardLayout>
  );
}
