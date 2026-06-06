/* ============================================================
   AwaAgent - Application store (mutable source of truth)
   Everything users can change lives here. Seeded from mock data
   now; in production each action becomes a service/API call and
   the collections are hydrated from the backend.

   Naming: actions are imperative verbs that describe a real state
   transition in the product (bookInspection, confirmKeys, ...).
   ============================================================ */

"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type {
  Property,
  PropertyStatus,
  Inspection,
  EscrowTransaction,
  Dispute,
  KycRecord,
  AppNotification,
  NotificationKind,
  DisputeResolution,
  AgentRole,
  LoyaltyTransaction,
} from "@/lib/types";
import {
  PROPERTIES,
  INSPECTIONS,
  ADMIN_ESCROW,
  DISPUTES,
  KYC_QUEUE,
  PROP_QUEUE,
  AGENT_REQUESTS,
  LANDLORD_PROPERTIES,
  NOTIFICATIONS,
  SAVED_IDS,
  INSPECTION_SETTINGS,
  TENANTS,
  LOYALTY,
  AGENT_EARNINGS,
  propertyById,
  type PropQueueRow,
  type LandlordProperty,
  type AgentPayout,
} from "@/lib/mock-data";
import type { LandlordAuthorization } from "@/lib/types";
import { idbStorage } from "@/lib/idb-storage";
import {
  calculateRentBreakdown,
  generateInspectionOtp,
  makePaystackRef,
  makeTxnId,
  makeIdempotencyKey,
  formatDate,
} from "@/lib/utils";

export interface InspectionSettings {
  enabled: boolean;
  maxPerDay: number;
  workingDays: string[];
  blockedDates: string[];
}

interface AppState {
  /* ---- collections ---- */
  properties: Property[];
  savedIds: string[];
  inspections: Inspection[];
  escrow: EscrowTransaction[];
  disputes: Dispute[];
  kycQueue: KycRecord[];
  propQueue: PropQueueRow[];
  agentRequests: LandlordAuthorization[];
  landlordProperties: LandlordProperty[];
  notifications: AppNotification[];
  users: typeof TENANTS;
  inspectionSettings: InspectionSettings;
  loyaltyBalance: number;
  loyaltyHistory: LoyaltyTransaction[];
  agentAvailable: number;
  agentPayouts: AgentPayout[];

  /* ---- tenant actions ---- */
  toggleSaved: (propertyId: string) => void;
  bookInspection: (propertyId: string, date: string, time: string) => Inspection;
  cancelInspection: (inspectionId: string) => void;
  rescheduleInspection: (inspectionId: string, date: string, time: string) => void;
  payEscrow: (propertyId: string, commissionPct?: number) => EscrowTransaction;
  failPayment: (txnId: string) => void;
  confirmKeys: (txnId: string) => void;
  raiseDispute: (txnId: string, reason: string) => void;
  redeemLoyalty: (cost: number, label: string) => boolean;

  /* ---- agent actions ---- */
  approveInspection: (inspectionId: string) => void;
  verifyInspectionOtp: (inspectionId: string, code: string) => boolean;
  completeInspection: (inspectionId: string) => void;
  addProperty: (draft: Partial<Property>) => Property;
  updateProperty: (propertyId: string, patch: Partial<Property>) => void;
  setPropertyStatus: (propertyId: string, status: PropertyStatus) => void;
  setInspectionSettings: (settings: Partial<InspectionSettings>) => void;
  withdrawAgent: (amount: number, bank: string, accountNumber: string) => boolean;

  /* ---- landlord actions ---- */
  resolveAgentRequest: (requestId: string, approve: boolean) => void;
  setPrimaryAgent: (propertyId: string, agentId: string) => void;
  revokeAgent: (propertyId: string, agentId: string) => void;
  reauthorizeAgent: (propertyId: string, agentId: string) => void;
  setMaxAgents: (propertyId: string, max: number) => void;
  setLandlordPropertyStatus: (propertyId: string, status: LandlordProperty["status"]) => void;

  /** A new signup submits KYC; surfaces it in the admin queue. */
  submitKycRecord: (record: { name: string; role: KycRecord["role"]; phone: string; nin: string }) => void;

  /* ---- admin actions ---- */
  approveKyc: (id: string) => void;
  rejectKyc: (id: string) => void;
  approveProperty: (id: string) => void;
  rejectProperty: (id: string) => void;
  freezeEscrow: (txnId: string) => void;
  releaseEscrow: (txnId: string) => void;
  refundEscrow: (txnId: string) => void;
  resolveDispute: (disputeId: string, resolution: DisputeResolution) => void;
  setUserAccountStatus: (userId: string, status: "ACTIVE" | "SUSPENDED" | "BANNED") => void;

  /* ---- notifications ---- */
  pushNotification: (n: { kind: NotificationKind; title: string; body: string }) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  /** Restore the entire store to its seeded state (demo reset). */
  resetDemo: () => void;
}

const seed = () => ({
  properties: structuredClone(PROPERTIES),
  savedIds: [...SAVED_IDS],
  inspections: structuredClone(INSPECTIONS),
  escrow: structuredClone(ADMIN_ESCROW),
  disputes: structuredClone(DISPUTES),
  kycQueue: structuredClone(KYC_QUEUE),
  propQueue: structuredClone(PROP_QUEUE),
  agentRequests: structuredClone(AGENT_REQUESTS),
  landlordProperties: structuredClone(LANDLORD_PROPERTIES),
  notifications: structuredClone(NOTIFICATIONS),
  users: structuredClone(TENANTS),
  inspectionSettings: { ...INSPECTION_SETTINGS },
  loyaltyBalance: LOYALTY.balance,
  loyaltyHistory: structuredClone(LOYALTY.history),
  agentAvailable: AGENT_EARNINGS.available,
  agentPayouts: structuredClone(AGENT_EARNINGS.history),
});

let notifSeq = 100;

export const useAppStore = create<AppState>()(
  persist(
    immer((set, get) => ({
    ...seed(),

    /* ---------------- tenant ---------------- */
    toggleSaved: (propertyId) =>
      set((s) => {
        const i = s.savedIds.indexOf(propertyId);
        if (i >= 0) s.savedIds.splice(i, 1);
        else s.savedIds.push(propertyId);
      }),

    bookInspection: (propertyId, date, time) => {
      const prop = propertyById(propertyId);
      const existing = get().inspections.filter((i) => i.propertyId === propertyId);
      const inspection: Inspection = {
        id: `insp-${Date.now().toString(36)}`,
        propertyId,
        tenantName: "Bisi Akande",
        date,
        time,
        otp: generateInspectionOtp(),
        status: "CONFIRMED",
        queuePosition: existing.length + 1,
        addressUnlocked: false,
      };
      set((s) => {
        s.inspections.unshift(inspection);
      });
      get().pushNotification({
        kind: "inspection_reminder",
        title: "Inspection booked",
        body: `Your inspection for ${prop?.title ?? "the property"} is set for ${date} at ${time}.`,
      });
      return inspection;
    },

    cancelInspection: (inspectionId) =>
      set((s) => {
        const insp = s.inspections.find((i) => i.id === inspectionId);
        if (insp) insp.status = "TENANT_CANCELLED";
      }),

    rescheduleInspection: (inspectionId, date, time) =>
      set((s) => {
        const insp = s.inspections.find((i) => i.id === inspectionId);
        if (insp) {
          insp.date = date;
          insp.time = time;
          insp.status = "RESCHEDULED";
        }
      }),

    payEscrow: (propertyId, commissionPct) => {
      const prop = propertyById(propertyId);
      const breakdown = calculateRentBreakdown(prop?.baseRent ?? 0, commissionPct);
      const txn: EscrowTransaction = {
        id: makeTxnId(),
        propertyId,
        tenantName: "Bisi Akande",
        agentName: "Tunde Adeyemi",
        landlordName: "Mr. B. Adeyinka",
        amount: breakdown.total,
        status: "FUNDS_LOCKED",
        lockedOn: formatDate(new Date()),
        paystackRef: makePaystackRef(),
        idempotencyKey: makeIdempotencyKey(),
        breakdown,
      };
      set((s) => {
        s.escrow.unshift(txn);
      });
      get().pushNotification({
        kind: "funds_locked",
        title: "Funds locked in escrow",
        body: `${breakdown.total.toLocaleString("en-NG")} is safely held for ${prop?.title ?? "your rental"}.`,
      });
      return txn;
    },

    failPayment: (txnId) =>
      set((s) => {
        const t = s.escrow.find((e) => e.id === txnId);
        if (t) t.status = "PAYMENT_FAILED";
      }),

    confirmKeys: (txnId) => {
      set((s) => {
        const t = s.escrow.find((e) => e.id === txnId);
        if (t) {
          t.status = "SETTLED";
          t.settledOn = formatDate(new Date());
        }
      });
      get().pushNotification({
        kind: "funds_released",
        title: "Funds released",
        body: "You confirmed your keys - escrow has been split to the landlord and agent.",
      });
    },

    raiseDispute: (txnId, reason) => {
      const txn = get().escrow.find((e) => e.id === txnId);
      set((s) => {
        const t = s.escrow.find((e) => e.id === txnId);
        if (t) t.status = "DISPUTED";
        const prop = txn ? propertyById(txn.propertyId) : undefined;
        s.disputes.unshift({
          id: `dsp-${Date.now().toString(36)}`,
          txnRef: txnId,
          propertyName: prop?.title ?? "Property",
          tenant: txn?.tenantName ?? "Bisi Akande",
          agent: txn?.agentName ?? "-",
          landlord: txn?.landlordName ?? "-",
          amount: txn?.amount ?? 0,
          reason,
          evidenceCount: 1,
          priority: "HIGH",
          status: "OPEN",
          raised: formatDate(new Date()),
        });
      });
      get().pushNotification({
        kind: "dispute_opened",
        title: "Dispute opened",
        body: "Funds are frozen while our team reviews. Expect an update within 24 hours.",
      });
    },

    redeemLoyalty: (cost, label) => {
      if (get().loyaltyBalance < cost) return false;
      set((s) => {
        s.loyaltyBalance -= cost;
        s.loyaltyHistory.unshift({
          id: `ly-${Date.now().toString(36)}`,
          label: `Redeemed: ${label}`,
          points: -cost,
          date: formatDate(new Date()),
          kind: "redeem",
        });
      });
      get().pushNotification({ kind: "loyalty_earned", title: "Reward redeemed", body: `${label} - ${cost} points used.` });
      return true;
    },

    /* ---------------- agent ---------------- */
    approveInspection: (inspectionId) => {
      set((s) => {
        const insp = s.inspections.find((i) => i.id === inspectionId);
        if (insp) {
          insp.status = "APPROVED";
          insp.addressUnlocked = true;
        }
      });
      get().pushNotification({
        kind: "inspection_approved",
        title: "Inspection approved",
        body: "The exact address and route are now unlocked.",
      });
    },

    verifyInspectionOtp: (inspectionId, code) => {
      const insp = get().inspections.find((i) => i.id === inspectionId);
      const ok = !!insp && insp.otp.replace(/\s/g, "") === code.replace(/\s/g, "");
      if (ok) {
        set((s) => {
          const i = s.inspections.find((x) => x.id === inspectionId);
          if (i) {
            i.otpVerified = true;
            i.gpsOk = true;
            i.status = "COMPLETED";
          }
        });
      }
      return ok;
    },

    completeInspection: (inspectionId) =>
      set((s) => {
        const insp = s.inspections.find((i) => i.id === inspectionId);
        if (insp) insp.status = "COMPLETED";
      }),

    addProperty: (draft) => {
      const id = `p-${Date.now().toString(36)}`;
      const property: Property = {
        id,
        title: draft.title ?? "New listing",
        type: draft.type ?? "Flat",
        area: draft.area ?? "Bodija",
        landmark: draft.landmark ?? "",
        exactAddress: draft.exactAddress,
        location: draft.location,
        beds: draft.beds ?? 1,
        baths: draft.baths ?? 1,
        baseRent: draft.baseRent ?? 300000,
        agentId: draft.agentId ?? "AGT-4471",
        amenities: draft.amenities ?? [],
        imageLabels: draft.imageLabels ?? ["Photo 1", "Photo 2", "Photo 3"],
        images: draft.images ?? [],
        description: draft.description ?? "",
        views: 0,
        bookmarks: 0,
        available: true,
        badge: "Verified",
        status: draft.status ?? "AWAITING_ADMIN_REVIEW",
      };
      set((s) => {
        s.properties.unshift(property);
        s.propQueue.unshift({
          id: `pq-${id}`,
          title: property.title,
          agentName: "Tunde Adeyemi",
          agentId: "AGT-4471",
          agentTrust: 94,
          landlord: "Chief R. Adeleke · LND-3092",
          area: property.area,
          baseRent: property.baseRent,
          gps: property.location
            ? `${property.location.lat.toFixed(5)}° N, ${property.location.lng.toFixed(5)}° E`
            : "-",
          submitted: formatDate(new Date()),
          status: "PENDING",
          risk: [],
        });
      });
      return property;
    },

    updateProperty: (propertyId, patch) =>
      set((s) => {
        const p = s.properties.find((x) => x.id === propertyId);
        if (p) Object.assign(p, patch);
      }),

    setPropertyStatus: (propertyId, status) =>
      set((s) => {
        const p = s.properties.find((x) => x.id === propertyId);
        if (p) p.status = status;
      }),

    setInspectionSettings: (settings) =>
      set((s) => {
        s.inspectionSettings = { ...s.inspectionSettings, ...settings };
      }),

    withdrawAgent: (amount, bank) => {
      if (amount <= 0 || amount > get().agentAvailable) return false;
      set((s) => {
        s.agentAvailable -= amount;
        s.agentPayouts.unshift({
          id: `PO-${Math.floor(1000 + Math.random() * 8999)}`,
          type: "Commission split",
          prop: `Withdrawal to ${bank}`,
          amount,
          date: formatDate(new Date()),
          status: "Paid",
        });
      });
      get().pushNotification({ kind: "agent_payout", title: "Withdrawal sent", body: `${amount.toLocaleString("en-NG")} is on its way to your ${bank} account.` });
      return true;
    },

    /* ---------------- landlord ---------------- */
    resolveAgentRequest: (requestId, approve) =>
      set((s) => {
        const req = s.agentRequests.find((r) => r.id === requestId);
        if (!req) return;
        req.status = approve ? "AUTHORIZED" : "REJECTED";
        if (approve) {
          const prop = s.landlordProperties.find((p) => p.id === req.propertyId);
          if (prop && !prop.agents.some((a) => a.id === req.agentId)) {
            prop.agents.push({
              id: req.agentId,
              name: req.agentName,
              trust: req.trust,
              role: "AUTHORIZED",
              status: "AUTHORIZED",
              commission: 9,
              since: formatDate(new Date()),
              deals: 0,
            });
          }
        }
      }),

    setPrimaryAgent: (propertyId, agentId) =>
      set((s) => {
        const prop = s.landlordProperties.find((p) => p.id === propertyId);
        prop?.agents.forEach((a) => {
          a.role = (a.id === agentId ? "PRIMARY" : "AUTHORIZED") as AgentRole;
        });
      }),

    revokeAgent: (propertyId, agentId) =>
      set((s) => {
        const prop = s.landlordProperties.find((p) => p.id === propertyId);
        const ag = prop?.agents.find((a) => a.id === agentId);
        if (ag) ag.status = "REVOKED";
      }),

    reauthorizeAgent: (propertyId, agentId) =>
      set((s) => {
        const prop = s.landlordProperties.find((p) => p.id === propertyId);
        const ag = prop?.agents.find((a) => a.id === agentId);
        if (ag) ag.status = "AUTHORIZED";
      }),

    setMaxAgents: (propertyId, max) =>
      set((s) => {
        const prop = s.landlordProperties.find((p) => p.id === propertyId);
        if (prop) prop.maxAgents = Math.max(1, Math.min(8, max));
      }),

    setLandlordPropertyStatus: (propertyId, status) =>
      set((s) => {
        const prop = s.landlordProperties.find((p) => p.id === propertyId);
        if (prop) {
          prop.status = status;
          prop.available = status === "LIVE";
        }
      }),

    submitKycRecord: ({ name, role, phone, nin }) =>
      set((s) => {
        s.kycQueue.unshift({
          id: `kyc-${Date.now().toString(36)}`,
          name,
          role,
          phone,
          nin,
          submitted: formatDate(new Date()),
          trust: 0,
          risk: [],
          status: "PENDING",
        });
      }),

    /* ---------------- admin ---------------- */
    approveKyc: (id) =>
      set((s) => {
        const k = s.kycQueue.find((x) => x.id === id);
        if (k) {
          k.status = "APPROVED";
          k.approvedOn = formatDate(new Date());
        }
      }),

    rejectKyc: (id) =>
      set((s) => {
        const k = s.kycQueue.find((x) => x.id === id);
        if (k) {
          k.status = "REJECTED";
          k.rejectedOn = formatDate(new Date());
        }
      }),

    approveProperty: (id) =>
      set((s) => {
        const p = s.propQueue.find((x) => x.id === id);
        if (p) {
          p.status = "APPROVED";
          p.approvedOn = formatDate(new Date());
        }
      }),

    rejectProperty: (id) =>
      set((s) => {
        const p = s.propQueue.find((x) => x.id === id);
        if (p) p.status = "REJECTED";
      }),

    freezeEscrow: (txnId) =>
      set((s) => {
        const t = s.escrow.find((e) => e.id === txnId);
        if (t) t.status = "FROZEN";
      }),

    releaseEscrow: (txnId) =>
      set((s) => {
        const t = s.escrow.find((e) => e.id === txnId);
        if (t) {
          t.status = "SETTLED";
          t.settledOn = formatDate(new Date());
        }
      }),

    refundEscrow: (txnId) =>
      set((s) => {
        const t = s.escrow.find((e) => e.id === txnId);
        if (t) {
          t.status = "REFUNDED";
          t.refundedOn = formatDate(new Date());
        }
      }),

    resolveDispute: (disputeId, resolution) =>
      set((s) => {
        const d = s.disputes.find((x) => x.id === disputeId);
        if (!d) return;
        d.status = "RESOLVED";
        d.resolution = resolution;
        d.resolvedOn = formatDate(new Date());
        const t = s.escrow.find((e) => e.id === d.txnRef);
        if (t) {
          t.status = resolution === "tenant" ? "REFUNDED" : "SETTLED";
          if (resolution === "tenant") t.refundedOn = formatDate(new Date());
          else t.settledOn = formatDate(new Date());
        }
      }),

    setUserAccountStatus: (userId, status) =>
      set((s) => {
        const u = s.users.find((x) => x.id === userId);
        if (u) u.accountStatus = status;
      }),

    /* ---------------- notifications ---------------- */
    pushNotification: ({ kind, title, body }) =>
      set((s) => {
        s.notifications.unshift({
          id: `n-${notifSeq++}`,
          kind,
          title,
          body,
          time: "Just now",
          read: false,
        });
      }),

    markNotificationRead: (id) =>
      set((s) => {
        const n = s.notifications.find((x) => x.id === id);
        if (n) n.read = true;
      }),

    markAllNotificationsRead: () =>
      set((s) => {
        s.notifications.forEach((n) => (n.read = true));
      }),

    resetDemo: () => set(() => seed()),
    })),
    {
      name: "awaagent-store",
      version: 1,
      storage: createJSONStorage(() => idbStorage),
      // Persist only data collections - actions come from the initializer.
      partialize: (s) => ({
        properties: s.properties,
        savedIds: s.savedIds,
        inspections: s.inspections,
        escrow: s.escrow,
        disputes: s.disputes,
        kycQueue: s.kycQueue,
        propQueue: s.propQueue,
        agentRequests: s.agentRequests,
        landlordProperties: s.landlordProperties,
        notifications: s.notifications,
        users: s.users,
        inspectionSettings: s.inspectionSettings,
        loyaltyBalance: s.loyaltyBalance,
        loyaltyHistory: s.loyaltyHistory,
        agentAvailable: s.agentAvailable,
        agentPayouts: s.agentPayouts,
      }),
    },
  ),
);
