import { TransactionList } from "@/components/escrow/transaction-list";

export default function Page() {
  return <TransactionList title="Payment records" subtitle="Verified rent payments and their current status." receipts tenantLinks />;
}
