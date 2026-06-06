"use client";

import { RoleDashboardLayout } from "@/components/layout/role-dashboard-layout";
import { LANDLORD_NAV } from "@/lib/constants";
import { LANDLORD_ME } from "@/lib/mock-data";

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleDashboardLayout
      role="landlord"
      nav={LANDLORD_NAV}
      identity={{ name: LANDLORD_ME.name, sub: `${LANDLORD_ME.id} · Landlord`, photo: LANDLORD_ME.photo }}
    >
      {children}
    </RoleDashboardLayout>
  );
}
