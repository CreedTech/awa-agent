"use client";

import { StatCard } from "@/components/shared/stat-card";
import { BarSeriesChart } from "@/components/charts/mini-charts";
import { useAppStore } from "@/store/app-store";
import { LANDLORD_STATS } from "@/lib/mock-data";

export default function LandlordInspectionsPage() {
  const properties = useAppStore((s) => s.landlordProperties);

  return (
    <>
      <div className="stats-grid">
        <StatCard label="Total inspections" value={LANDLORD_STATS.totalInspections} icon="calendar" />
        <StatCard label="Avg days to let" value={LANDLORD_STATS.avgDaysToLet} icon="clock" />
        <StatCard label="Occupied" value={LANDLORD_STATS.occupiedCount} icon="key" />
      </div>

      <h3 style={{ fontSize: 16, marginBottom: 12 }}>Inspections by property</h3>
      <div className="card card-pad" style={{ marginBottom: 20 }}>
        <BarSeriesChart data={properties.map((p) => ({ label: p.title.split("—")[0].trim().slice(0, 10), value: p.inspections }))} height={240} />
      </div>

      <div className="card-grid">
        {properties.map((p) => (
          <div key={p.id} className="card card-pad col gap-3">
            <strong style={{ fontSize: 14.5 }}>{p.title}</strong>
            <div className="drawer-grid">
              {[["Views", p.views], ["Inspections", p.inspections], ["Days to let", p.daysToLet ?? "—"], ["Agents", p.agents.length]].map(([k, v]) => (
                <div key={k as string} className="col" style={{ gap: 1 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20 }}>{v}</span>
                  <span style={{ fontSize: 11.5, color: "var(--muted)" }}>{k}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
