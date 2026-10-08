"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { payoutService } from "@/services/payout-service";

export function PayoutAccount() {
  const account = useQuery({ queryKey: ["payout-account"], queryFn: payoutService.account });
  const banks = useQuery({ queryKey: ["paystack-banks"], queryFn: payoutService.banks });
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setMessage(null);
    try {
      const result = await payoutService.configure(accountNumber, bankCode);
      await account.refetch();
      setAccountNumber("");
      setMessage(`Payout account set for ${result.accountName ?? "your name"}.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not verify payout account."); }
    finally { setBusy(false); }
  };

  return <section className="card card-pad col gap-4">
    <h2 style={{ fontSize: 20 }}>Payout account</h2>
    {account.isPending ? <p>Checking payout account...</p> : account.isError ? <p role="alert">Could not check payout account.</p> :
      account.data?.configured ? <p>{account.data.accountName} · {account.data.bankName} · ending {account.data.accountLast4}</p> :
      <p>Add a verified Nigerian bank account before a tenant can pay for one of your properties.</p>}
    <form onSubmit={save} className="col gap-3">
      <label className="col gap-2">Bank
        <select className="input" value={bankCode} required onChange={(event) => setBankCode(event.target.value)} disabled={banks.isPending || banks.isError}>
          <option value="">Select bank</option>
          {banks.data?.map((bank) => <option key={bank.code} value={bank.code}>{bank.name}</option>)}
        </select>
      </label>
      {banks.isError && <p role="alert">Could not load banks from Paystack.</p>}
      <label className="col gap-2">Account number
        <input className="input" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} minLength={10} required value={accountNumber} onChange={(event) => setAccountNumber(event.target.value)} />
      </label>
      <button className="btn btn-primary" type="submit" disabled={busy || banks.isError}>{busy ? "Verifying..." : "Save payout account"}</button>
    </form>
    {message && <p role="status">{message}</p>}
  </section>;
}
