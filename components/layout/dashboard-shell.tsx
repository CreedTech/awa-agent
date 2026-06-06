"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { Avatar } from "@/components/shared/avatar";
import { Icon } from "@/components/ui/icon";
import { NotificationBell } from "@/components/shared/notification-bell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/store/app-store";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "@/store/auth-store";
import type { NavItem } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  role: "agent" | "landlord" | "admin";
  nav: NavItem[];
  identity: { name: string; sub: string; photo?: string };
  title: string;
  subtitle?: string;
  /** Optional topbar actions (buttons, etc.). */
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function DashboardShell({ role, nav, identity, title, subtitle, actions, children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const isAdmin = role === "admin";

  // Live badge counters sourced from the store. `useShallow` keeps the
  // returned object stable (shallow-compared) so this doesn't re-render
  // every snapshot - the values are plain numbers.
  const badges = useAppStore(
    useShallow((s) => ({
      requests: s.agentRequests.filter((r) => r.status === "PENDING").length,
      kyc: s.kycQueue.filter((k) => k.status === "PENDING").length,
      props: s.propQueue.filter((p) => p.status === "PENDING").length,
      disputes: s.disputes.filter((d) => d.status !== "RESOLVED").length,
    })),
  );

  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const NavLinks = () =>
    nav.map((item) => {
      const count = item.badgeKey ? badges[item.badgeKey as keyof typeof badges] : 0;
      return (
        <Link
          key={item.href}
          href={item.href}
          className={cn("dash-navitem", isAdmin && "is-admin", active(item.href) && "is-active")}
        >
          <Icon name={item.icon as never} size={18} />
          <span className="desktop-label">{item.label}</span>
          {count > 0 && (
            <span
              className="desktop-label"
              style={{
                marginLeft: "auto",
                fontSize: 11,
                fontWeight: 700,
                padding: "1px 7px",
                borderRadius: 999,
                background: isAdmin ? "var(--danger)" : "var(--gold-500)",
                color: isAdmin ? "#fff" : "var(--navy-900)",
              }}
            >
              {count}
            </span>
          )}
        </Link>
      );
    });

  return (
    <div className="dash-shell">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div style={{ padding: "18px 16px 8px" }}>
          <Logo light />
          {isAdmin && (
            <span
              className="sidebar-identity"
              style={{ display: "inline-block", marginTop: 10, fontSize: 10.5, fontWeight: 800, letterSpacing: ".08em", color: "#fff", background: "var(--danger)", padding: "3px 8px", borderRadius: 6 }}
            >
              ADMIN CONSOLE
            </span>
          )}
          <div className="sidebar-identity row gap-3" style={{ marginTop: 16, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,.08)" }}>
            <Avatar name={identity.name} photo={identity.photo} size={36} gold={!isAdmin} />
            <div className="col">
              <strong style={{ color: "#fff", fontSize: 14 }}>{identity.name}</strong>
              <span style={{ color: "rgba(255,255,255,.5)", fontSize: 12 }}>{identity.sub}</span>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, paddingTop: 6 }}>
          <NavLinks />
        </nav>

        <div className="sidebar-identity" style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
          <div className="row gap-2" style={{ color: "rgba(255,255,255,.55)", fontSize: 12.5 }}>
            <Icon name="shieldCheck" size={15} color="var(--gold-400)" />
            NIN verified
          </div>
        </div>
      </aside>

      {/* Topbar */}
      <header className="dash-topbar">
        <div className="col" style={{ gap: 0 }}>
          <h1 style={{ fontSize: 18, fontWeight: 800 }}>{title}</h1>
          {subtitle && <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{subtitle}</span>}
        </div>
        <div className="row gap-3" style={{ marginLeft: "auto" }}>
          {actions}
          {isAdmin && (
            <span className="tag tag-danger" style={{ alignSelf: "center" }}>
              Admin only
            </span>
          )}
          <NotificationBell />
          <DropdownMenu>
            <DropdownMenuTrigger render={<button aria-label="Account menu" />}>
              <Avatar name={identity.name} photo={identity.photo} size={34} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              >
                <Icon name="logout" size={16} /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Content */}
      <div className="dash-content scroll">{children}</div>

      {/* Mobile bottom nav */}
      <nav className="dash-mobile-nav" aria-label="Primary">
        {nav.slice(0, 5).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn("tabitem", active(item.href) && "is-active")}
            style={{ display: "flex" }}
          >
            <Icon name={item.icon as never} size={20} />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
