"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { escrowService } from "@/services/escrow-service";
import { PageHeader } from "@/components/shared/page-header";
import { Naira } from "@/components/shared/naira";
import { downloadPaymentReceipt } from "@/lib/download";

type AmountField = "grossAmount" | "platformFee" | "agentShare" | "landlordShare";

export function TransactionList({ title, subtitle, amountField = "grossAmount", settledOnly = false, tenantLinks = false, receipts = false }: {
  title: string; subtitle: string; amountField?: AmountField; settledOnly?: boolean; tenantLinks?: boolean; receipts?: boolean;
}) {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const transactions = useQuery({ queryKey: ["escrow-mine"], queryFn: escrowService.mine });
  const rows = (transactions.data ?? []).filter((transaction) => receipts
    ? Boolean(transaction.fundsLockedAt) && !["PENDING_PAYMENT", "LEGACY_REVIEW"].includes(transaction.status)
    : !settledOnly || transaction.status === "SETTLED");
  const total = rows.filter((transaction) => transaction.status === "SETTLED").reduce((sum, transaction) => sum + transaction[amountField], 0);
  return <div className="page page-narrow col gap-5">
    <PageHeader title={title} subtitle={subtitle} />
    {downloadError && <p role="alert">{downloadError}</p>}
    {settledOnly && !transactions.isPending && !transactions.isError &&
      <div className="card card-pad row between"><strong>Confirmed total</strong><Naira value={total} size={22} /></div>}
    {transactions.isPending ? <p>Loading transactions...</p> : transactions.isError ? <p role="alert">Could not load transactions.</p> :
      rows.length ? rows.map((transaction) => <div className="card card-pad col gap-2" key={transaction.id}>
        <strong>{transaction.propertyTitle}</strong>
        <div className="row between"><span>{transaction.status.replaceAll("_", " ")}</span><Naira value={transaction[amountField]} size={19} /></div>
        <span>{new Date(transaction.createdAt).toLocaleDateString("en-GB")} · {transaction.id}</span>
        {tenantLinks && <Link href={`/tenant/escrow/${transaction.id}`} className="btn btn-quiet">View transaction</Link>}
        {receipts && <button className="btn btn-ghost" disabled={downloading !== null} onClick={async () => {
          setDownloading(transaction.id); setDownloadError(null);
          try { await downloadPaymentReceipt(await escrowService.receipt(transaction.id)); }
          catch (error) { setDownloadError(error instanceof Error ? error.message : "Could not download payment record."); }
          finally { setDownloading(null); }
        }}>{downloading === transaction.id ? "Preparing..." : "Download PDF"}</button>}
      </div>) : <p>No matching transactions yet.</p>}
  </div>;
}
