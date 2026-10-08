"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { OtpInput } from "@/components/shared/otp-input";
import { LocationPanel } from "@/components/shared/location-panel";
import { PaySheet } from "@/components/escrow/pay-sheet";
import { InspectionBadge } from "@/components/shared/status-badge";
import type { InspectionStatus } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { inspectionService } from "@/services/inspection-service";
import { propertyService } from "@/services/property-service";

const STEPS = ["Requested", "Meet & verify", "Completed"];

function stepIndex(status: InspectionStatus): number {
  if (status === "COMPLETED") return 2;
  if (["CONFIRMED", "SCHEDULED", "RESCHEDULED", "APPROVED"].includes(status)) return 1;
  return 0;
}

export default function InspectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const liveInspection = useQuery({ queryKey: ["inspection", id], queryFn: () => inspectionService.get(id), enabled: !!id });
  const inspection = liveInspection.data;
  const liveProperty = useQuery({
    queryKey: ["inspection-property", inspection?.propertyId],
    queryFn: () => propertyService.get(inspection!.propertyId),
    enabled: !!inspection?.propertyId,
  });
  const [paying, setPaying] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const changeInspection = async (action: "cancel" | "reschedule", preferredDate?: string) => {
    setActionBusy(true); setActionError(null);
    try {
      if (action === "cancel") await inspectionService.cancel(id);
      else await inspectionService.reschedule(id, preferredDate ?? "");
      await liveInspection.refetch();
    } catch (error) { setActionError(error instanceof Error ? error.message : "Could not update inspection."); }
    finally { setActionBusy(false); }
  };

  if (liveInspection.isPending) return <div className="page">Loading inspection...</div>;
  if (!inspection) return notFound();
  const prop = liveProperty.data;

  const active = stepIndex(inspection.status);
  const cancelled = ["TENANT_CANCELLED", "AGENT_CANCELLED", "EXPIRED"].includes(inspection.status);

  return (
    <div className="page page-narrow">
      <Link href="/tenant/inspections" className="row gap-2" style={{ color: "var(--muted)", fontSize: 14, marginBottom: 14 }}>
        <Icon name="arrowL" size={16} /> All inspections
      </Link>

      <div className="row between wrap gap-3" style={{ marginBottom: 18 }}>
        <div className="col gap-2">
          <h1 className="page-title" style={{ fontSize: 26 }}>{inspection.propertyTitle ?? prop?.title ?? "Property inspection"}</h1>
          <span className="row gap-2" style={{ color: "var(--muted)", fontSize: 14 }}>
            <Icon name="calendar" size={15} /> {inspection.date} · {inspection.time}
          </span>
        </div>
        <InspectionBadge status={inspection.status} />
      </div>

      {/* OTP */}
      {inspection.status === "REQUESTED" && <div className="card card-pad" style={{ textAlign: "center", marginBottom: 18 }}>
        <span className="label" style={{ display: "block", marginBottom: 10 }}>Your meeting code</span>
        <OtpInput value={inspection.otp} onChange={() => {}} readOnly />
        <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 12 }}>
          Read this 6-digit code to the agent in person. Never share it before you meet.
        </p>
      </div>}

      <div className="two-col">
        {/* Step tracker */}
        <div className="card card-pad">
          <h3 style={{ fontSize: 16, marginBottom: 16 }}>Progress</h3>
          <div className="steps">
            {STEPS.map((label, i) => (
              <div key={label} className={`step ${i < active ? "done" : ""} ${i === active && !cancelled ? "active" : ""}`}>
                <div className="step-rail">
                  <span className="step-dot">
                    {i < active ? <Icon name="check" size={15} strokeWidth={2.4} /> : i + 1}
                  </span>
                  {i < STEPS.length - 1 && <span className="step-line" />}
                </div>
                <div className="step-body">
                  <strong style={{ fontSize: 14.5 }}>{label}</strong>
                  <p style={{ color: "var(--muted)", fontSize: 12.5, marginTop: 2 }}>
                    {["Inspection requested", "Meet on-site and read your code", "Address unlocked after verification"][i]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location + actions */}
        <div className="col gap-4">
          <div className="card card-pad">
            <div className="row between" style={{ marginBottom: 12 }}>
              <h3 style={{ fontSize: 16 }}>Location</h3>
              <span className={`tag ${inspection.addressUnlocked ? "tag-ok" : "tag-lock"}`}>
                <Icon name={inspection.addressUnlocked ? "pin" : "lock"} size={13} strokeWidth={2} />
                {inspection.addressUnlocked ? "Unlocked" : "Locked"}
              </span>
            </div>
            <LocationPanel unlocked={inspection.addressUnlocked} landmark={inspection.landmark ?? prop?.landmark ?? ""} address={inspection.exactAddress} />
            {inspection.addressUnlocked && (
              <div className="col gap-2" style={{ marginTop: 12 }}>
                <strong className="row gap-2" style={{ fontSize: 14 }}><Icon name="pin" size={15} color="var(--gold-600)" /> {inspection.exactAddress}</strong>
                {inspection.exactAddress && <a className="btn btn-ghost" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(inspection.location ? `${inspection.location.lat},${inspection.location.lng}` : inspection.exactAddress)}`} target="_blank" rel="noopener noreferrer">Open directions</a>}
                <div className="card" style={{ background: "var(--ok-bg)", border: "none", padding: "10px 12px", fontSize: 12.5, color: "var(--ink-2)" }}>
                  <strong style={{ color: "var(--ok)" }}>Safety:</strong> inspect in daylight, tell a friend, and never pay any viewing fee.
                </div>
              </div>
            )}
          </div>

          {inspection.status === "COMPLETED" && prop?.available && <button className="btn btn-gold btn-block btn-lg" onClick={() => setPaying(true)}>
            Continue to payment
          </button>}

        </div>
      </div>

      {inspection.status === "REQUESTED" && <div className="card card-pad col gap-3" style={{ marginTop: 18 }}>
        <strong>Change this inspection</strong>
        <form className="row gap-2 wrap" onSubmit={(event) => {
          event.preventDefault();
          const date = String(new FormData(event.currentTarget).get("preferredDate") ?? "");
          void changeInspection("reschedule", date);
        }}>
          <input className="input" name="preferredDate" type="date" defaultValue={inspection.preferredDate} required />
          <button className="btn btn-ghost" type="submit" disabled={actionBusy}>Reschedule</button>
        </form>
        <button className="btn btn-ghost" type="button" disabled={actionBusy} onClick={() => void changeInspection("cancel")}>Cancel inspection</button>
        {actionError && <p role="alert">{actionError}</p>}
      </div>}

      {prop && <PaySheet property={prop} open={paying} onClose={() => setPaying(false)} />}

    </div>
  );
}
