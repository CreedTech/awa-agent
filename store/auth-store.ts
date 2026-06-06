/* ============================================================
   AwaAgent - Session store
   Holds the currently logged-in account. No role toggle: a person
   signs in to their own account and lands in their own dashboard.
   Persisted to localStorage (sync) so route guards hydrate without
   a flash. The account directory lives in `accounts-store`.
   ============================================================ */

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Account, KycStatus, Role } from "@/lib/types";

interface AuthState {
  account: Account | null;
  role: Role;
  isAuthenticated: boolean;
  /** Account awaiting OTP verification during signup. */
  pendingAccountId: string | null;
  pendingPhone: string | null;

  login: (account: Account) => void;
  logout: () => void;
  setPending: (account: Account) => void;
  /** Reflect a KYC status change on the active session. */
  setSessionKyc: (status: KycStatus) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      account: null,
      role: "guest" as Role,
      isAuthenticated: false,
      pendingAccountId: null,
      pendingPhone: null,

      login: (account) =>
        set({ account, role: account.role, isAuthenticated: true, pendingAccountId: null }),

      logout: () =>
        set({ account: null, role: "guest", isAuthenticated: false, pendingAccountId: null, pendingPhone: null }),

      setPending: (account) =>
        set({ pendingAccountId: account.id, pendingPhone: account.phone }),

      setSessionKyc: (status) =>
        set((s) => (s.account ? { account: { ...s.account, kycStatus: status } } : s)),
    }),
    { name: "awaagent-session" },
  ),
);
