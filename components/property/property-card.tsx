"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { PropImage } from "@/components/shared/prop-image";
import { Naira } from "@/components/shared/naira";
import { TrustBadge } from "@/components/shared/trust-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { useAppStore } from "@/store/app-store";
import { agentById } from "@/lib/mock-data";
import { calculateRentBreakdown } from "@/lib/utils";
import type { Property } from "@/lib/types";

export function PropertyCard({ property }: { property: Property }) {
  const saved = useAppStore((s) => s.savedIds.includes(property.id));
  const toggleSaved = useAppStore((s) => s.toggleSaved);
  const agent = agentById(property.agentId);
  const total = calculateRentBreakdown(property.baseRent, agent?.commissionPct).total;

  return (
    <article className="prop-card" style={{ position: "relative" }}>
      <Link href={`/properties/${property.id}`} aria-label={property.title}>
        <div className="prop-photo">
          <PropImage src={property.images[0]} label={property.imageLabels[0]} className="h-full w-full" sizes="(max-width:720px) 100vw, 340px" />
          <div className="row gap-2" style={{ position: "absolute", top: 12, left: 12 }}>
            {property.available ? (
              <StatusBadge variant="ok">
                <Icon name="check" size={12} strokeWidth={2.4} /> Available
              </StatusBadge>
            ) : (
              <StatusBadge variant="lock">Occupied{property.nextFree ? ` · ${property.nextFree}` : ""}</StatusBadge>
            )}
            {property.badge === "Premium" && <StatusBadge variant="gold">Premium</StatusBadge>}
          </div>
        </div>
      </Link>

      <button
        className="save-btn icon-btn"
        aria-label={saved ? "Remove from saved" : "Save property"}
        onClick={() => toggleSaved(property.id)}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "rgba(255,255,255,.92)",
          color: saved ? "var(--gold-600)" : "var(--ink-2)",
        }}
      >
        <Icon name="bookmark" size={18} strokeWidth={saved ? 2.4 : 1.7} />
      </button>

      <Link href={`/properties/${property.id}`}>
        <div style={{ padding: "14px 16px 16px" }}>
          <div className="row gap-3" style={{ color: "var(--muted)", fontSize: 12.5, fontWeight: 600, marginBottom: 7 }}>
            <span className="row gap-2">
              <Icon name="bed" size={15} /> {property.beds} bed
            </span>
            <span className="row gap-2">
              <Icon name="bath" size={15} /> {property.baths} bath
            </span>
            <span>{property.type}</span>
          </div>
          <h3 style={{ fontSize: 16.5, marginBottom: 4 }}>{property.title}</h3>
          <div className="row gap-2" style={{ color: "var(--muted)", fontSize: 13, marginBottom: 12 }}>
            <Icon name="pin" size={14} /> {property.area} · Near {property.landmark}
          </div>
          <div className="row between">
            <div className="col" style={{ gap: 0 }}>
              <Naira value={total} size={20} />
              <span style={{ fontSize: 11.5, color: "var(--muted)" }}>1st-year, all-in</span>
            </div>
            {agent && <TrustBadge score={agent.trust} sm />}
          </div>
        </div>
      </Link>
    </article>
  );
}
