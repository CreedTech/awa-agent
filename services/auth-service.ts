/* Simulated auth. Swap for JWT + OTP (Termii/Twilio) in production. */
import { mockResolve } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import type { Role, User } from "@/lib/types";
import type { SignupValues, LoginValues } from "@/lib/validations";

export const authService = {
  /** POST /auth/register → { user, token } (mock: triggers OTP step). */
  async register(values: SignupValues) {
    useAuthStore.getState().setPendingPhone(values.phone);
    return mockResolve({ ok: true, otpSentTo: values.phone });
  },

  /** POST /auth/login → sets the session for the chosen role. */
  async login(role: Exclude<Role, "guest">, values: LoginValues) {
    useAuthStore.getState().login(role, { name: values.identifier });
    return mockResolve({ ok: true });
  },

  /** POST /auth/verify-otp → { verified }. Mock accepts any 6 digits. */
  async verifyOtp(code: string) {
    return mockResolve({ verified: code.replace(/\s/g, "").length === 6 });
  },

  completeOnboarding(role: Exclude<Role, "guest">, user?: Partial<User>) {
    useAuthStore.getState().login(role, user);
  },

  logout() {
    useAuthStore.getState().logout();
  },
};
