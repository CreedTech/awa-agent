"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { Icon } from "@/components/ui/icon";
import { Avatar } from "@/components/shared/avatar";
import { MobileMenu } from "@/components/layout/mobile-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PUBLIC_NAV, TENANT_NAV } from "@/lib/constants";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

export function PublicTopNav() {
  const pathname = usePathname();
  return (
    <header className="aw-header">
      <div className="aw-header-inner aw-wrap">
        <Link href="/" aria-label="AwaAgent home" className="aw-header-logo">
          <Logo size={28} />
        </Link>
        <nav className="aw-header-links" aria-label="Main">
          {PUBLIC_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn("aw-header-link", isActive(pathname, item.href) && "is-active")}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="aw-header-actions">
          <Link href="/#partners" className="aw-header-link aw-header-partner">List a property</Link>
          <Link href="/auth/login" className="aw-btn aw-btn-ink aw-btn-sm">Sign in</Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

export function TenantTopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const account = useAuthStore((s) => s.account);
  const name = account?.name ?? "Tenant";

  return (
    <header className="aw-header">
      <div className="aw-header-inner aw-wrap">
        <Link href="/tenant/dashboard" aria-label="AwaAgent dashboard" className="aw-header-logo">
          <Logo size={28} />
        </Link>
        <nav className="aw-header-links" aria-label="Main">
          {TENANT_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn("aw-header-link", isActive(pathname, item.href) && "is-active")}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="aw-header-actions">
          <Link className="aw-icon-btn" href="/tenant/notifications" aria-label="Notifications">
            <Icon name="bell" size={19} />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger render={<button className="aw-avatar-btn" aria-label="Account menu" />}>
              <Avatar name={name} photo={account?.photo} size={34} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem render={<Link href="/tenant/dashboard" />}>
                <Icon name="grid" size={16} /> Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/tenant/profile" />}>
                <Icon name="user" size={16} /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              >
                <Icon name="logout" size={16} /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
