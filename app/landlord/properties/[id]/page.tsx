"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { PropImage } from "@/components/shared/prop-image";
import { Naira } from "@/components/shared/naira";
import { Avatar } from "@/components/shared/avatar";
import { TrustBadge } from "@/components/shared/trust-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatCard } from "@/components/shared/stat-card";
import { useAppStore } from "@/store/app-store";
import { toast } from "sonner";
import type { BadgeVariant } from "@/lib/constants";

const STATUS: Record<string, BadgeVariant> = { LIVE: "ok", OCCUPIED: "lock", PENDING_ADMIN: "warn", PAUSED: "navy" };

export default function LandlordPropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const prop = useAppStore((s) => s.landlordProperties.find((p) => p.id === id));
  if (!prop) return notFound();

  return (
    <div style={{ maxWidth: 820 }}>
      <Link href="/landlord/properties" className="row gap-2" style={{ color: "var(--muted)", fontSize: 14, marginBottom: 14 }}><Icon name="arrowL" size={16} /> All properties</Link>

      <div className="card" style={{ overflow: "hidden", marginBottom: 18 }}>
        <PropImage src={prop.img} label={prop.title} className="h-52 w-full" sizes="820px" />
        <div className="card-pad row between wrap gap-3">
          <div className="col gap-2">
            <h2 style={{ fontSize: 22 }}>{prop.title}</h2>
            <span className="row gap-2" style={{ color: "var(--muted)", fontSize: 14 }}><Icon name="pin" size={15} /> {prop.area} · Near {prop.landmark}</span>
            <Naira value={prop.baseRent} size={20} sub="/yr base" />
          </div>
          <StatusBadge variant={STATUS[prop.status]}>{prop.status.replace("_", " ")}</StatusBadge>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Views" value={prop.views} icon="eye" />
        <StatCard label="Inspections" value={prop.inspections} icon="calendar" />
        <StatCard label="Days to let" value={prop.daysToLet ?? "—"} icon="clock" />
        <StatCard label="Tenant" value={prop.tenant ?? "Vacant"} icon="user" />
      </div>

      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <div className="row between" style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 16 }}>Authorized agents ({prop.agents.filter((a) => a.status === "AUTHORIZED").length}/{prop.maxAgents})</h3>
          <Link href="/landlord/agent-matrix" className="btn btn-ghost btn-sm">Manage matrix</Link>
        </div>
        <div className="col gap-2">
          {prop.agents.map((a) => (
            <div key={a.id} className="row between" style={{ padding: "8px 0" }}>
              <div className="row gap-3"><Avatar name={a.name} photo={a.photo} size={36} /><div className="col" style={{ gap: 1 }}><strong style={{ fontSize: 13.5 }}>{a.name}</strong><span style={{ fontSize: 12, color: "var(--muted)" }}>{a.commission}% · {a.deals} deals</span></div></div>
              <div className="row gap-2">{a.role === "PRIMARY" && <span className="tag tag-gold">Primary</span>}<TrustBadge score={a.trust} sm /></div>
            </div>
          ))}
        </div>
      </div>

      <div className="row wrap gap-2">
        <Link href="/landlord/agent-matrix" className="btn btn-primary btn-sm"><Icon name="users" size={16} /> Agent matrix</Link>
        <button className="btn btn-warn btn-sm" onClick={() => toast("Property paused (demo)")}><Icon name="pause" size={16} /> Pause listing</button>
        <Link href={`/properties/p1`} className="btn btn-quiet btn-sm"><Icon name="eye" size={16} /> View public</Link>
      </div>
    </div>
  );
}
