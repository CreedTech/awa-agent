"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@/components/ui/icon";
import { Naira } from "@/components/shared/naira";
import { BottomSheet } from "@/components/shared/bottom-sheet";
import { Field } from "@/components/shared/field";
import { CommissionAttribution } from "@/components/agent/commission-attribution";
import { AGENT_EARNINGS, COMMISSIONS } from "@/lib/mock-data";
import { useAppStore } from "@/store/app-store";
import { useShallow } from "zustand/react/shallow";
import { withdrawSchema, type WithdrawValues } from "@/lib/validations";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function AgentEarningsPage() {
  const available = useAppStore((s) => s.agentAvailable);
  const history = useAppStore(useShallow((s) => s.agentPayouts));
  const withdraw = useAppStore((s) => s.withdrawAgent);

  const [withdrawing, setWithdrawing] = useState(false);
  const [attribution, setAttribution] = useState<string | null>(null);
  const [whyNotPaid, setWhyNotPaid] = useState(false);

  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } =
    useForm<WithdrawValues>({ resolver: zodResolver(withdrawSchema) });

  const submitWithdraw = (values: WithdrawValues) => {
    if (values.amount > available) {
      setError("amount", { message: `You can withdraw up to ${formatCurrency(available)}` });
      return;
    }
    if (withdraw(values.amount, values.bank, values.accountNumber)) {
      toast.success(`Withdrawal of ${formatCurrency(values.amount)} sent to ${values.bank}`);
      reset();
      setWithdrawing(false);
    } else {
      toast.error("Withdrawal failed");
    }
  };

  const commissionFor = (ref: string) => COMMISSIONS.find((c) => c.txnRef === ref);

  return (
    <>
      {/* Balance */}
      <div className="card" style={{ background: "linear-gradient(120deg, var(--navy-800), var(--navy-700))", color: "#fff", border: "none", padding: "24px", marginBottom: 18 }}>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,.7)" }}>Available to withdraw</span>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 36, marginTop: 4 }}>{formatCurrency(available)}</div>
        <div className="row between wrap gap-3" style={{ marginTop: 16 }}>
          <div className="row gap-6">
            <div className="col" style={{ gap: 0 }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>Pending (in escrow)</span>
              <strong style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>{formatCurrency(AGENT_EARNINGS.pendingSplit)}</strong>
            </div>
            <div className="col" style={{ gap: 0 }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>Impressions (month)</span>
              <strong style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>{formatCurrency(AGENT_EARNINGS.impressionMonth)}</strong>
            </div>
          </div>
          <button className="btn btn-gold" onClick={() => setWithdrawing(true)}><Icon name="cash" size={17} /> Withdraw</button>
        </div>
      </div>

      <div className="row between" style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: 17 }}>Payout history</h3>
        <button style={{ fontSize: 13, color: "var(--navy-700)", fontWeight: 600 }} onClick={() => setWhyNotPaid(true)}>Why was I not paid?</button>
      </div>

      <div className="col gap-2">
        {history.map((p) => {
          const hasAttribution = p.type === "Commission split" && commissionFor("AWA-TX-88120");
          return (
            <div key={p.id} className="card card-pad row between" style={{ alignItems: "center" }}>
              <div className="row gap-3">
                <span className="grid place-items-center" style={{ width: 40, height: 40, borderRadius: 11, background: p.type === "Commission split" ? "var(--navy-050)" : "var(--gold-050)", color: p.type === "Commission split" ? "var(--navy-700)" : "var(--gold-700)" }}>
                  <Icon name={p.type === "Commission split" ? "coins" : "trend"} size={18} />
                </span>
                <div className="col" style={{ gap: 2 }}>
                  <strong style={{ fontSize: 14 }}>{p.prop}</strong>
                  <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{p.type} · {p.date}</span>
                </div>
              </div>
              <div className="row gap-3">
                <Naira value={p.amount} size={15} color="var(--ok)" />
                {hasAttribution && (
                  <button className="icon-btn" aria-label="View attribution" onClick={() => setAttribution("AWA-TX-88120")}>
                    <Icon name="info" size={18} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Withdraw */}
      <BottomSheet open={withdrawing} onClose={() => setWithdrawing(false)} title="Withdraw to bank" maxWidth={420}>
        <form className="col gap-4" style={{ padding: "8px 20px 24px" }} onSubmit={handleSubmit(submitWithdraw)} noValidate>
          <Field label="Amount" error={errors.amount?.message}>
            <input className="input" type="number" placeholder="100000" {...register("amount", { valueAsNumber: true })} />
          </Field>
          <Field label="Bank" error={errors.bank?.message}>
            <select className="select" defaultValue="" {...register("bank")}>
              <option value="" disabled>Select bank</option>
              {["GTBank", "Access Bank", "Zenith Bank", "UBA", "First Bank", "Opay"].map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </Field>
          <Field label="Account number" error={errors.accountNumber?.message}>
            <input className="input" inputMode="numeric" placeholder="0123456789" {...register("accountNumber")} />
          </Field>
          <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={isSubmitting}>Request withdrawal</button>
        </form>
      </BottomSheet>

      {/* Attribution */}
      <BottomSheet open={attribution !== null} onClose={() => setAttribution(null)} title="Commission attribution" maxWidth={460}>
        <div style={{ padding: "8px 20px 24px" }}>
          {attribution && commissionFor(attribution) && <CommissionAttribution commission={commissionFor(attribution)!} />}
        </div>
      </BottomSheet>

      {/* Why not paid */}
      <BottomSheet open={whyNotPaid} onClose={() => setWhyNotPaid(false)} title="Why was I not paid?" maxWidth={460}>
        <div className="col gap-3" style={{ padding: "8px 20px 24px" }}>
          {[
            ["Renewals", "Year-2 renewals pay base rent only - no commission unless you provided a new verified service."],
            ["Loyalty credits", "If a tenant renewed using loyalty rewards, the original agent isn't auto-paid."],
            ["Expired attribution", "Commission attribution expires if the deal closes long after your inspection."],
            ["Admin override", "In a dispute, an admin can reassign or withhold a payout."],
          ].map(([t, b]) => (
            <div key={t} className="card card-pad col gap-1">
              <strong style={{ fontSize: 14 }}>{t}</strong>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>{b}</span>
            </div>
          ))}
        </div>
      </BottomSheet>
    </>
  );
}
