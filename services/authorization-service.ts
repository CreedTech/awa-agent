import { apiFetch } from "@/lib/api";

export interface AgentAuthorization {
  id: string;
  status: "PENDING" | "ACTIVE" | "REJECTED" | "REVOKED";
  createdAt: string;
  agentId: string;
  agentName: string;
  agentKycStatus: string;
  agentTrustScore: number;
}

export interface LandlordAuthorization {
  id: string;
  status: "PENDING" | "ACTIVE" | "REJECTED" | "REVOKED";
  createdAt: string;
  landlordId: string;
  landlordName: string;
}

export const authorizationService = {
  async myAgents(): Promise<AgentAuthorization[]> {
    const response = await apiFetch<{ data: AgentAuthorization[] }>("/agents/my-agents");
    return response.data;
  },
  async myLandlords(): Promise<LandlordAuthorization[]> {
    const response = await apiFetch<{ data: LandlordAuthorization[] }>("/agents/my-landlords");
    return response.data;
  },
  async invite(agentPhone: string) {
    await apiFetch("/agents/invite", { method: "POST", json: { agentPhone } });
  },
  async accept(invitationId: string) {
    await apiFetch("/agents/accept", { method: "POST", json: { invitationId } });
  },
  async reject(invitationId: string) {
    await apiFetch("/agents/reject", { method: "POST", json: { invitationId } });
  },
  async revoke(authorizationId: string) {
    await apiFetch("/agents/revoke", { method: "POST", json: { authorizationId } });
  },
};
