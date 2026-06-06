/* ============================================================
   AwaAgent - Accounts store (simulated user directory)
   Real login/registration backed by IndexedDB. Each person has
   their own account and logs in to their own dashboard; there is
   no "switch role" toggle. Passwords are plaintext for the demo
   only - a real backend hashes them server-side.
   ============================================================ */

"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { idbStorage } from "@/lib/idb-storage";
import { TENANT_ME, AGENT_ME, LANDLORD_ME, ADMIN_ME } from "@/lib/mock-data";
import type { Account, KycStatus, Role } from "@/lib/types";

const DEMO_PASSWORD = "demo1234";

/** Seeded demo accounts - one real login per role. */
const SEED_ACCOUNTS: Account[] = [
  { id: "acc-tenant", name: TENANT_ME.name, email: "tenant@awaagent.ng", phone: "08035521190", password: DEMO_PASSWORD, role: "tenant", kycStatus: "VERIFIED", photo: TENANT_ME.photo },
  { id: "acc-agent", name: AGENT_ME.name, email: "agent@awaagent.ng", phone: "08044410092", password: DEMO_PASSWORD, role: "agent", kycStatus: "VERIFIED", photo: AGENT_ME.photo },
  { id: "acc-landlord", name: LANDLORD_ME.name, email: "landlord@awaagent.ng", phone: "08034410092", password: DEMO_PASSWORD, role: "landlord", kycStatus: "VERIFIED", photo: LANDLORD_ME.photo },
  { id: "acc-admin", name: ADMIN_ME.name, email: "admin@awaagent.ng", phone: "08090000001", password: DEMO_PASSWORD, role: "admin", kycStatus: "VERIFIED" },
];

export const DEMO_LOGINS = SEED_ACCOUNTS.map((a) => ({ role: a.role, email: a.email, password: a.password }));

const normalize = (v: string) => v.trim().toLowerCase().replace(/\s/g, "");

interface AccountsState {
  accounts: Account[];

  /** Validate a login; returns the account or null (no match / wrong password). */
  authenticate: (identifier: string, password: string) => Account | null;
  /** Create a new account. Returns the account, or null if email/phone is taken. */
  register: (input: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: Exclude<Role, "guest">;
  }) => Account | null;
  setKyc: (accountId: string, status: KycStatus) => void;
  getById: (accountId: string) => Account | undefined;
}

export const useAccountsStore = create<AccountsState>()(
  persist(
    (set, get) => ({
      accounts: SEED_ACCOUNTS,

      authenticate: (identifier, password) => {
        const id = normalize(identifier);
        const acc = get().accounts.find(
          (a) => normalize(a.email) === id || normalize(a.phone) === id,
        );
        return acc && acc.password === password ? acc : null;
      },

      register: ({ name, email, phone, password, role }) => {
        const exists = get().accounts.some(
          (a) => normalize(a.email) === normalize(email) || normalize(a.phone) === normalize(phone),
        );
        if (exists) return null;
        const account: Account = {
          id: `acc-${Date.now().toString(36)}`,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
          role,
          // New agents and landlords must pass KYC; tenants start unverified too.
          kycStatus: "UNVERIFIED",
        };
        set((s) => ({ accounts: [...s.accounts, account] }));
        return account;
      },

      setKyc: (accountId, status) =>
        set((s) => ({
          accounts: s.accounts.map((a) => (a.id === accountId ? { ...a, kycStatus: status } : a)),
        })),

      getById: (accountId) => get().accounts.find((a) => a.id === accountId),
    }),
    {
      name: "awaagent-accounts",
      version: 1,
      storage: createJSONStorage(() => idbStorage),
    },
  ),
);
