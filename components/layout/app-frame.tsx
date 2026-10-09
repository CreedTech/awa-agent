"use client";

import { PublicTopNav, TenantTopNav } from "./top-nav";
import { BottomNav } from "./bottom-nav";
import { Footer } from "./footer";
import { useAuthStore } from "@/store/auth-store";

/** Public pages: public nav for guests, tenant nav once a tenant session hydrates. */
export function AppFrame({ children }: { children: React.ReactNode }) {
  const role = useAuthStore((s) => s.role);
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const hydrated = useAuthStore((s) => s.hydrated);
  const isTenant = hydrated && isAuthed && role === "tenant";

  return (
    <div className="aw-site">
      <a href="#main" className="aw-skip">Skip to content</a>
      {isTenant ? <TenantTopNav /> : <PublicTopNav />}
      <main id="main" className="aw-main">{children}</main>
      <Footer />
      {isTenant && <BottomNav />}
    </div>
  );
}
