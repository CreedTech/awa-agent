"use client";

import { useEffect, useState } from "react";
import { PublicTopNav, TenantTopNav } from "./top-nav";
import { BottomNav } from "./bottom-nav";
import { RoleSwitcher } from "./role-switcher";
import { useAuthStore } from "@/store/auth-store";

/**
 * Frame for public + tenant pages. Shows the public marketplace nav for
 * guests and the tenant app nav (+ mobile bottom tabs) once signed in as a
 * tenant. Resolved after mount to avoid hydration mismatch from persisted state.
 */
export function AppFrame({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const role = useAuthStore((s) => s.role);
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  useEffect(() => setMounted(true), []);

  const isTenant = mounted && isAuthed && role === "tenant";

  return (
    <div className="app">
      {isTenant ? <TenantTopNav /> : <PublicTopNav />}
      <main className="grow">{children}</main>
      {isTenant && <BottomNav />}
      <RoleSwitcher />
    </div>
  );
}
