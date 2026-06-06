"use client";

import { useRouter } from "next/navigation";
import { Avatar } from "@/components/shared/avatar";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/shared/page-header";
import { TRUST_EVENTS, TENANT_ME } from "@/lib/mock-data";
import { useAuthStore } from "@/store/auth-store";
import type { IconName } from "@/lib/icons";

const SETTINGS: { group: string; items: { icon: IconName; label: string; hint: string }[] }[] = [
  { group: "Security", items: [{ icon: "lock", label: "Password & 2FA", hint: "Last changed 2 months ago" }, { icon: "shieldCheck", label: "NIN verification", hint: "Verified" }] },
  { group: "Preferences", items: [{ icon: "bell", label: "Notifications", hint: "Email & in-app" }, { icon: "explore", label: "Search preferences", hint: "Ibadan · 2 bed" }] },
  { group: "Support", items: [{ icon: "chat", label: "Help centre", hint: "Get answers fast" }, { icon: "shield", label: "Trust & Safety", hint: "How we protect you" }] },
];

export default function TenantProfilePage() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const score = TENANT_ME.trustScore ?? 0;

  return (
    <div className="page page-narrow">
      <PageHeader title="Account" />

      {/* Identity */}
      <div className="card card-pad row gap-4 wrap" style={{ alignItems: "center", marginBottom: 18 }}>
        <Avatar name={TENANT_ME.name} photo={TENANT_ME.photo} size={64} gold />
        <div className="col grow" style={{ gap: 3 }}>
          <h2 style={{ fontSize: 20 }}>{TENANT_ME.name}</h2>
          <span className="row gap-2" style={{ fontSize: 13, color: "var(--muted)" }}>
            <Icon name="pin" size={14} /> {TENANT_ME.city} · Joined {TENANT_ME.joined}
          </span>
          <span className="row gap-2" style={{ fontSize: 12.5, color: "var(--ok)", fontWeight: 600 }}>
            <Icon name="shieldCheck" size={14} strokeWidth={2} /> NIN verified · Basic member
          </span>
        </div>
      </div>

      {/* Trust score */}
      <div className="card card-pad" style={{ marginBottom: 18 }}>
        <div className="row between" style={{ marginBottom: 14 }}>
          <h3 style={{ fontSize: 16 }}>Trust score</h3>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "var(--gold-600)" }}>{score}<span style={{ fontSize: 14, color: "var(--muted)" }}>/100</span></span>
        </div>
        <div style={{ height: 8, borderRadius: 99, background: "var(--paper-2)", overflow: "hidden" }}>
          <div style={{ width: `${score}%`, height: "100%", background: "linear-gradient(90deg, var(--gold-400), var(--gold-600))" }} />
        </div>
        <div className="col gap-2" style={{ marginTop: 14 }}>
          {TRUST_EVENTS.map((e) => (
            <div key={e.id} className="row between" style={{ fontSize: 13.5 }}>
              <span className="row gap-2"><Icon name="check" size={14} strokeWidth={2.2} color="var(--ok)" /> {e.label}</span>
              <span style={{ color: "var(--ok)", fontWeight: 700 }}>+{e.points}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      {SETTINGS.map((s) => (
        <div key={s.group} style={{ marginBottom: 16 }}>
          <span className="label" style={{ display: "block", marginBottom: 8 }}>{s.group}</span>
          <div className="card">
            {s.items.map((it, idx) => (
              <button key={it.label} className="row between" style={{ width: "100%", padding: "14px 16px", borderBottom: idx < s.items.length - 1 ? "1px solid var(--line)" : "none" }}>
                <span className="row gap-3">
                  <Icon name={it.icon} size={18} color="var(--navy-600)" />
                  <span className="col" style={{ alignItems: "flex-start", gap: 1 }}>
                    <strong style={{ fontSize: 14 }}>{it.label}</strong>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>{it.hint}</span>
                  </span>
                </span>
                <Icon name="chevR" size={16} color="var(--faint)" />
              </button>
            ))}
          </div>
        </div>
      ))}

      <button className="btn btn-danger btn-block" onClick={() => { logout(); router.push("/"); }}>
        <Icon name="logout" size={17} /> Log out
      </button>
    </div>
  );
}
