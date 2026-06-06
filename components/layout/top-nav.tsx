"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { Icon } from "@/components/ui/icon";
import { Avatar } from "@/components/shared/avatar";
import { NotificationBell } from "@/components/shared/notification-bell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PUBLIC_NAV, TENANT_NAV } from "@/lib/constants";
import { useAuthStore } from "@/store/auth-store";
import { TENANT_ME } from "@/lib/mock-data";

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

/** Public marketplace top nav (guest). */
export function PublicTopNav() {
  const pathname = usePathname();
  return (
    <header className="topnav">
      <div className="topnav-inner">
        <Link href="/" aria-label="AwaAgent home">
          <Logo />
        </Link>

        <nav className="topnav-links" style={{ margin: "0 auto" }}>
          {PUBLIC_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`navlink ${isActive(pathname, item.href) ? "is-active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="row gap-3" style={{ marginLeft: "auto" }}>
          <Link href="/auth/login" className="btn btn-quiet desktop-only">
            Log in
          </Link>
          <Link href="/auth/signup" className="btn btn-primary btn-sm">
            Get started
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger render={<button className="icon-btn mobile-only-inline" aria-label="Menu" />}>
              <Icon name="menu" size={22} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {PUBLIC_NAV.map((item) => (
                <DropdownMenuItem key={item.href} render={<Link href={item.href} />}>
                  <Icon name={item.icon as never} size={16} /> {item.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem render={<Link href="/auth/login" />}>
                <Icon name="user" size={16} /> Log in
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

/** Tenant app top nav (authenticated): icon links + search + bell + avatar. */
export function TenantTopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const account = useAuthStore((s) => s.account);
  const me = { name: account?.name ?? TENANT_ME.name, photo: account?.photo ?? TENANT_ME.photo };

  return (
    <header className="topnav">
      <div className="topnav-inner">
        <Link href="/tenant/dashboard" aria-label="AwaAgent home">
          <Logo />
        </Link>

        <nav className="topnav-links">
          {TENANT_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`navlink ${isActive(pathname, item.href) ? "is-active" : ""}`}
            >
              <Icon name={item.icon as never} size={17} />
              {item.label}
            </Link>
          ))}
        </nav>

        <form
          className="search desktop-only"
          style={{ marginLeft: "auto" }}
          onSubmit={(e) => {
            e.preventDefault();
            const q = new FormData(e.currentTarget).get("q");
            router.push(`/explore${q ? `?q=${encodeURIComponent(String(q))}` : ""}`);
          }}
        >
          <Icon name="search" size={17} />
          <input name="q" placeholder="Search Bodija, Akobo, flats..." aria-label="Search properties" />
        </form>

        <div className="row gap-2" style={{ marginLeft: "auto" }}>
          <NotificationBell />
          <DropdownMenu>
            <DropdownMenuTrigger render={<button aria-label="Account menu" />}>
              <Avatar name={me.name} photo={me.photo} size={36} gold />
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
                <Icon name="logout" size={16} /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
