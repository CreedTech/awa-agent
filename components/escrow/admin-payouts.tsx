"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { payoutService } from "@/services/payout-service";
import { Naira } from "@/components/shared/naira";

function PayoutRow({ payout, onUpdated }: { payout: { id: string; transactionId: string; role: string; amount: number; status: string }; onUpdated: () => Promise<unknown> }) {
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const finalize = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setMessage(null);
    try { await payoutService.finalize(payout.id, otp); setOtp(""); await onUpdated(); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Could not approve transfer."); }
    finally { setBusy(false); }
  };
  const resend = async () => {
    setBusy(true); setMessage(null);
    try { await payoutService.resendOtp(payout.id); setMessage("Paystack sent a new OTP to the business contact."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Could not resend OTP."); }
    finally { setBusy(false); }
  };
  const reconcile = async () => {
    setBusy(true); setMessage(null);
    try { await payoutService.reconcile(payout.id); await onUpdated(); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Could not verify transfer status."); }
    finally { setBusy(false); }
  };
  return <div className="card card-pad col gap-2">
    <strong>{payout.role} · {payout.status}</strong>
    <span>{payout.transactionId}</span>
    <Naira value={payout.amount} size={18} />
    {payout.status !== "CREATED" && <button className="btn btn-ghost" type="button" disabled={busy} onClick={reconcile}>Check with Paystack</button>}
    {payout.status === "OTP_REQUIRED" && <form className="col gap-3" onSubmit={finalize}>
      <label className="col gap-2">Paystack business OTP
        <input className="input" inputMode="numeric" value={otp} minLength={6} maxLength={6} required onChange={(event) => setOtp(event.target.value)} />
      </label>
      <div className="row gap-2"><button className="btn btn-primary" type="submit" disabled={busy}>Approve transfer</button>
        <button className="btn btn-ghost" type="button" disabled={busy} onClick={resend}>Resend OTP</button></div>
    </form>}
    {message && <p role="status">{message}</p>}
  </div>;
}

export function AdminPayouts() {
  const payouts = useQuery({ queryKey: ["admin-payouts"], queryFn: payoutService.adminList });
  return <section className="col gap-3">
    <h2 style={{ fontSize: 20 }}>Payout transfers</h2>
    {payouts.isPending ? <p>Loading payouts...</p> : payouts.isError ? <p role="alert">Could not load payouts.</p> :
      payouts.data?.length ? payouts.data.map((payout) => <PayoutRow key={payout.id} payout={payout} onUpdated={() => payouts.refetch()} />) : <p>No payouts submitted.</p>}
  </section>;
}
