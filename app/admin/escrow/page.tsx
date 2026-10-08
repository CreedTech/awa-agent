import { TransactionList } from "@/components/escrow/transaction-list";
import { AdminPayouts } from "@/components/escrow/admin-payouts";
import { AdminRefunds } from "@/components/escrow/admin-refunds";

export default function Page() {
  return <>
    <TransactionList title="Payments" subtitle="All rent transactions and provider states." />
    <div className="page page-narrow col gap-5"><AdminRefunds /><AdminPayouts /></div>
  </>;
}
