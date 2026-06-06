"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { PropImage } from "@/components/shared/prop-image";
import { Naira } from "@/components/shared/naira";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { useAppStore } from "@/store/app-store";
import { useShallow } from "zustand/react/shallow";
import { AGENT_LISTINGS, AGENT_ME, propertyById } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const STATUS_MAP = {
  ACTIVE: { v: "ok", label: "Live", filter: "Live" },
  BOOKED: { v: "lock", label: "Booked", filter: "Occupied" },
  PENDING_AUTH: { v: "warn", label: "Awaiting landlord", filter: "Pending" },
  PENDING_ADMIN: { v: "warn", label: "Awaiting review", filter: "Pending" },
  OCCUPIED: { v: "lock", label: "Occupied", filter: "Occupied" },
  PAUSED: { v: "navy", label: "Paused", filter: "Paused" },
} as const;

const FILTERS = ["All", "Live", "Pending", "Occupied"];

export default function AgentPropertiesPage() {
  const added = useAppStore(useShallow((s) => s.properties.filter((p) => p.agentId === AGENT_ME.id && p.id.startsWith("p-"))));
  const [filter, setFilter] = useState("All");

  // Seeded listings + any newly added properties (Awaiting review).
  const listings = [
    ...AGENT_LISTINGS.map((l) => ({ ...l, prop: propertyById(l.propertyId) })),
    ...added.map((p) => ({ propertyId: p.id, status: "PENDING_ADMIN" as const, views: 0, bookmarks: 0, inspections: 0, prop: p })),
  ];

  const filtered = listings.filter((l) => filter === "All" || STATUS_MAP[l.status].filter === filter);

  return (
    <>
      <div className="row between wrap gap-3" style={{ marginBottom: 18 }}>
        <div className="row wrap gap-2">
          {FILTERS.map((f) => (
            <button key={f} className={cn("chip", filter === f && "is-active")} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <Link href="/agent/properties/new" className="btn btn-primary btn-sm"><Icon name="plus" size={16} /> Add property</Link>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="building" title="No properties here" description="Add your first listing to start earning. Every listing needs landlord authorization and admin approval before going live." action={{ label: "Add property", href: "/agent/properties/new" }} />
      ) : (
        <div className="card-grid">
          {filtered.map((l) => {
            const st = STATUS_MAP[l.status];
            return (
              <Link key={l.propertyId} href={`/agent/properties/${l.propertyId}`} className="prop-card" style={{ position: "relative" }}>
                <div className="prop-photo">
                  <PropImage src={l.prop?.images[0]} label={l.prop?.imageLabels[0]} className="h-full w-full" sizes="300px" />
                  <div style={{ position: "absolute", top: 12, left: 12 }}><StatusBadge variant={st.v}>{st.label}</StatusBadge></div>
                </div>
                <div style={{ padding: "14px 16px" }}>
                  <strong style={{ fontSize: 15 }}>{l.prop?.title}</strong>
                  <div className="row between" style={{ marginTop: 8 }}>
                    {l.prop && <Naira value={l.prop.baseRent} size={16} sub="/yr base" />}
                    <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{l.views} views · {l.inspections} insp.</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
