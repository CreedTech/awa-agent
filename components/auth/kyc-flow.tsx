"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Field } from "@/components/shared/field";
import { FileDrop } from "@/components/shared/file-drop";
import { useAuthStore } from "@/store/auth-store";
import { useAccountsStore } from "@/store/accounts-store";
import { useAppStore } from "@/store/app-store";
import type { IconName } from "@/lib/icons";
import { toast } from "sonner";

const REVIEW_MS = 6000;

// Module-level guard so a scheduled review survives client-side navigation
// and never double-fires within a session.
const scheduled = new Set<string>();

const STEPS: Record<"agent" | "landlord", { icon: IconName; label: string; detail: string }[]> = {
  agent: [
    { icon: "user", label: "Profile", detail: "Name & contact confirmed" },
    { icon: "phone", label: "Phone OTP", detail: "Number verified" },
    { icon: "shieldCheck", label: "Identity (NIN + liveness)", detail: "NIN matched, selfie passed" },
    { icon: "building", label: "Business info", detail: "Agency details on file" },
    { icon: "cash", label: "Payout account", detail: "Bank account verified" },
    { icon: "gps", label: "Location access", detail: "Granted for inspections" },
  ],
  landlord: [
    { icon: "user", label: "Identity (NIN)", detail: "Matched & verified" },
    { icon: "phone", label: "Phone number", detail: "Verified" },
    { icon: "building", label: "Property ownership", detail: "Documents verified" },
    { icon: "cash", label: "Payout account", detail: "Bank account verified" },
  ],
};

export function KycFlow({ role }: { role: "agent" | "landlord" }) {
  const account = useAuthStore((s) => s.account);
  const setSessionKyc = useAuthStore((s) => s.setSessionKyc);
  const setKyc = useAccountsStore((s) => s.setKyc);
  const submitKycRecord = useAppStore((s) => s.submitKycRecord);
  const pushNotification = useAppStore((s) => s.pushNotification);

  const status = account?.kycStatus ?? "UNVERIFIED";
  const steps = STEPS[role];

  const [nin, setNin] = useState("");
  const [ninError, setNinError] = useState<string | null>(null);

  const completeReview = (accountId: string) => {
    setKyc(accountId, "VERIFIED");
    // Only flip the session if it's still the logged-in account.
    if (useAuthStore.getState().account?.id === accountId) setSessionKyc("VERIFIED");
    pushNotification({ kind: "kyc_update", title: "KYC approved", body: "Your identity is verified. You're fully set up." });
    toast.success("KYC approved");
  };

  const scheduleReview = (accountId: string) => {
    if (scheduled.has(accountId)) return;
    scheduled.add(accountId);
    setTimeout(() => {
      scheduled.delete(accountId);
      completeReview(accountId);
    }, REVIEW_MS);
  };

  // If we land here already pending (e.g. after a reload), keep the review going.
  useEffect(() => {
    if (status === "PENDING" && account) scheduleReview(account.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, account?.id]);

  const submit = () => {
    if (!account) return;
    if (!/^\d{11}$/.test(nin.replace(/\s/g, ""))) {
      setNinError("NIN must be 11 digits");
      return;
    }
    setKyc(account.id, "PENDING");
    setSessionKyc("PENDING");
    submitKycRecord({ name: account.name, role, phone: account.phone, nin });
    scheduleReview(account.id);
    toast("Submitted for review");
  };

  /* ---- Verified ---- */
  if (status === "VERIFIED") {
    return (
      <div style={{ maxWidth: 620 }}>
        <div className="card card-pad row between wrap gap-3" style={{ background: "var(--ok-bg)", border: "none", marginBottom: 20 }}>
          <div className="row gap-3">
            <span className="grid place-items-center" style={{ width: 48, height: 48, borderRadius: 14, background: "var(--ok)", color: "#fff" }}>
              <Icon name="shieldCheck" size={24} strokeWidth={2} />
            </span>
            <div className="col" style={{ gap: 2 }}>
              <strong style={{ fontSize: 16, color: "var(--ok)" }}>KYC approved</strong>
              <span style={{ fontSize: 13, color: "var(--ink-2)" }}>You are a verified {role}.</span>
            </div>
          </div>
          <span className="tag tag-ok">Verified</span>
        </div>
        <h3 style={{ fontSize: 16, marginBottom: 14 }}>Verification checklist</h3>
        <div className="card">
          {steps.map((s, i) => (
            <div key={s.label} className="row between" style={{ padding: "14px 16px", borderBottom: i < steps.length - 1 ? "1px solid var(--line)" : "none" }}>
              <div className="row gap-3">
                <Icon name={s.icon} size={18} color="var(--navy-600)" />
                <div className="col" style={{ gap: 1 }}>
                  <strong style={{ fontSize: 14 }}>{s.label}</strong>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{s.detail}</span>
                </div>
              </div>
              <Icon name="check" size={18} strokeWidth={2.4} color="var(--ok)" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ---- Pending ---- */
  if (status === "PENDING") {
    return (
      <div style={{ maxWidth: 620 }}>
        <div className="card card-pad row between wrap gap-3" style={{ background: "var(--warn-bg)", border: "none", marginBottom: 20 }}>
          <div className="row gap-3">
            <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
            <div className="col" style={{ gap: 2 }}>
              <strong style={{ fontSize: 16, color: "var(--warn)" }}>Verification in progress</strong>
              <span style={{ fontSize: 13, color: "var(--ink-2)" }}>We are checking your NIN and details. This usually takes a moment.</span>
            </div>
          </div>
          <span className="tag tag-warn">Pending</span>
        </div>
        <div className="card">
          {steps.map((s, i) => (
            <div key={s.label} className="row between" style={{ padding: "14px 16px", borderBottom: i < steps.length - 1 ? "1px solid var(--line)" : "none" }}>
              <div className="row gap-3">
                <Icon name={s.icon} size={18} color="var(--navy-600)" />
                <strong style={{ fontSize: 14 }}>{s.label}</strong>
              </div>
              <Icon name="clock" size={16} color="var(--warn)" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ---- Unverified / rejected: start verification ---- */
  return (
    <div style={{ maxWidth: 560 }}>
      {status === "REJECTED" && (
        <div className="row gap-2" style={{ background: "var(--danger-bg)", color: "var(--danger)", padding: "10px 13px", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>
          <Icon name="alert" size={16} /> Your last submission was rejected. Please re-submit with a valid NIN.
        </div>
      )}
      <p style={{ color: "var(--muted)", fontSize: 14.5, marginBottom: 18 }}>
        Verify your identity to {role === "agent" ? "list properties and run inspections" : "list and manage your properties"}.
        {/* TODO(smile-identity): real NIN + liveness via Smile Identity. */}
      </p>
      <div className="card card-pad col gap-4">
        <Field label="National Identification Number (NIN)" icon="shield" error={ninError ?? undefined}>
          <input className="input" inputMode="numeric" placeholder="12345678901" value={nin} onChange={(e) => { setNin(e.target.value); setNinError(null); }} />
        </Field>
        <div className="field">
          <span className="label">{role === "agent" ? "Liveness selfie" : "Proof of ownership"}</span>
          <FileDrop label={role === "agent" ? "Upload a selfie" : "Upload C of O / tenancy agreement"} accept="image/*,application/pdf" multiple={false} />
        </div>
        <button className="btn btn-primary btn-block btn-lg" onClick={submit}>
          <Icon name="shieldCheck" size={18} /> Submit for verification
        </button>
        <span style={{ fontSize: 12, color: "var(--faint)", textAlign: "center" }}>Demo: enter any 11 digits. Review completes automatically.</span>
      </div>
    </div>
  );
}
