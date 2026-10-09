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
      toast.success("Inspection requested", { description: label(days[dayIdx]) });
      onClose();
      onBooked?.(inspection.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not book inspection.");
    } finally {
      setSubmitting(false);
    }
  };

  const label = (day: string) => new Date(`${day}T12:00:00`).toLocaleDateString("en-NG", { weekday: "short", day: "numeric", month: "short" });

  return <BottomSheet open={open} onClose={onClose} title="Request an inspection" maxWidth={480}>
    <div className="aw-booking">
      <p>Choose a preferred day for {property.title}. You&apos;ll get a six-digit code to read to the agent at the property.</p>
      <fieldset>
        <legend>Preferred day</legend>
        <div className="aw-chips">
          {days.map((day, index) => (
            <button key={day} type="button" className={cn("aw-chip", dayIdx === index && "is-on")} aria-pressed={dayIdx === index} onClick={() => setDayIdx(index)}>
              {label(day)}
            </button>
          ))}
        </div>
      </fieldset>
      <p className="aw-booking-note">
        <Icon name="lock" size={16} /> The street address stays hidden until the agent enters your code in person.
      </p>
      <button className="aw-btn aw-btn-clay aw-btn-block" disabled={submitting} onClick={handleBook}>
        {submitting ? "Sending request..." : `Request ${label(days[dayIdx])}`}
      </button>
    </div>
  </BottomSheet>;
}
