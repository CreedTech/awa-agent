"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { useAppStore } from "@/store/app-store";
import { TENANT_NAV } from "@/lib/constants";

/** Mobile tab bar for the tenant app (hidden ≥1000px via CSS). */
export function BottomNav() {
  const pathname = usePathname();
  const lockedFunds = useAppStore((s) =>
    s.escrow.some((e) => e.tenantName === "Bisi Akande" && e.status === "FUNDS_LOCKED"),
  );

  return (
    <nav className="bottomnav" aria-label="Primary">
      {TENANT_NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href);
        const showDot = item.href === "/tenant/escrow" && lockedFunds;
        return (
          <Link key={item.href} href={item.href} className={`tabitem ${active ? "is-active" : ""}`}>
            <span style={{ position: "relative" }}>
              <Icon name={item.icon as never} size={22} />
              {showDot && (
                <span
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -4,
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "var(--gold-500)",
                  }}
                />
              )}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
