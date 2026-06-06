"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { useAppStore } from "@/store/app-store";
import { useShallow } from "zustand/react/shallow";
import { AGENT_LISTINGS, AGENT_ME, propertyById } from "@/lib/mock-data";

export default function LandlordAuthorizationsPage() {
  const added = useAppStore(useShallow((s) => s.properties.filter((p) => p.agentId === AGENT_ME.id && p.id.startsWith("p-") && p.status === "AWAITING_LANDLORD_AUTHORIZATION")));

  const rows = [
    ...AGENT_LISTINGS.filter((l) => l.status === "PENDING_AUTH").map((l) => ({
      id: l.propertyId, title: propertyById(l.propertyId)?.title ?? l.propertyId, landlord: l.landlord ?? "Landlord", status: "PENDING" as const,
    })),
    ...added.map((p) => ({ id: p.id, title: p.title, landlord: "Requested landlord", status: "PENDING" as const })),
  ];

  return (
    <>
      <p style={{ color: "var(--muted)", fontSize: 14.5, marginBottom: 18 }}>
        Before a listing goes live it must be authorized by its landlord. Track your requests here.
      </p>
      {rows.length === 0 ? (
        <EmptyState icon="shieldCheck" title="No pending authorizations" description="All your listings are authorized. Add a new property to request authorization." action={{ label: "Add property", href: "/agent/properties/new" }} />
      ) : (
        <div className="col gap-3" style={{ maxWidth: 620 }}>
          {rows.map((r) => (
            <div key={r.id} className="card card-pad row between" style={{ alignItems: "center" }}>
              <div className="row gap-3">
                <span className="grid place-items-center" style={{ width: 40, height: 40, borderRadius: 11, background: "var(--warn-bg)", color: "var(--warn)" }}>
                  <Icon name="clock" size={18} />
                </span>
                <div className="col" style={{ gap: 2 }}>
                  <strong style={{ fontSize: 14.5 }}>{r.title}</strong>
                  <span style={{ fontSize: 12.5, color: "var(--muted)" }}>To: {r.landlord}</span>
                </div>
              </div>
              <StatusBadge variant="warn">Awaiting landlord</StatusBadge>
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: 18 }}>
        <Link href="/agent/properties/new" className="btn btn-ghost btn-sm"><Icon name="plus" size={16} /> Request a new authorization</Link>
      </div>
    </>
  );
}
