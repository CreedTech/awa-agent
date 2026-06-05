/* ============================================================
   AwaAgent - Auth / session store
   Simulated auth + the prototype role switcher. Persisted to
   localStorage so a refresh keeps you in the same role.
   Replace the simulated actions with real calls in `authService`.
   ============================================================ */

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role, User } from "@/lib/types";
import { TENANT_ME, AGENT_ME, LANDLORD_ME, ADMIN_ME } from "@/lib/mock-data";

/** Demo identities used by the prototype role switcher. */
const DEMO_USERS: Record<Exclude<Role, "guest">, User> = {
  tenant: TENANT_ME,
  agent: { id: AGENT_ME.id, name: AGENT_ME.name, role: "agent", photo: AGENT_ME.photo, kycStatus: "VERIFIED", accountStatus: "ACTIVE", trustScore: AGENT_ME.trust, joined: AGENT_ME.since },
  landlord: LANDLORD_ME,
  admin: ADMIN_ME,
};

interface AuthState {
  role: Role;
  user: User | null;
  isAuthenticated: boolean;
  /** Set during onboarding before account creation completes. */
  pendingPhone: string | null;

  setRole: (role: Role) => void;
  /** Prototype-only: instantly assume a role with its demo identity. */
  switchRole: (role: Exclude<Role, "guest">) => void;
  login: (role: Exclude<Role, "guest">, user?: Partial<User>) => void;
  logout: () => void;
  setPendingPhone: (phone: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: "guest",
      user: null,
      isAuthenticated: false,
      pendingPhone: null,

      setRole: (role) => set({ role }),

      switchRole: (role) =>
        set({ role, user: DEMO_USERS[role], isAuthenticated: true }),

      login: (role, user) =>
        set({
          role,
          isAuthenticated: true,
          user: { ...DEMO_USERS[role], ...user },
        }),

      logout: () =>
        set({ role: "guest", user: null, isAuthenticated: false, pendingPhone: null }),

      setPendingPhone: (pendingPhone) => set({ pendingPhone }),
    }),
    { name: "awaagent-auth" },
  ),
);
