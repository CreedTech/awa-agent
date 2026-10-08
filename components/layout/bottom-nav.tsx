"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { TENANT_NAV } from "@/lib/constants";

/** Mobile tab bar for the tenant app (hidden ≥1000px via CSS). */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottomnav" aria-label="Primary">
      {TENANT_NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} className={`tabitem ${active ? "is-active" : ""}`}>
            <span style={{ position: "relative" }}>
              <Icon name={item.icon as never} size={22} />
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
