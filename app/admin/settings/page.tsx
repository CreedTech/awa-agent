"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Field } from "@/components/shared/field";
import { Icon } from "@/components/ui/icon";
import { env } from "@/lib/env";
import { AGENT_UPLOAD_LIMITS } from "@/lib/constants";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [inspectionsOn, setInspectionsOn] = useState(true);
  const [maxPerDay, setMaxPerDay] = useState(env.maxInspectionsPerDay);
  const [escrowFee, setEscrowFee] = useState(env.escrowFeePct);
  const [commission, setCommission] = useState(env.defaultCommissionPct);
  const [newLimit, setNewLimit] = useState<number>(AGENT_UPLOAD_LIMITS.new);
  const [highLimit, setHighLimit] = useState<number>(AGENT_UPLOAD_LIMITS.highTrust);

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="card card-pad row between" style={{ marginBottom: 16 }}>
        <div className="col" style={{ gap: 2 }}>
          <strong style={{ fontSize: 15 }}>Global inspection booking</strong>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>Master switch across all cities and agents</span>
        </div>
        <Switch checked={inspectionsOn} onCheckedChange={(v) => { setInspectionsOn(v); toast(v ? "Inspections enabled platform-wide" : "Inspections paused platform-wide"); }} />
      </div>

      <div className="card card-pad col gap-5" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 16 }}>Inspection rules</h3>
        <div className="field">
          <span className="label row between"><span>Default max inspections / day</span><strong>{maxPerDay}</strong></span>
          <input type="range" className="range" min={1} max={10} value={maxPerDay} onChange={(e) => setMaxPerDay(Number(e.target.value))} />
        </div>
        <p style={{ fontSize: 12.5, color: "var(--faint)" }}>City-level capacity overrides can be configured per metro (placeholder).</p>
      </div>

      <div className="card card-pad col gap-5" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 16 }}>Fees & commission</h3>
        <Field label="Escrow service fee (%)"><input className="input" type="number" step="0.5" value={escrowFee} onChange={(e) => setEscrowFee(Number(e.target.value))} /></Field>
        <Field label="Default agent commission (%)"><input className="input" type="number" value={commission} onChange={(e) => setCommission(Number(e.target.value))} /></Field>
        <p style={{ fontSize: 12.5, color: "var(--faint)" }}>High-trust agents earn 10%, lower-trust 8%. Year-2 renewals charge no commission.</p>
      </div>

      <div className="card card-pad col gap-5" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 16 }}>Agent upload limits</h3>
        <Field label="New agent listing limit"><input className="input" type="number" value={newLimit} onChange={(e) => setNewLimit(Number(e.target.value))} /></Field>
        <Field label="High-trust agent listing limit"><input className="input" type="number" value={highLimit} onChange={(e) => setHighLimit(Number(e.target.value))} /></Field>
        <p style={{ fontSize: 12.5, color: "var(--faint)" }}>Suspended agents cannot list. Agents can request a higher limit for admin approval.</p>
      </div>

      <button className="btn btn-primary" onClick={() => toast.success("Settings saved")}><Icon name="check" size={17} strokeWidth={2.2} /> Save settings</button>
    </div>
  );
}
