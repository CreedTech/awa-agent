"use client";

import { BottomSheet } from "@/components/shared/bottom-sheet";
import { Naira } from "@/components/shared/naira";
import type { Property } from "@/lib/types";
import { useState } from "react";
import { escrowService } from "@/services/escrow-service";
import { ApiError } from "@/lib/api";

export function PaySheet({ property, open, onClose }: { property: Property; open: boolean; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const proceed = async () => {
    setBusy(true); setError(null);
    try {
      const session = await escrowService.initialize(property.id);
      window.location.assign(session.checkoutUrl);
    } catch (cause) {
      setError(cause instanceof ApiError && cause.status >= 500 ? "We couldn't start checkout right now. Please try again later." : cause instanceof Error ? cause.message : "Could not start checkout.");
      setBusy(false);
    }
  };

  return <BottomSheet open={open} onClose={onClose} title="Pay with Paystack" maxWidth={460}>
    <div className="col gap-4" style={{ padding: "12px 20px 26px" }}>
      <strong>{property.title}</strong>
      <div className="row between"><span>Listed first-year price</span><Naira value={property.baseRent} size={20} /></div>
      {error && <p role="alert" style={{ color: "var(--danger)" }}>{error}</p>}
      <button className="btn btn-primary btn-block" disabled={busy} onClick={proceed}>{busy ? "Opening checkout..." : "Continue to Paystack"}</button>
      <button className="btn btn-quiet btn-block" onClick={onClose}>Close</button>
    </div>
  </BottomSheet>;
}
