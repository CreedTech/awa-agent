"use client";

import { Icon } from "@/components/ui/icon";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function InspectionSettingsPage() {
  const settings = useAppStore((s) => s.inspectionSettings);
  const update = useAppStore((s) => s.setInspectionSettings);

  return (
    <div style={{ maxWidth: 620 }}>
      <p style={{ color: "var(--muted)", fontSize: 14.5, marginBottom: 18 }}>
        Control when tenants can book inspections with you across all your listings.
      </p>

      <div className="card card-pad row between" style={{ marginBottom: 16 }}>
        <div className="col" style={{ gap: 2 }}>
          <strong style={{ fontSize: 15 }}>Accept inspections</strong>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>Master switch for all your properties</span>
        </div>
        <Switch checked={settings.enabled} onCheckedChange={(v) => { update({ enabled: v }); toast(v ? "Inspections enabled" : "Inspections paused"); }} />
      </div>

      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <div className="row between" style={{ marginBottom: 12 }}>
          <strong style={{ fontSize: 15 }}>Max inspections per day</strong>
          <strong style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>{settings.maxPerDay}</strong>
        </div>
        <input type="range" className="range" min={1} max={8} value={settings.maxPerDay} onChange={(e) => update({ maxPerDay: Number(e.target.value) })} />
      </div>

      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <strong style={{ fontSize: 15, display: "block", marginBottom: 12 }}>Working days</strong>
        <div className="row wrap gap-2">
          {DAYS.map((d) => {
            const on = settings.workingDays.includes(d);
            return (
              <button key={d} className={cn("chip", on && "is-active")} onClick={() => update({ workingDays: on ? settings.workingDays.filter((x) => x !== d) : [...settings.workingDays, d] })}>{d}</button>
            );
          })}
        </div>
      </div>

      <div className="card card-pad">
        <strong style={{ fontSize: 15, display: "block", marginBottom: 6 }}>Blocked dates</strong>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>Days you&apos;re unavailable for any inspections.</p>
        <div className="row wrap gap-2">
          {settings.blockedDates.map((d) => (
            <span key={d} className="chip"><Icon name="close" size={13} /> {d}</span>
          ))}
          <button className="chip" onClick={() => update({ blockedDates: [...settings.blockedDates, "15 Jun 2026"] })}><Icon name="plus" size={13} /> Block a date</button>
        </div>
      </div>
    </div>
  );
}
