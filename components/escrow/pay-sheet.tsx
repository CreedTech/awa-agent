"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BottomSheet } from "@/components/shared/bottom-sheet";
import { Icon } from "@/components/ui/icon";
import { Naira } from "@/components/shared/naira";
import { RentBreakdownView } from "@/components/property/rent-breakdown";
import { useAppStore } from "@/store/app-store";
import { agentById } from "@/lib/mock-data";
import { calculateRentBreakdown } from "@/lib/utils";
import { env } from "@/lib/env";
import { toast } from "sonner";
import type { Property } from "@/lib/types";

type Stage = "summary" | "loading" | "success" | "failed";

interface PaySheetProps {
  property: Property;
  open: boolean;
  onClose: () => void;
}

/**
 * Escrow payment flow: summary → mock Paystack checkout → loading →
 * success (funds locked) or failed (retry). Real integration replaces the
 * setTimeout with Paystack `transaction.initialize` + redirect/callback.
 */
export function PaySheet({ property, open, onClose }: PaySheetProps) {
  const router = useRouter();
  const payEscrow = useAppStore((s) => s.payEscrow);
  const [stage, setStage] = useState<Stage>("summary");
  const [txnId, setTxnId] = useState<string | null>(null);

  const commissionPct = agentById(property.agentId)?.commissionPct;
  const breakdown = calculateRentBreakdown(property.baseRent, commissionPct);

  const reset = () => setStage("summary");
  const close = () => { onClose(); setTimeout(reset, 200); };

  const startPayment = () => {
    setStage("loading");
    // TODO(paystack): const { authorization_url } = await paystack.initialize({ amount, email, reference, metadata })
    setTimeout(() => {
      // Simulate ~12% failure rate to exercise the failed state.
      if (Math.random() < 0.12) {
        setStage("failed");
        return;
      }
      const txn = payEscrow(property.id, commissionPct);
      setTxnId(txn.id);
      setStage("success");
      toast.success("Payment successful - funds locked in escrow");
    }, 1600);
  };

  return (
    <BottomSheet open={open} onClose={close} title={stage === "summary" ? "Pay securely" : undefined} maxWidth={460}>
      <div style={{ padding: "12px 20px 26px" }}>
        {stage === "summary" && (
          <>
            <div className="row gap-2" style={{ background: "var(--lock-bg)", color: "var(--lock)", padding: "10px 13px", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>
              <Icon name="shieldCheck" size={16} strokeWidth={2} />
              <span>Your money is held in escrow and only released when you confirm your keys.</span>
            </div>
            <strong style={{ fontSize: 15 }}>{property.title}</strong>
            <div style={{ margin: "12px 0" }}>
              <RentBreakdownView breakdown={breakdown} showRenewalNote={false} />
            </div>
            {env.paystackPublicKey === "" && (
              <p style={{ fontSize: 12, color: "var(--faint)", marginBottom: 10 }}>
                Demo mode - no live Paystack key configured. No real charge is made.
              </p>
            )}
            <button className="btn btn-gold btn-block btn-lg" onClick={startPayment}>
              <Icon name="lock" size={18} /> Pay <Naira value={breakdown.total} size={16} color="var(--navy-900)" /> into escrow
            </button>
          </>
        )}

        {stage === "loading" && (
          <div className="col center" style={{ gap: 16, padding: "30px 0" }}>
            <div className="spinner" />
            <strong>Securing your payment...</strong>
            <span style={{ color: "var(--muted)", fontSize: 13.5 }}>Contacting Paystack and locking funds in escrow.</span>
          </div>
        )}

        {stage === "success" && (
          <div className="col center" style={{ gap: 14, padding: "16px 0", textAlign: "center" }}>
            <div className="lock-burst"><Icon name="lock" size={32} /></div>
            <h3 style={{ fontSize: 20 }}>Funds locked safely</h3>
            <Naira value={breakdown.total} size={24} />
            <p style={{ color: "var(--muted)", fontSize: 14, maxWidth: 320 }}>
              Held in escrow for {property.title}. Confirm your keys after handover to release the split.
            </p>
            <div className="row gap-2" style={{ width: "100%", marginTop: 8 }}>
              {[["Landlord", "var(--navy-700)"], ["Agent", "var(--gold-600)"], ["Platform", "var(--lock)"]].map(([l, c]) => (
                <div key={l} className="col center" style={{ flex: 1, padding: "10px 6px", background: "var(--paper)", borderRadius: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: c as string }} />
                  <span style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 4 }}>{l}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-primary btn-block" style={{ marginTop: 10 }} onClick={() => { close(); router.push(txnId ? `/tenant/escrow/${txnId}` : "/tenant/escrow"); }}>
              View in wallet
            </button>
          </div>
        )}

        {stage === "failed" && (
          <div className="col center" style={{ gap: 14, padding: "16px 0", textAlign: "center" }}>
            <div className="grid place-items-center" style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--danger-bg)", color: "var(--danger)" }}>
              <Icon name="alert" size={30} />
            </div>
            <h3 style={{ fontSize: 20 }}>Payment failed</h3>
            <p style={{ color: "var(--muted)", fontSize: 14, maxWidth: 320 }}>
              Your bank declined the charge. No money has left your account - please try again.
            </p>
            <button className="btn btn-gold btn-block" onClick={startPayment}>
              <Icon name="refresh" size={17} /> Try again
            </button>
            <button className="btn btn-quiet btn-block" onClick={close}>Cancel</button>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
