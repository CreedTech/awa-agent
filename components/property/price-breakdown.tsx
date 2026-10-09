import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import type { Property } from "@/lib/types";

export function PriceBreakdown({ property }: { property: Property }) {
  const premium = property.year2Rent ? property.baseRent - property.year2Rent : undefined;
  return (
    <div className="aw-panel-price">
      <span>First-year price</span>
      <strong className="num">{formatCurrency(property.baseRent)}</strong>
      <p>One price, with no agency, agreement or viewing fees. It already includes the agent&apos;s commission and AwaAgent&apos;s 2.5% fee.</p>
      <dl className="aw-breakdown">
        {property.year2Rent && (
          <div>
            <dt>From year two</dt>
            <dd className="num">{formatCurrency(property.year2Rent)}<span> / year</span></dd>
          </div>
        )}
        {premium !== undefined && premium > 0 && (
          <div>
            <dt>Year one only: commission and fee</dt>
            <dd className="num">{formatCurrency(premium)}</dd>
          </div>
        )}
        {property.securityDeposit && (
          <div>
            <dt>Security deposit</dt>
            <dd className="num">{formatCurrency(property.securityDeposit)}</dd>
          </div>
        )}
        {property.serviceCharge && (
          <div>
            <dt>Service charge</dt>
            <dd className="num">{formatCurrency(property.serviceCharge)}</dd>
          </div>
        )}
      </dl>
      {(property.securityDeposit || property.serviceCharge) && (
        <p className="aw-breakdown-note">Deposit and service charge are listed by the landlord and are not part of AwaAgent checkout.</p>
      )}
      <Link href="/pricing" className="aw-breakdown-link">How pricing works</Link>
    </div>
  );
}
