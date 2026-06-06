"use client";

import { Icon } from "@/components/ui/icon";
import { AGENT_ME } from "@/lib/mock-data";
import type { IconName } from "@/lib/icons";

const STEPS: { icon: IconName; label: string; detail: string }[] = [
  { icon: "user", label: "Profile", detail: "Name & contact confirmed" },
  { icon: "phone", label: "Phone OTP", detail: "Number verified" },
  { icon: "shieldCheck", label: "Identity (NIN + liveness)", detail: "NIN matched, selfie passed" },
  { icon: "building", label: "Business info", detail: "Agency details on file" },
  { icon: "cash", label: "Payout account", detail: "Bank account verified" },
  { icon: "gps", label: "Location access", detail: "Granted for inspections" },
];

export default function AgentKycPage() {
  return (
    <div style={{ maxWidth: 620 }}>
      <div className="card card-pad row between wrap gap-3" style={{ background: "var(--ok-bg)", border: "none", marginBottom: 20 }}>
        <div className="row gap-3">
          <span className="grid place-items-center" style={{ width: 48, height: 48, borderRadius: 14, background: "var(--ok)", color: "#fff" }}>
            <Icon name="shieldCheck" size={24} strokeWidth={2} />
          </span>
          <div className="col" style={{ gap: 2 }}>
            <strong style={{ fontSize: 16, color: "var(--ok)" }}>KYC approved</strong>
            <span style={{ fontSize: 13, color: "var(--ink-2)" }}>You&apos;re a verified {AGENT_ME.tier} agent · trust {AGENT_ME.trust}/100</span>
          </div>
        </div>
        <span className="tag tag-ok">Verified</span>
      </div>

      <h3 style={{ fontSize: 16, marginBottom: 14 }}>Verification checklist</h3>
      <div className="card">
        {STEPS.map((s, i) => (
          <div key={s.label} className="row between" style={{ padding: "14px 16px", borderBottom: i < STEPS.length - 1 ? "1px solid var(--line)" : "none" }}>
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

      <p style={{ fontSize: 12.5, color: "var(--faint)", marginTop: 14 }}>
        {/* TODO(smile-identity): real NIN + liveness verification via Smile Identity. */}
        Identity verification is powered by NIN matching and a liveness check. Re-verification is required yearly.
      </p>
    </div>
  );
}
