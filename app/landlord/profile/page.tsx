"use client";

import { useRouter } from "next/navigation";
import { Avatar } from "@/components/shared/avatar";
import { Icon } from "@/components/ui/icon";
import { StatCard } from "@/components/shared/stat-card";
import { LANDLORD_ME, LANDLORD_STATS } from "@/lib/mock-data";
import { useAuthStore } from "@/store/auth-store";
import { formatCurrency } from "@/lib/utils";

export default function LandlordProfilePage() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="card card-pad row gap-4 wrap" style={{ alignItems: "center", marginBottom: 18 }}>
        <Avatar name={LANDLORD_ME.name} photo={LANDLORD_ME.photo} size={64} />
        <div className="col grow" style={{ gap: 4 }}>
          <h2 style={{ fontSize: 20 }}>{LANDLORD_ME.name}</h2>
          <span className="row gap-2" style={{ fontSize: 13, color: "var(--muted)" }}><Icon name="building" size={14} /> {LANDLORD_ME.id} · {LANDLORD_ME.properties} properties · since {LANDLORD_ME.joined}</span>
          <span className="row gap-2" style={{ fontSize: 12.5, color: "var(--ok)", fontWeight: 600 }}><Icon name="shieldCheck" size={14} strokeWidth={2} /> NIN verified · {LANDLORD_ME.bank}</span>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Rent collected" value={formatCurrency(LANDLORD_STATS.totalRentPaid)} icon="cash" />
        <StatCard label="Properties" value={LANDLORD_ME.properties} icon="building" />
        <StatCard label="Active tenants" value={LANDLORD_ME.tenants} icon="user" />
      </div>

      <div className="card" style={{ marginTop: 4 }}>
        {[
          { icon: "cash", label: "Payout account", hint: LANDLORD_ME.bank },
          { icon: "shield", label: "KYC & ownership", hint: "Verified" },
          { icon: "bell", label: "Notifications", hint: "Email & in-app" },
        ].map((it, i, arr) => (
          <button key={it.label} className="row between" style={{ width: "100%", padding: "14px 16px", borderBottom: i < arr.length - 1 ? "1px solid var(--line)" : "none" }}>
            <span className="row gap-3"><Icon name={it.icon as never} size={18} color="var(--navy-600)" /><span className="col" style={{ alignItems: "flex-start", gap: 1 }}><strong style={{ fontSize: 14 }}>{it.label}</strong><span style={{ fontSize: 12, color: "var(--muted)" }}>{it.hint}</span></span></span>
            <Icon name="chevR" size={16} color="var(--faint)" />
          </button>
        ))}
      </div>

      <button className="btn btn-danger btn-block" style={{ marginTop: 18 }} onClick={() => { logout(); router.push("/"); }}>
        <Icon name="logout" size={17} /> Log out
      </button>
    </div>
  );
}
