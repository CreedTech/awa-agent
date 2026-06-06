"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { OtpInput } from "@/components/shared/otp-input";
import { MapPlaceholder } from "@/components/shared/map-placeholder";
import { InspectionBadge } from "@/components/shared/status-badge";
import { PaySheet } from "@/components/escrow/pay-sheet";
import { useAppStore } from "@/store/app-store";
import { propertyById } from "@/lib/mock-data";
import { toast } from "sonner";
import type { InspectionStatus } from "@/lib/types";

const STEPS = ["Booked", "Approved", "Meet & verify", "Completed"];

function stepIndex(status: InspectionStatus): number {
  if (status === "COMPLETED") return 3;
  if (status === "APPROVED") return 2;
  if (["CONFIRMED", "SCHEDULED", "RESCHEDULED"].includes(status)) return 1;
  return 0;
}

export default function InspectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const inspection = useAppStore((s) => s.inspections.find((i) => i.id === id));
  const approveInspection = useAppStore((s) => s.approveInspection);
  const completeInspection = useAppStore((s) => s.completeInspection);
  const cancelInspection = useAppStore((s) => s.cancelInspection);
  const [paying, setPaying] = useState(false);

  if (!inspection) return notFound();
  const prop = propertyById(inspection.propertyId);
  if (!prop) return notFound();

  const active = stepIndex(inspection.status);
  const cancelled = ["TENANT_CANCELLED", "AGENT_CANCELLED", "EXPIRED"].includes(inspection.status);

  return (
    <div className="page page-narrow">
      <Link href="/tenant/inspections" className="row gap-2" style={{ color: "var(--muted)", fontSize: 14, marginBottom: 14 }}>
        <Icon name="arrowL" size={16} /> All inspections
      </Link>

      <div className="row between wrap gap-3" style={{ marginBottom: 18 }}>
        <div className="col gap-2">
          <h1 className="page-title" style={{ fontSize: 26 }}>{prop.title}</h1>
          <span className="row gap-2" style={{ color: "var(--muted)", fontSize: 14 }}>
            <Icon name="calendar" size={15} /> {inspection.date} · {inspection.time}
          </span>
        </div>
        <InspectionBadge status={inspection.status} />
      </div>

      {/* OTP */}
      <div className="card card-pad" style={{ textAlign: "center", marginBottom: 18 }}>
        <span className="label" style={{ display: "block", marginBottom: 10 }}>Your meeting code</span>
        <OtpInput value={inspection.otp} onChange={() => {}} readOnly />
        <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 12 }}>
          Read this 6-digit code to the agent in person. Never share it before you meet.
        </p>
      </div>

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
                    {["Inspection requested & confirmed", "Agent approves - address unlocks", "Meet on-site & read your OTP", "Inspection done - pay securely"][i]}
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
            <MapPlaceholder unlocked={inspection.addressUnlocked} landmark={prop.landmark} address={prop.exactAddress} location={prop.location} height={160} />
            {inspection.addressUnlocked && (
              <div className="col gap-2" style={{ marginTop: 12 }}>
                <strong className="row gap-2" style={{ fontSize: 14 }}><Icon name="pin" size={15} color="var(--gold-600)" /> {prop.exactAddress}</strong>
                <div className="card" style={{ background: "var(--ok-bg)", border: "none", padding: "10px 12px", fontSize: 12.5, color: "var(--ink-2)" }}>
                  <strong style={{ color: "var(--ok)" }}>Safety:</strong> inspect in daylight, tell a friend, and never pay any viewing fee.
                </div>
              </div>
            )}
          </div>

          {/* Stage actions */}
          {!cancelled && (
            <div className="card card-pad col gap-2">
              {inspection.status !== "COMPLETED" && inspection.status !== "APPROVED" && (
                <>
                  <button className="btn btn-gold btn-block" onClick={() => { approveInspection(inspection.id); toast.success("Agent approved - address unlocked"); }}>
                    <Icon name="shieldCheck" size={17} /> Agent approves (demo)
                  </button>
                  <button className="btn btn-danger btn-block btn-sm" onClick={() => { cancelInspection(inspection.id); toast("Inspection cancelled"); }}>
                    Cancel inspection
                  </button>
                </>
              )}
              {inspection.status === "APPROVED" && (
                <button className="btn btn-primary btn-block" onClick={() => { completeInspection(inspection.id); toast.success("Inspection marked complete"); }}>
                  <Icon name="check" size={17} strokeWidth={2.2} /> Mark inspection complete
                </button>
              )}
              {inspection.status === "COMPLETED" && (
                <button className="btn btn-gold btn-block btn-lg" onClick={() => setPaying(true)}>
                  <Icon name="lock" size={18} /> Pay securely into escrow
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <PaySheet property={prop} open={paying} onClose={() => setPaying(false)} />
    </div>
  );
}
