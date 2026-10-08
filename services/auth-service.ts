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
  async me(): Promise<Account> {
    const response = await apiFetch<{ data: BackendUser }>("/auth/me");
    return toAccount(response.data);
  },

  async updateProfile(values: { name: string; phone: string }): Promise<Account> {
    const response = await apiFetch<{ data: BackendUser }>("/auth/me", { method: "PATCH", json: values });
    const account = toAccount(response.data);
    useAuthStore.getState().login(account, useAuthStore.getState().token ?? "");
    return account;
  },
  async capabilities(): Promise<{ signupAvailable: boolean; passwordResetAvailable: boolean; verificationChannel: "email" }> {
    const response = await apiFetch<{ data: { signupAvailable: boolean; passwordResetAvailable: boolean; verificationChannel: "email" } }>("/auth/capabilities");
    return response.data;
  },

  async signup(values: { name: string; phone: string; email: string; password: string; role: "tenant" | "agent" | "landlord" }) {
    return apiFetch<{ data: { user: BackendUser } }>("/auth/signup", { method: "POST", json: values });
  },

  async resendVerification(email: string) {
    await apiFetch("/auth/resend-otp", { method: "POST", json: { identifier: email } });
  },

  async verifyEmail(email: string, code: string) {
    const response = await apiFetch<{ data: { user: BackendUser; token: string } }>("/auth/verify-otp", {
      method: "POST", json: { identifier: email, otp: code },
    });
    const account = toAccount(response.data.user);
    useAuthStore.getState().login(account, response.data.token);
    return account;
  },

  async forgotPassword(email: string) {
    await apiFetch("/auth/forgot-password", { method: "POST", json: { email } });
  },

  async resetPassword(token: string, password: string) {
    await apiFetch("/auth/reset-password", { method: "POST", json: { token, password } });
  },

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
