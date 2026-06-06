"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { PropImage } from "@/components/shared/prop-image";
import { InspectionBadge } from "@/components/shared/status-badge";
import { Icon } from "@/components/ui/icon";
import { useAppStore } from "@/store/app-store";
import { useShallow } from "zustand/react/shallow";
import { propertyById } from "@/lib/mock-data";

const TENANT = "Bisi Akande";

export default function TenantInspectionsPage() {
  const inspections = useAppStore(useShallow((s) => s.inspections.filter((i) => i.tenantName === TENANT)));

  return (
    <div className="page page-narrow">
      <PageHeader title="Inspections" subtitle="Your booked viewings and meeting codes." />

      {inspections.length === 0 ? (
        <EmptyState
          icon="calendar"
          title="No inspections booked"
          description="Find a home you like and request an inspection - you'll get a 6-digit code to meet the agent safely."
          action={{ label: "Explore homes", href: "/explore" }}
        />
      ) : (
        <div className="col gap-3">
          {inspections.map((i) => {
            const prop = propertyById(i.propertyId);
            return (
              <Link key={i.id} href={`/tenant/inspections/${i.id}`} className="card card-pad row gap-4" style={{ alignItems: "center" }}>
                <PropImage src={prop?.images[0]} label={prop?.imageLabels[0]} className="h-16 w-20 rounded-xl" sizes="80px" />
                <div className="col grow" style={{ gap: 4 }}>
                  <strong style={{ fontSize: 15 }}>{prop?.title}</strong>
                  <span className="row gap-2" style={{ fontSize: 13, color: "var(--muted)" }}>
                    <Icon name="calendar" size={14} /> {i.date} · {i.time}
                  </span>
                  <span className="row gap-2" style={{ fontSize: 12.5, color: "var(--muted)" }}>
                    <Icon name="pin" size={13} /> Near {prop?.landmark}
                  </span>
                </div>
                <div className="col" style={{ alignItems: "flex-end", gap: 8 }}>
                  <InspectionBadge status={i.status} />
                  <Icon name="chevR" size={18} color="var(--faint)" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
