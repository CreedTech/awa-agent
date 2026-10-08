import { TransactionList } from "@/components/escrow/transaction-list";

export default function Page() {
  return <TransactionList title="Platform revenue" subtitle="Recorded platform share of completed rent payments, before provider fees." amountField="platformFee" settledOnly />;
}
