"use client";

import { Icon } from "@/components/ui/icon";
import { LANDLORD_ME } from "@/lib/mock-data";
import type { IconName } from "@/lib/icons";

const CHECKS: { icon: IconName; label: string; detail: string }[] = [
  { icon: "user", label: "Identity (NIN)", detail: "Matched & verified" },
  { icon: "phone", label: "Phone number", detail: LANDLORD_ME.phone ?? "—" },
  { icon: "building", label: "Property ownership", detail: "Documents verified" },
  { icon: "cash", label: "Payout account", detail: LANDLORD_ME.bank },
];

export default function LandlordKycPage() {
  return (
    <div style={{ maxWidth: 620 }}>
      <div className="card card-pad row between wrap gap-3" style={{ background: "var(--ok-bg)", border: "none", marginBottom: 20 }}>
        <div className="row gap-3">
          <span className="grid place-items-center" style={{ width: 48, height: 48, borderRadius: 14, background: "var(--ok)", color: "#fff" }}><Icon name="shieldCheck" size={24} strokeWidth={2} /></span>
          <div className="col" style={{ gap: 2 }}>
            <strong style={{ fontSize: 16, color: "var(--ok)" }}>Verified landlord</strong>
            <span style={{ fontSize: 13, color: "var(--ink-2)" }}>Your identity and ownership are confirmed.</span>
          </div>
        </div>
        <span className="tag tag-ok">Verified</span>
      </div>

      <h3 style={{ fontSize: 16, marginBottom: 14 }}>Verification</h3>
      <div className="card">
        {CHECKS.map((c, i) => (
          <div key={c.label} className="row between" style={{ padding: "14px 16px", borderBottom: i < CHECKS.length - 1 ? "1px solid var(--line)" : "none" }}>
            <div className="row gap-3"><Icon name={c.icon} size={18} color="var(--navy-600)" /><div className="col" style={{ gap: 1 }}><strong style={{ fontSize: 14 }}>{c.label}</strong><span style={{ fontSize: 12, color: "var(--muted)" }}>{c.detail}</span></div></div>
            <Icon name="check" size={18} strokeWidth={2.4} color="var(--ok)" />
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12.5, color: "var(--faint)", marginTop: 14 }}>
        {/* TODO(kyc): real ownership verification (C of O / tenancy docs) + NIN check. */}
        Ownership verification requires proof of title. Re-verification may be requested periodically.
      </p>
    </div>
  );
}
