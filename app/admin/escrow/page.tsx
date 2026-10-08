import { TransactionList } from "@/components/escrow/transaction-list";
import { AdminPayouts } from "@/components/escrow/admin-payouts";

export default function Page() {
  return <>
    <TransactionList title="Payments" subtitle="All rent transactions and provider states." />
    <div className="page page-narrow"><AdminPayouts /></div>
  </>;
}
