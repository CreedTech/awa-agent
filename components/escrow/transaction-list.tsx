"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { escrowService } from "@/services/escrow-service";
import { PageHeader } from "@/components/shared/page-header";
import { Naira } from "@/components/shared/naira";

type AmountField = "grossAmount" | "platformFee" | "agentShare" | "landlordShare";

export function TransactionList({ title, subtitle, amountField = "grossAmount", settledOnly = false, tenantLinks = false }: {
  title: string; subtitle: string; amountField?: AmountField; settledOnly?: boolean; tenantLinks?: boolean;
}) {
  const transactions = useQuery({ queryKey: ["escrow-mine"], queryFn: escrowService.mine });
  const rows = (transactions.data ?? []).filter((transaction) => !settledOnly || transaction.status === "SETTLED");
  const total = rows.filter((transaction) => transaction.status === "SETTLED").reduce((sum, transaction) => sum + transaction[amountField], 0);
  return <div className="page page-narrow col gap-5">
    <PageHeader title={title} subtitle={subtitle} />
    {settledOnly && !transactions.isPending && !transactions.isError &&
      <div className="card card-pad row between"><strong>Confirmed total</strong><Naira value={total} size={22} /></div>}
    {transactions.isPending ? <p>Loading transactions...</p> : transactions.isError ? <p role="alert">Could not load transactions.</p> :
      rows.length ? rows.map((transaction) => <div className="card card-pad col gap-2" key={transaction.id}>
        <strong>{transaction.propertyTitle}</strong>
        <div className="row between"><span>{transaction.status.replaceAll("_", " ")}</span><Naira value={transaction[amountField]} size={19} /></div>
        <span>{new Date(transaction.createdAt).toLocaleDateString("en-GB")} · {transaction.id}</span>
        {tenantLinks && <Link href={`/tenant/escrow/${transaction.id}`} className="btn btn-quiet">View transaction</Link>}
      </div>) : <p>No matching transactions yet.</p>}
  </div>;
}
