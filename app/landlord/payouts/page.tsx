import { TransactionList } from "@/components/escrow/transaction-list";

export default function Page() {
  return <TransactionList title="Payouts" subtitle="Confirmed landlord transfers." amountField="landlordShare" settledOnly />;
}
