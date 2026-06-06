"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { Naira } from "@/components/shared/naira";
import { Field } from "@/components/shared/field";
import { PROPERTY_TYPES, AREAS } from "@/lib/constants";
import { calculateRentBreakdown, cn } from "@/lib/utils";
import { toast } from "sonner";
import type { PropertyType } from "@/lib/types";

export default function LandlordAddPropertyPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<PropertyType>("Flat");
  const [area, setArea] = useState<string>(AREAS[0]);
  const [landmark, setLandmark] = useState("");
  const [baseRent, setBaseRent] = useState(600000);
  const breakdown = calculateRentBreakdown(baseRent);

  const submit = () => {
    if (title.trim().length < 4) { toast.error("Add a clear listing title"); return; }
    toast.success("Property submitted for verification", { description: "We'll verify ownership, then it goes to admin review." });
    router.push("/landlord/properties");
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <button className="row gap-2" style={{ color: "var(--muted)", fontSize: 13.5, marginBottom: 16 }} onClick={() => router.back()}>
        <Icon name="arrowL" size={16} /> Back
      </button>
      <div className="card card-pad col gap-5">
        <h2 style={{ fontSize: 20 }}>Add a property</h2>
        <Field label="Listing title"><input className="input" placeholder="3 Bedroom Flat — Jericho" value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <div className="field">
          <span className="label">Type</span>
          <div className="row wrap gap-2">{PROPERTY_TYPES.map((t) => <button key={t} className={cn("chip", type === t && "is-active")} onClick={() => setType(t)}>{t}</button>)}</div>
        </div>
        <Field label="Area"><select className="select" value={area} onChange={(e) => setArea(e.target.value)}>{AREAS.map((a) => <option key={a} value={a}>{a}</option>)}</select></Field>
        <Field label="Public landmark"><input className="input" placeholder="Jericho Mall" value={landmark} onChange={(e) => setLandmark(e.target.value)} /></Field>
        <div className="field">
          <span className="label row between"><span>Base rent (annual)</span><Naira value={baseRent} size={15} color="var(--navy-700)" /></span>
          <input type="range" className="range" min={150000} max={2500000} step={50000} value={baseRent} onChange={(e) => setBaseRent(Number(e.target.value))} />
        </div>
        <div className="card" style={{ background: "var(--navy-050)", border: "none", padding: "12px 14px" }}>
          <div className="row between"><span style={{ fontSize: 13, color: "var(--navy-700)" }}>Tenant pays (all-in)</span><Naira value={breakdown.total} size={17} color="var(--navy-800)" /></div>
        </div>
        <div className="field">
          <span className="label">Proof of ownership</span>
          <div className="row gap-2 center" style={{ border: "1.5px dashed var(--line-2)", borderRadius: 12, padding: 18, color: "var(--muted)", fontSize: 13.5 }}><Icon name="upload" size={18} /> Upload C of O / tenancy agreement</div>
        </div>
        <button className="btn btn-primary btn-block btn-lg" onClick={submit}>Submit for verification</button>
      </div>
    </div>
  );
}
