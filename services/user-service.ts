/* User management (admin) + account status transitions. */
import { mockResolve } from "@/lib/api";
import { useAppStore } from "@/store/app-store";
import type { AccountStatus, User } from "@/lib/types";

export const userService = {
  async list(): Promise<User[]> {
    return mockResolve(useAppStore.getState().users);
  },

  /** PATCH /admin/users/:id - Suspend / Ban / Restore. */
  async setStatus(id: string, status: AccountStatus) {
    useAppStore.getState().setUserAccountStatus(id, status);
    return mockResolve({ ok: true });
  },
};
