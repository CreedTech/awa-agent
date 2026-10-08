"use client";

import { RoleDashboardLayout } from "@/components/layout/role-dashboard-layout";
import { ADMIN_NAV } from "@/lib/constants";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleDashboardLayout
      role="admin"
      nav={ADMIN_NAV}
    >
      {children}
    </RoleDashboardLayout>
  );
}
