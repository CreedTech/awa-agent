import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import type { Account } from "@/lib/types";

interface BackendUser {
  id: string;
  role: Account["role"];
  full_name: string;
  phone: string;
  email: string | null;
  kyc_status?: Account["kycStatus"];
}

const toAccount = (user: BackendUser): Account => ({
  id: user.id,
  name: user.full_name,
  phone: user.phone,
  email: user.email ?? "",
  role: user.role,
  kycStatus: user.kyc_status ?? "UNVERIFIED",
});

export const authService = {
  async login(identifier: string, password: string) {
    const response = await apiFetch<{ data: { user: BackendUser; token: string } }>("/auth/login", {
      method: "POST", json: { identifier, password },
    });
    const account = toAccount(response.data.user);
    useAuthStore.getState().login(account, response.data.token);
    return account;
  },

  logout() {
    useAuthStore.getState().logout();
  },
};
