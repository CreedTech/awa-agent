"use client";

import { RoleDashboardLayout } from "@/components/layout/role-dashboard-layout";
import { LANDLORD_NAV } from "@/lib/constants";

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleDashboardLayout
      role="landlord"
      nav={LANDLORD_NAV}
    >
      {children}
    </RoleDashboardLayout>
  );
}
