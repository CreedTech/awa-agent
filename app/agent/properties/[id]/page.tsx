"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { PropImage } from "@/components/shared/prop-image";
import { Naira } from "@/components/shared/naira";
import { PropertyStatusBadge } from "@/components/shared/status-badge";
import { StatCard } from "@/components/shared/stat-card";
import { useAppStore } from "@/store/app-store";
import { AGENT_LISTINGS, agentById } from "@/lib/mock-data";
import { calculateRentBreakdown } from "@/lib/utils";
import { toast } from "sonner";

export default function AgentPropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const property = useAppStore((s) => s.properties.find((p) => p.id === id));
  if (!property) return notFound();

  const listing = AGENT_LISTINGS.find((l) => l.propertyId === id);
  const agent = agentById(property.agentId);
  const breakdown = calculateRentBreakdown(property.baseRent, agent?.commissionPct);

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
        <button className="btn btn-ghost btn-sm" onClick={() => toast("Edit listing (demo)")}><Icon name="settings" size={16} /> Edit listing</button>
        <Link href="/agent/inspection-settings" className="btn btn-ghost btn-sm"><Icon name="calendar" size={16} /> Availability</Link>
        <button className="btn btn-warn btn-sm" onClick={() => toast("Listing paused (demo)")}><Icon name="pause" size={16} /> Pause</button>
        <Link href={`/properties/${property.id}`} className="btn btn-quiet btn-sm"><Icon name="eye" size={16} /> View public page</Link>
      </div>
    </div>
  );
}
