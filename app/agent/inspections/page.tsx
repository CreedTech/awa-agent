"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { OtpInput } from "@/components/shared/otp-input";
import { BottomSheet } from "@/components/shared/bottom-sheet";
import { StatusBadge } from "@/components/shared/status-badge";
import { Avatar } from "@/components/shared/avatar";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { inspectionService } from "@/services/inspection-service";

type VerificationState = "idle" | "checking" | "ok";
interface QueueItem {
  id: string;
  tenant: string;
  time: string;
  status: "PENDING" | "VERIFIED" | "CANCELLED";
  propertyTitle: string;
}

export default function AgentInspectionsPage() {
  const liveQueue = useQuery({
    queryKey: ["agent-inspections"],
    queryFn: async () => {
      const response = await apiFetch<{ data: Array<{ inspectionId: string; status: string; propertyTitle: string; tenant: { name: string }; preferredDate: string }> }>("/inspection/agent");
      return response.data.map((item): QueueItem => ({
        id: item.inspectionId, tenant: item.tenant.name,
        time: item.preferredDate ?? "", status: item.status === "COMPLETED" ? "VERIFIED" : item.status === "CANCELLED" ? "CANCELLED" : "PENDING",
        propertyTitle: item.propertyTitle,
      }));
    },
  });
  const queue = liveQueue.data ?? [];
  const [verified, setVerified] = useState<Record<string, boolean>>({});
  const [active, setActive] = useState<QueueItem | null>(null);
  const [code, setCode] = useState("");
  const [gps, setGps] = useState<VerificationState>("idle");
  const [error, setError] = useState(false);

  const open = (item: QueueItem) => { setActive(item); setCode(""); setGps("idle"); setError(false); };

  const verify = async () => {
    if (!active) return;
    setGps("checking");
    try {
      await inspectionService.verifyOtp(active.id, code);
      setVerified((value) => ({ ...value, [active.id]: true }));
      setGps("ok");
      toast.success(`Inspection verified for ${active.tenant}`);
      setActive(null);
      void liveQueue.refetch();
    } catch (error) {
      setGps("idle");
      setError(true);
      toast.error(error instanceof Error ? error.message : "Verification failed.");
    }
  };

  const pending = queue.filter((q) => q.status === "PENDING" && !verified[q.id]);
  const done = queue.filter((q) => q.status === "VERIFIED" || verified[q.id]);

  return (
    <>
      <p style={{ color: "var(--muted)", fontSize: 14.5, marginBottom: 18 }}>
        Verify each tenant in person by entering their 6-digit code.
      </p>

      <h3 style={{ fontSize: 16, marginBottom: 12 }}>Today&apos;s queue</h3>
      <div className="col gap-3" style={{ marginBottom: 26 }}>
        {liveQueue.isPending && <p style={{ color: "var(--muted)", fontSize: 14 }}>Loading inspections...</p>}
        {liveQueue.isError && <p role="alert" style={{ color: "var(--danger)", fontSize: 14 }}>Could not load inspections. Please try again.</p>}
        {liveQueue.isSuccess && pending.length === 0 && <p style={{ color: "var(--muted)", fontSize: 14 }}>No pending inspections right now.</p>}
        {pending.map((q) => {
          return (
            <div key={q.id} className="card card-pad row between" style={{ alignItems: "center" }}>
              <div className="row gap-3">
                <Avatar name={q.tenant} size={42} />
                <div className="col" style={{ gap: 2 }}>
                  <strong style={{ fontSize: 14.5 }}>{q.tenant}</strong>
                  <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{q.propertyTitle} · {q.time}</span>
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
              return (
                <div key={q.id} className="card card-pad row between" style={{ alignItems: "center", opacity: 0.85 }}>
                  <div className="row gap-3">
                    <Avatar name={q.tenant} size={42} />
                    <div className="col" style={{ gap: 2 }}>
                      <strong style={{ fontSize: 14.5 }}>{q.tenant}</strong>
                      <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{q.propertyTitle} · {q.time}</span>
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
                {gps === "checking" && <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Verifying code...</>}
                {gps === "ok" && <><Icon name="check" size={16} /> Inspection verified</>}
              </div>
            )}
            <button className="btn btn-gold btn-block btn-lg" disabled={code.length < 6 || gps === "checking"} onClick={verify}>
              <Icon name="shieldCheck" size={18} /> Verify meeting
            </button>
          </div>
        )}
      </BottomSheet>
    </>
  );
}
