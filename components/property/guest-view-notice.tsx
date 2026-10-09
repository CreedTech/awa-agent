"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { useInspectionPrice } from "@/hooks/use-inspection-price";
import { useAuthStore } from "@/store/auth-store";
import { formatCurrency } from "@/lib/utils";

export function GuestViewNotice() {
  const price = useInspectionPrice();
  const isTenant = useAuthStore((s) => s.isAuthenticated && s.role === "tenant");
  const access = price.data ? ` (${formatCurrency(price.data.priceNaira)} for ${price.data.durationDays} days)` : "";
  return (
    <div className="aw-guest-note">
      <Icon name="lock" size={18} />
      <p>You&apos;re seeing the newest homes only. Inspection access{access} unlocks every listing and lets you book visits.</p>
      <Link href={isTenant ? "/tenant/subscription" : "/auth/signup?role=tenant"} className="aw-btn aw-btn-ink aw-btn-sm">
        {isTenant ? "Get inspection access" : "Create a tenant account"}
      </Link>
    </div>
  );
}
