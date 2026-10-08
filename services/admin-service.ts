import { apiFetch } from "@/lib/api";

export interface AdminDashboard {
  activeUsers: number; liveProperties: number; pendingProperties: number; pendingKyc: number;
  pendingInspections: number; openPayments: number; settledPlatformShare: string;
}
export interface AdminUser {
  id: string; role: string; name: string; email: string; phone: string;
  accountStatus: string; kycStatus: string; trustScore: number; createdAt: string;
}
export interface PlatformSettings { subscriptionPriceNaira: number; platformFeeBps: number; agentShareBps: number }
export interface AuditEvent { id: number; action: string; targetType: string; targetId: string; actorName: string; createdAt: string; detail: Record<string, unknown> }
export interface TrustUser { id: string; name: string; role: string; kycStatus: string; trustScore: number; pendingFlags: number; upheldFlags: number }
export interface TrustFlag { id: string; reason: string; description: string; status: string; createdAt: string; reportedId: string; reportedName: string }
export interface ReconciliationCase {
  id: string; status: string; legacyStatus: string | null; paystackReference: string | null;
  grossAmount: number; createdAt: string; propertyTitle: string;
  payouts: Array<{ id: string; role: string; status: string; reference: string }>;
  notes: Array<{ note: string; at: string; actor: string }>;
}

export const adminService = {
  async dashboard() { const response = await apiFetch<{ data: AdminDashboard }>("/admin/dashboard"); return response.data; },
  async users() { const response = await apiFetch<{ data: AdminUser[] }>("/admin/users"); return response.data; },
  async setUserStatus(id: string, status: "ACTIVE" | "SUSPENDED", note: string) {
    await apiFetch(`/admin/users/${encodeURIComponent(id)}/status`, { method: "PATCH", json: { status, note } });
  },
  async settings() { const response = await apiFetch<{ data: PlatformSettings }>("/admin/settings"); return response.data; },
  async saveSettings(values: PlatformSettings) { const response = await apiFetch<{ data: PlatformSettings }>("/admin/settings", { method: "PATCH", json: values }); return response.data; },
  async audit() { const response = await apiFetch<{ data: AuditEvent[] }>("/admin/audit"); return response.data; },
  async trust() { const response = await apiFetch<{ data: TrustUser[] }>("/admin/trust"); return response.data; },
  async flags() { const response = await apiFetch<{ data: TrustFlag[] }>("/admin/flags"); return response.data; },
  async reviewFlag(id: string, decision: "UPHELD" | "DISMISSED", note: string) {
    await apiFetch(`/admin/flags/${encodeURIComponent(id)}/review`, { method: "POST", json: { decision, note } });
  },
  async reconciliation(): Promise<ReconciliationCase[]> {
    const response = await apiFetch<{ data: ReconciliationCase[] }>("/admin/reconciliation");
    return response.data;
  },
  async addReconciliationNote(id: string, note: string): Promise<void> {
    await apiFetch(`/admin/reconciliation/${encodeURIComponent(id)}/notes`, { method: "POST", json: { note } });
  },
};
