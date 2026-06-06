"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { OtpInput } from "@/components/shared/otp-input";
import { BottomSheet } from "@/components/shared/bottom-sheet";
import { StatusBadge } from "@/components/shared/status-badge";
import { Avatar } from "@/components/shared/avatar";
import { SCAN_QUEUE, propertyById, type ScanQueueItem } from "@/lib/mock-data";
import { toast } from "sonner";

type Gps = "idle" | "checking" | "ok" | "fail";

export default function AgentInspectionsPage() {
  const [verified, setVerified] = useState<Record<string, boolean>>(
    Object.fromEntries(SCAN_QUEUE.filter((q) => q.status === "VERIFIED").map((q) => [q.id, true])),
  );
  const [active, setActive] = useState<ScanQueueItem | null>(null);
  const [code, setCode] = useState("");
  const [gps, setGps] = useState<Gps>("idle");
  const [error, setError] = useState(false);

  const open = (item: ScanQueueItem) => { setActive(item); setCode(""); setGps("idle"); setError(false); };

  const verify = () => {
    if (!active) return;
    if (code.replace(/\s/g, "") !== active.otp) { setError(true); return; }
    setGps("checking");
    setTimeout(() => {
      setGps("ok");
      setVerified((v) => ({ ...v, [active.id]: true }));
      toast.success(`Inspection verified for ${active.tenant}`);
      setTimeout(() => setActive(null), 900);
    }, 1200);
  };

  const pending = SCAN_QUEUE.filter((q) => !verified[q.id]);
  const done = SCAN_QUEUE.filter((q) => verified[q.id]);

  return (
    <>
      <p style={{ color: "var(--muted)", fontSize: 14.5, marginBottom: 18 }}>
        Verify each tenant in person by entering their 6-digit code. The meeting is GPS-checked and earns you impression points.
      </p>

      <h3 style={{ fontSize: 16, marginBottom: 12 }}>Today&apos;s queue</h3>
      <div className="col gap-3" style={{ marginBottom: 26 }}>
        {pending.length === 0 && <p style={{ color: "var(--muted)", fontSize: 14 }}>No pending inspections right now.</p>}
        {pending.map((q) => {
          const prop = propertyById(q.propertyId);
          return (
            <div key={q.id} className="card card-pad row between" style={{ alignItems: "center" }}>
              <div className="row gap-3">
                <Avatar name={q.tenant} size={42} />
                <div className="col" style={{ gap: 2 }}>
                  <strong style={{ fontSize: 14.5 }}>{q.tenant}</strong>
                  <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{prop?.title} · {q.time}</span>
                </div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => open(q)}><Icon name="key" size={15} /> Verify</button>
            </div>
          );
        })}
      </div>

      {done.length > 0 && (
        <>
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>Verified</h3>
          <div className="col gap-3">
            {done.map((q) => {
              const prop = propertyById(q.propertyId);
              return (
                <div key={q.id} className="card card-pad row between" style={{ alignItems: "center", opacity: 0.85 }}>
                  <div className="row gap-3">
                    <Avatar name={q.tenant} size={42} />
                    <div className="col" style={{ gap: 2 }}>
                      <strong style={{ fontSize: 14.5 }}>{q.tenant}</strong>
                      <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{prop?.title} · {q.time}</span>
                    </div>
                  </div>
                  <StatusBadge variant="ok"><Icon name="check" size={12} strokeWidth={2.4} /> Verified</StatusBadge>
                </div>
              );
            })}
          </div>
        </>
      )}

      <BottomSheet open={active !== null} onClose={() => setActive(null)} title="Verify inspection" maxWidth={420}>
        {active && (
          <div className="col gap-4" style={{ padding: "10px 20px 26px", textAlign: "center" }}>
            <p style={{ color: "var(--muted)", fontSize: 14 }}>Ask <strong style={{ color: "var(--ink)" }}>{active.tenant}</strong> to read their 6-digit code.</p>
            <OtpInput value={code} onChange={(v) => { setCode(v); setError(false); }} />
            {error && <span className="row gap-2 center" style={{ color: "var(--danger)", fontSize: 13, fontWeight: 600 }}><Icon name="alert" size={14} /> Code doesn&apos;t match - try again.</span>}
            {gps !== "idle" && (
              <div className="row gap-2 center" style={{ fontSize: 13.5, color: gps === "ok" ? "var(--ok)" : "var(--muted)" }}>
                {gps === "checking" && <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Checking GPS...</>}
                {gps === "ok" && <><Icon name="gps" size={16} /> GPS confirmed - you&apos;re on-site</>}
              </div>
            )}
            <button className="btn btn-gold btn-block btn-lg" disabled={code.length < 6 || gps === "checking"} onClick={verify}>
              <Icon name="shieldCheck" size={18} /> Verify meeting
            </button>
            <span style={{ fontSize: 12, color: "var(--faint)" }}>Demo code: {active.otp}</span>
          </div>
        )}
      </BottomSheet>
    </>
  );
}
