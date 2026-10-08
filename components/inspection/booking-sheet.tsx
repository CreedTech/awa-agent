"use client";

import { useMemo, useState } from "react";
import { BottomSheet } from "@/components/shared/bottom-sheet";
import { Icon } from "@/components/ui/icon";
import { inspectionService } from "@/services/inspection-service";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Property } from "@/lib/types";

interface BookingSheetProps {
  property: Property;
  open: boolean;
  onClose: () => void;
  onBooked?: (inspectionId: string) => void;
}

export function BookingSheet({ property, open, onClose, onBooked }: BookingSheetProps) {
  const [dayIdx, setDayIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const days = useMemo(() => Array.from({ length: 5 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index + 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }), []);

  const handleBook = async () => {
    setSubmitting(true);
    try {
      const inspection = await inspectionService.book(property.id, days[dayIdx]);
      toast.success("Inspection booked", { description: days[dayIdx] });
      onClose();
      onBooked?.(inspection.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not book inspection.");
    } finally {
      setSubmitting(false);
    }
  };

  return <BottomSheet open={open} onClose={onClose} title="Book an inspection" maxWidth={480}>
    <div style={{ padding: "8px 20px 24px" }}>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 14 }}>
        Choose a preferred day. You&apos;ll get a 6-digit code to read to the agent on-site.
      </p>
      <span className="label" style={{ marginBottom: 8, display: "block" }}>Preferred day</span>
      <div className="row gap-2 scroll" style={{ overflowX: "auto", paddingBottom: 6, marginBottom: 18 }}>
        {days.map((day, index) => <button key={day} className={cn("chip", dayIdx === index && "is-active")} onClick={() => setDayIdx(index)}>{day}</button>)}
      </div>
      <div className="row gap-2" style={{ marginTop: 16, padding: "11px 13px", background: "var(--lock-bg)", color: "var(--lock)", borderRadius: 10, fontSize: 12.5 }}>
        <Icon name="lock" size={16} /> The exact address stays hidden until the agent verifies your code in person.
      </div>
      <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 18 }} disabled={submitting} onClick={handleBook}>
        {submitting ? "Booking..." : `Request ${days[dayIdx]}`}
      </button>
    </div>
  </BottomSheet>;
}
