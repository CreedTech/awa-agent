"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { PropImage } from "@/components/shared/prop-image";
import { Naira } from "@/components/shared/naira";
import { StatusBadge } from "@/components/shared/status-badge";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

const STATUS = { LIVE: { v: "ok", f: "Live" }, OCCUPIED: { v: "lock", f: "Occupied" }, PENDING_ADMIN: { v: "warn", f: "Pending" }, PAUSED: { v: "navy", f: "Paused" } } as const;
const FILTERS = ["All", "Live", "Occupied", "Pending"];

export default function LandlordPropertiesPage() {
  const properties = useAppStore((s) => s.landlordProperties);
  const [filter, setFilter] = useState("All");
  const filtered = properties.filter((p) => filter === "All" || STATUS[p.status].f === filter || (filter === "Live" && p.status === "LIVE"));

  return (
    <>
      <div className="row between wrap gap-3" style={{ marginBottom: 18 }}>
        <div className="row wrap gap-2">
          {FILTERS.map((f) => <button key={f} className={cn("chip", filter === f && "is-active")} onClick={() => setFilter(f)}>{f}</button>)}
        </div>
        <Link href="/landlord/properties/new" className="btn btn-primary btn-sm"><Icon name="plus" size={16} /> Add property</Link>
      </div>

      <div className="card-grid">
        {filtered.map((p) => {
          const st = STATUS[p.status];
          const activeAgents = p.agents.filter((a) => a.status === "AUTHORIZED").length;
          return (
            <Link key={p.id} href={`/landlord/properties/${p.id}`} className="prop-card" style={{ position: "relative" }}>
              <div className="prop-photo" style={{ aspectRatio: "16/9" }}>
                <PropImage src={p.img} label={p.title} className="h-full w-full" sizes="320px" />
                <div style={{ position: "absolute", top: 12, left: 12 }}><StatusBadge variant={st.v}>{st.f}</StatusBadge></div>
              </div>
              <div style={{ padding: "14px 16px" }} className="col gap-2">
                <strong style={{ fontSize: 15 }}>{p.title}</strong>
                <div className="row between">
                  <Naira value={p.baseRent} size={16} sub="/yr" />
                  <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{p.views} views</span>
                </div>
                <div className="row gap-3" style={{ fontSize: 12.5, color: "var(--muted)" }}>
                  <span className="row gap-2"><Icon name="users" size={14} /> {activeAgents}/{p.maxAgents} agents</span>
                  {p.tenant && <span className="row gap-2"><Icon name="user" size={14} /> {p.tenant}</span>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
