/* ============================================================
   AwaAgent - Session store
   Holds the currently logged-in account. No role toggle: a person
   signs in to their own account and lands in their own dashboard.
   Persisted to localStorage (sync) so route guards hydrate without
   a flash.
   ============================================================ */

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Account, KycStatus, Role } from "@/lib/types";

interface AuthState {
  account: Account | null;
  role: Role;
  isAuthenticated: boolean;
  hydrated: boolean;
  token: string | null;

  setHydrated: (hydrated: boolean) => void;
  login: (account: Account, token?: string) => void;
  logout: () => void;
  /** Reflect a KYC status change on the active session. */
  setSessionKyc: (status: KycStatus) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      account: null,
      role: "guest" as Role,
      isAuthenticated: false,
      hydrated: false,
      token: null,

      setHydrated: (hydrated) => set({ hydrated }),

      login: (account, token = "") =>
        set({ account, role: account.role, isAuthenticated: true, token: token || null }),

      logout: () =>
        set({ account: null, role: "guest", isAuthenticated: false, token: null }),

      setSessionKyc: (status) =>
        set((s) => (s.account ? { account: { ...s.account, kycStatus: status } } : s)),
    }),
    {
      name: "awaagent-session-live",
      partialize: (s) => ({
        account: s.account,
        role: s.role,
        isAuthenticated: s.isAuthenticated,
        token: s.token,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
