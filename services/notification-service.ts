import { apiFetch } from "@/lib/api";

export interface AppNotification {
  id: string; title: string; body: string; href: string | null;
  createdAt: string; readAt: string | null;
}

export const notificationService = {
  async list(): Promise<AppNotification[]> {
    const response = await apiFetch<{ data: AppNotification[] }>("/notifications");
    return response.data;
  },
  async markRead(id: string): Promise<void> {
    await apiFetch(`/notifications/${encodeURIComponent(id)}/read`, { method: "POST" });
  },
};
