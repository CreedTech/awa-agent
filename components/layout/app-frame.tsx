"use client";

import { PublicTopNav, TenantTopNav } from "./top-nav";
import { BottomNav } from "./bottom-nav";
import { useAuthStore } from "@/store/auth-store";

/**
 * Frame for public + tenant pages. Shows the public marketplace nav for
 * guests and the tenant app nav (+ mobile bottom tabs) once signed in as a
 * tenant. Resolved after mount to avoid hydration mismatch from persisted state.
 */
export function AppFrame({ children }: { children: React.ReactNode }) {
  const role = useAuthStore((s) => s.role);
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const hydrated = useAuthStore((s) => s.hydrated);

  const isTenant = hydrated && isAuthed && role === "tenant";

  return (
    <div className="app">
      {!hydrated ? <div className="topnav" aria-hidden="true" /> : isTenant ? <TenantTopNav /> : <PublicTopNav />}
      <main className="grow">{children}</main>
      {isTenant && <BottomNav />}
    </div>
  );
}
