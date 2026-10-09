import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { useAppStore } from "@/store/app-store";
import type { Inspection } from "@/lib/types";

interface BackendInspection {
  id?: string;
  inspectionId?: string;
  propertyId?: string;
  propertyTitle?: string;
  landmark?: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  otp?: string;
  preferredDate?: string | null;
  tenantName?: string;
  createdAt?: string;
  tenant?: { name: string };
  fullAddress?: { street: string; lga?: string; lat?: number | null; lng?: number | null } | null;
}

function toInspection(value: BackendInspection): Inspection {
  const date = value.preferredDate ?? value.createdAt ?? "";
  return {
    id: value.id ?? value.inspectionId ?? "",
    propertyId: value.propertyId ?? "",
    propertyTitle: value.propertyTitle,
    landmark: value.landmark,
    tenantName: value.tenantName ?? value.tenant?.name ?? useAuthStore.getState().account?.name ?? "",
    date: date ? new Date(date).toLocaleDateString("en-GB") : "",
    preferredDate: value.preferredDate?.slice(0, 10),
    time: "",
    otp: value.otp ?? "",
    status: value.status === "PENDING" ? "REQUESTED" : value.status === "CANCELLED" ? "EXPIRED" : "COMPLETED",
    queuePosition: 0,
    addressUnlocked: value.status === "COMPLETED",
    exactAddress: value.fullAddress ? [value.fullAddress.street, value.fullAddress.lga].filter(Boolean).join(", ") : undefined,
    location: value.fullAddress?.lat != null && value.fullAddress?.lng != null ? { lat: Number(value.fullAddress.lat), lng: Number(value.fullAddress.lng) } : undefined,
  };
}

export const inspectionService = {
  async list(): Promise<Inspection[]> {
    const role = useAuthStore.getState().role;
    const path = role === "agent" ? "/inspection/agent" : role === "landlord" ? "/inspection/landlord" : role === "admin" ? "/inspection/admin" : "/inspection/mine";
    const response = await apiFetch<{ data: BackendInspection[] }>(path);
    return response.data.map(toInspection);
  },

  async get(id: string): Promise<Inspection | undefined> {
    return (await this.list()).find((inspection) => inspection.id === id);
  },

  async book(propertyId: string, preferredDate: string): Promise<Inspection> {
    const response = await apiFetch<{ data: { inspectionId: string; otp: string } }>("/inspection/book", {
      method: "POST", json: { propertyId, preferredDate },
    });
    const inspection: Inspection = {
      id: response.data.inspectionId,
      propertyId,
      tenantName: useAuthStore.getState().account?.name ?? "",
      date: preferredDate,
      preferredDate,
      time: "",
      otp: response.data.otp,
      status: "REQUESTED",
      queuePosition: 0,
      addressUnlocked: false,
    };
    useAppStore.setState((state) => ({ inspections: [inspection, ...state.inspections] }));
    return inspection;
  },

  async verifyOtp(id: string, code: string): Promise<void> {
    await apiFetch("/inspection/verify", { method: "POST", json: { inspectionId: id, providedOtp: code } });
    useAppStore.setState((state) => ({
      inspections: state.inspections.map((item) => item.id === id ? { ...item, status: "COMPLETED", otpVerified: true, addressUnlocked: true } : item),
    }));
  },
  async reschedule(id: string, preferredDate: string): Promise<void> {
    await apiFetch(`/inspection/${encodeURIComponent(id)}/reschedule`, { method: "PATCH", json: { preferredDate } });
  },
  async cancel(id: string): Promise<void> {
    await apiFetch(`/inspection/${encodeURIComponent(id)}/cancel`, { method: "POST" });
  },
  async unavailableDates(): Promise<string[]> {
    const response = await apiFetch<{ data: string[] }>("/inspection/agent/unavailable-dates");
    return response.data;
  },
  async blockDate(date: string): Promise<void> {
    await apiFetch("/inspection/agent/unavailable-dates", { method: "POST", json: { date } });
  },
  async unblockDate(date: string): Promise<void> {
    await apiFetch(`/inspection/agent/unavailable-dates/${encodeURIComponent(date)}`, { method: "DELETE" });
  },
};
