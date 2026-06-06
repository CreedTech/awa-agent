"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/shared/avatar";
import { TrustBadge } from "@/components/shared/trust-badge";
import { Icon } from "@/components/ui/icon";
import { StatCard } from "@/components/shared/stat-card";
import { AGENT_ME, AGENT_EARNINGS } from "@/lib/mock-data";
import { useAuthStore } from "@/store/auth-store";
import { formatCurrency } from "@/lib/utils";

export default function AgentProfilePage() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="card card-pad row gap-4 wrap" style={{ alignItems: "center", marginBottom: 18 }}>
        <Avatar name={AGENT_ME.name} photo={AGENT_ME.photo} size={64} gold />
        <div className="col grow" style={{ gap: 4 }}>
          <h2 style={{ fontSize: 20 }}>{AGENT_ME.name}</h2>
          <span className="row gap-2" style={{ fontSize: 13, color: "var(--muted)" }}>
            <Icon name="pin" size={14} /> {AGENT_ME.area} · {AGENT_ME.id} · since {AGENT_ME.since}
          </span>
          <span className="row gap-2" style={{ fontSize: 12.5, color: "var(--ok)", fontWeight: 600 }}>
            <Icon name="shieldCheck" size={14} strokeWidth={2} /> {AGENT_ME.tier} · NIN verified
          </span>
        </div>
        <TrustBadge score={AGENT_ME.trust} />
      </div>

      <div className="stats-grid">
        <StatCard label="Completed deals" value={AGENT_ME.deals} icon="check" />
        <StatCard label="Commission rate" value={`${AGENT_ME.commissionPct}%`} icon="coins" hint="High-trust tier" />
        <StatCard label="Available balance" value={formatCurrency(AGENT_EARNINGS.available)} icon="wallet" />
        <StatCard label="Trust score" value={`${AGENT_ME.trust}/100`} icon="star" />
      </div>

      <div className="card" style={{ marginTop: 4 }}>
        {[
          { icon: "cash", label: "Payout account", hint: "GTBank · ••••92", href: "/agent/earnings" },
          { icon: "shield", label: "KYC status", hint: "Verified", href: "/agent/kyc" },
          { icon: "bell", label: "Notifications", hint: "Email & in-app", href: "/agent/dashboard" },
          { icon: "settings", label: "Inspection settings", hint: "Manage availability", href: "/agent/inspection-settings" },
        ].map((it, i, arr) => (
          <Link key={it.label} href={it.href} className="row between" style={{ width: "100%", padding: "14px 16px", borderBottom: i < arr.length - 1 ? "1px solid var(--line)" : "none" }}>
            <span className="row gap-3">
              <Icon name={it.icon as never} size={18} color="var(--navy-600)" />
              <span className="col" style={{ alignItems: "flex-start", gap: 1 }}>
                <strong style={{ fontSize: 14 }}>{it.label}</strong>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>{it.hint}</span>
              </span>
            </span>
            <Icon name="chevR" size={16} color="var(--faint)" />
          </Link>
        ))}
      </div>

      <button className="btn btn-danger btn-block" style={{ marginTop: 18 }} onClick={() => { logout(); router.push("/"); }}>
        <Icon name="logout" size={17} /> Log out
      </button>
    </div>
  );
}
