import { TransactionList } from "@/components/escrow/transaction-list";

export default function Page() {
  return <TransactionList title="Agent commissions" subtitle="Confirmed agent transfers across the platform." amountField="agentShare" settledOnly />;
}
