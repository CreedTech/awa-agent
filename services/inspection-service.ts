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
  createdAt?: string;
  tenant?: { name: string };
  fullAddress?: { street: string } | null;
}

function toInspection(value: BackendInspection): Inspection {
  const date = value.preferredDate ?? value.createdAt ?? "";
  return {
    id: value.id ?? value.inspectionId ?? "",
    propertyId: value.propertyId ?? "",
    propertyTitle: value.propertyTitle,
    landmark: value.landmark,
    tenantName: value.tenant?.name ?? useAuthStore.getState().account?.name ?? "",
    date: date ? new Date(date).toLocaleDateString("en-GB") : "",
    time: "",
    otp: value.otp ?? "",
    status: value.status === "PENDING" ? "REQUESTED" : value.status === "CANCELLED" ? "EXPIRED" : "COMPLETED",
    queuePosition: 0,
    addressUnlocked: value.status === "COMPLETED",
    exactAddress: value.fullAddress?.street,
  };
}

export const inspectionService = {
  async list(): Promise<Inspection[]> {
    const role = useAuthStore.getState().role;
    const response = await apiFetch<{ data: BackendInspection[] }>(role === "agent" ? "/inspection/agent" : "/inspection/mine");
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
};
