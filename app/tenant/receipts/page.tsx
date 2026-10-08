import { TransactionList } from "@/components/escrow/transaction-list";

export default function Page() {
  return <TransactionList title="Payment records" subtitle="Your completed rent payments." settledOnly tenantLinks />;
}
