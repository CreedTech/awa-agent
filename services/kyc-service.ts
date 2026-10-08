import { apiFetch } from "@/lib/api";

export interface KycRequest {
  id: string;
  user_id?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  role?: string;
  document_type: string;
  document_last4: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  created_at: string;
  reviewed_at?: string | null;
  review_note?: string | null;
}

export const kycService = {
  async mine() {
    const response = await apiFetch<{ data: { kycStatus: string; requests: KycRequest[] } }>("/kyc/me");
    return response.data;
  },
  async submit(documentType: string, documentLast4: string) {
    const response = await apiFetch<{ data: { id: string } }>("/kyc/requests", { method: "POST", json: { documentType, documentLast4 } });
    return response.data.id;
  },
  async queue() {
    const response = await apiFetch<{ data: KycRequest[] }>("/kyc/admin/requests?status=PENDING");
    return response.data;
  },
  async review(id: string, decision: "APPROVED" | "REJECTED", note: string, evidenceChecked: boolean) {
    await apiFetch(`/kyc/admin/requests/${encodeURIComponent(id)}/review`, {
      method: "POST", json: { decision, note, evidenceChecked },
    });
  },
};
