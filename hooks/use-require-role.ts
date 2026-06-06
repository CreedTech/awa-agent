"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import type { Role } from "@/lib/types";

/**
 * Gate a dashboard to a single role. Redirects to /auth/login when the
 * visitor is not signed in as `role`. Waits for the persisted session to
 * hydrate before deciding (avoids a redirect flash), and only redirects
 * from an effect - never during render.
 */
export function useRequireRole(role: Role): boolean {
  const router = useRouter();
  const pathname = usePathname();
  const sessionRole = useAuthStore((s) => s.role);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const authorized = isAuthenticated && sessionRole === role;

  useEffect(() => {
    if (!hydrated || authorized) return;
    if (pathname !== "/auth/login") {
      router.replace(`/auth/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, authorized, pathname, router]);

  return hydrated && authorized;
}
