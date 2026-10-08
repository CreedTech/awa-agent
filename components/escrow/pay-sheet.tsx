"use client";

import { BottomSheet } from "@/components/shared/bottom-sheet";
import { Naira } from "@/components/shared/naira";
import type { Property } from "@/lib/types";

export function PaySheet({ property, open, onClose }: { property: Property; open: boolean; onClose: () => void }) {
  return <BottomSheet open={open} onClose={onClose} title="Payment unavailable" maxWidth={460}>
    <div className="col gap-4" style={{ padding: "12px 20px 26px" }}>
      <strong>{property.title}</strong>
      <div className="row between"><span>Listed first-year price</span><Naira value={property.baseRent} size={20} /></div>
      <p style={{ color: "var(--muted)", fontSize: 14 }}>
        Checkout is not connected to a real payment provider yet. No payment can be collected here.
      </p>
      <button className="btn btn-primary btn-block" onClick={onClose}>Close</button>
    </div>
  </BottomSheet>;
}
