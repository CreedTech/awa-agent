import { TransactionList } from "@/components/escrow/transaction-list";

export default function Page() {
  return <TransactionList title="Earnings" subtitle="Confirmed agent transfers." amountField="agentShare" settledOnly />;
}
