import { TransactionList } from "@/components/escrow/transaction-list";

export default function Page() {
  return <TransactionList title="Commissions" subtitle="Confirmed commission transactions." amountField="agentShare" settledOnly />;
}
