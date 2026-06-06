"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { PropImage } from "@/components/shared/prop-image";
import { Naira } from "@/components/shared/naira";
import { PropertyStatusBadge } from "@/components/shared/status-badge";
import { StatCard } from "@/components/shared/stat-card";
import { BottomSheet } from "@/components/shared/bottom-sheet";
import { Field } from "@/components/shared/field";
import { useAppStore } from "@/store/app-store";
import { AGENT_LISTINGS, agentById } from "@/lib/mock-data";
import { calculateRentBreakdown } from "@/lib/utils";
import { toast } from "sonner";

export default function AgentPropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const property = useAppStore((s) => s.properties.find((p) => p.id === id));
  const updateProperty = useAppStore((s) => s.updateProperty);
  const setPropertyStatus = useAppStore((s) => s.setPropertyStatus);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [baseRent, setBaseRent] = useState(0);

  if (!property) return notFound();

  const listing = AGENT_LISTINGS.find((l) => l.propertyId === id);
  const agent = agentById(property.agentId);
  const breakdown = calculateRentBreakdown(property.baseRent, agent?.commissionPct);
  const paused = property.status === "PAUSED";

  const openEdit = () => {
    setTitle(property.title);
    setBaseRent(property.baseRent);
    setEditing(true);
  };

  const saveEdit = () => {
    if (title.trim().length < 4) { toast.error("Title is too short"); return; }
    updateProperty(property.id, { title: title.trim(), baseRent });
    toast.success("Listing updated");
    setEditing(false);
  };

  const togglePause = () => {
    const next = paused ? "LIVE" : "PAUSED";
    setPropertyStatus(property.id, next);
    toast(next === "PAUSED" ? "Listing paused - hidden from tenants" : "Listing is live again");
  };

  return (
    <div style={{ maxWidth: 760 }}>
      <Link href="/agent/properties" className="row gap-2" style={{ color: "var(--muted)", fontSize: 14, marginBottom: 14 }}>
        <Icon name="arrowL" size={16} /> All properties
      </Link>

      <div className="card" style={{ overflow: "hidden", marginBottom: 18 }}>
        <PropImage src={property.images[0]} label={property.imageLabels[0]} className="h-52 w-full" sizes="760px" />
        <div className="card-pad">
          <div className="row between wrap gap-3">
            <div className="col gap-2">
              <h2 style={{ fontSize: 22 }}>{property.title}</h2>
              <span className="row gap-2" style={{ color: "var(--muted)", fontSize: 14 }}><Icon name="pin" size={15} /> {property.area} · Near {property.landmark}</span>
            </div>
            <PropertyStatusBadge status={property.status} />
          </div>
          <div className="row gap-4 wrap" style={{ marginTop: 14, alignItems: "center" }}>
            <Naira value={property.baseRent} size={22} sub="/yr base" />
            <span style={{ color: "var(--line-2)" }}>·</span>
            <span style={{ fontSize: 14, color: "var(--muted)" }}>Tenant all-in <Naira value={breakdown.total} size={15} /></span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Views" value={listing?.views ?? property.views} icon="eye" />
        <StatCard label="Bookmarks" value={listing?.bookmarks ?? property.bookmarks} icon="bookmark" />
        <StatCard label="Inspections" value={listing?.inspections ?? 0} icon="calendar" />
        <StatCard label="Commission" value={`${agent?.commissionPct ?? 9}%`} icon="coins" />
      </div>

      <div className="card card-pad" style={{ marginBottom: 18 }}>
        <h3 style={{ fontSize: 16, marginBottom: 12 }}>Amenities</h3>
        <div className="row wrap gap-2">
          {property.amenities.map((a) => <span key={a} className="chip"><Icon name="check" size={13} strokeWidth={2.2} color="var(--ok)" /> {a}</span>)}
        </div>
      </div>

      <div className="row wrap gap-2">
        <button className="btn btn-ghost btn-sm" onClick={openEdit}><Icon name="settings" size={16} /> Edit listing</button>
        <Link href="/agent/inspection-settings" className="btn btn-ghost btn-sm"><Icon name="calendar" size={16} /> Availability</Link>
        <button className={`btn btn-sm ${paused ? "btn-ok" : "btn-warn"}`} onClick={togglePause}>
          <Icon name={paused ? "check" : "pause"} size={16} /> {paused ? "Resume listing" : "Pause"}
        </button>
        <Link href={`/properties/${property.id}`} className="btn btn-quiet btn-sm"><Icon name="eye" size={16} /> View public page</Link>
      </div>

      <BottomSheet open={editing} onClose={() => setEditing(false)} title="Edit listing" maxWidth={440}>
        <div className="col gap-4" style={{ padding: "8px 20px 24px" }}>
          <Field label="Listing title"><input className="input" value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
          <div className="field">
            <span className="label row between"><span>Base rent (annual)</span><Naira value={baseRent} size={15} color="var(--navy-700)" /></span>
            <input type="range" className="range" min={80000} max={2500000} step={20000} value={baseRent} onChange={(e) => setBaseRent(Number(e.target.value))} />
            <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Tenant all-in becomes <Naira value={calculateRentBreakdown(baseRent, agent?.commissionPct).total} size={13} /></span>
          </div>
          <button className="btn btn-primary btn-block btn-lg" onClick={saveEdit}>Save changes</button>
        </div>
      </BottomSheet>
    </div>
  );
}
