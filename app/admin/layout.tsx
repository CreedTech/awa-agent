"use client";

import { RoleDashboardLayout } from "@/components/layout/role-dashboard-layout";
import { ADMIN_NAV } from "@/lib/constants";
import { ADMIN_ME } from "@/lib/mock-data";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleDashboardLayout
      role="admin"
      nav={ADMIN_NAV}
      identity={{ name: ADMIN_ME.name, sub: ADMIN_ME.adminRole }}
    >
      {children}
    </RoleDashboardLayout>
  );
}
