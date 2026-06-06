/* Simulated auth backed by the IndexedDB accounts directory.
   Swap for real JWT + OTP (Termii/Twilio) in production. */
import { mockResolve } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { useAccountsStore } from "@/store/accounts-store";
import type { Role } from "@/lib/types";
import type { SignupValues } from "@/lib/validations";

export const authService = {
  /** POST /auth/login - validate credentials, start the session. */
  async login(identifier: string, password: string) {
    const account = useAccountsStore.getState().authenticate(identifier, password);
    if (account) useAuthStore.getState().login(account);
    return mockResolve(account);
  },

  /** POST /auth/register - create the account, then OTP-verify. */
  async register(values: SignupValues, role: Exclude<Role, "guest">) {
    const account = useAccountsStore.getState().register({
      name: values.name,
      email: values.email || `${values.phone}@awaagent.ng`,
      phone: values.phone,
      password: values.password,
      role,
    });
    if (account) useAuthStore.getState().setPending(account);
    return mockResolve(account);
  },

  /** POST /auth/verify-otp - any 6 digits in the demo. Logs the pending user in. */
  async verifyOtp(code: string) {
    const verified = code.replace(/\s/g, "").length === 6;
    if (verified) {
      const { pendingAccountId } = useAuthStore.getState();
      const account = pendingAccountId
        ? useAccountsStore.getState().getById(pendingAccountId)
        : undefined;
      if (account) useAuthStore.getState().login(account);
    }
    return mockResolve({ verified });
  },

  logout() {
    useAuthStore.getState().logout();
  },
};
