"use client";

import { useMemo, useState } from "react";
import { BottomSheet } from "@/components/shared/bottom-sheet";
import { Icon } from "@/components/ui/icon";
import { useAppStore } from "@/store/app-store";
import { DEFAULT_MAX_INSPECTIONS_PER_DAY } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Property } from "@/lib/types";

const TIMES = ["9:00 AM", "11:30 AM", "2:00 PM", "4:00 PM"];
const DAYS = ["Mon 8 Jun", "Tue 9 Jun", "Wed 10 Jun", "Thu 11 Jun", "Fri 12 Jun"];

/** Deterministic "taken" count so availability is stable per render. */
function takenFor(dayIdx: number, timeIdx: number) {
  return (dayIdx * 3 + timeIdx * 5) % (DEFAULT_MAX_INSPECTIONS_PER_DAY + 1);
}

interface BookingSheetProps {
  property: Property;
  open: boolean;
  onClose: () => void;
  onBooked?: (inspectionId: string) => void;
}

export function BookingSheet({ property, open, onClose, onBooked }: BookingSheetProps) {
  const bookInspection = useAppStore((s) => s.bookInspection);
  const [dayIdx, setDayIdx] = useState(0);
  const [time, setTime] = useState<string | null>(null);

  const slots = useMemo(
    () =>
      TIMES.map((t, ti) => {
        const taken = takenFor(dayIdx, ti);
        const left = DEFAULT_MAX_INSPECTIONS_PER_DAY - taken;
        return { time: t, left, full: left <= 0 };
      }),
    [dayIdx],
  );

  const dayFull = slots.every((s) => s.full);
  const selected = slots.find((s) => s.time === time);

  const handleBook = () => {
    if (!time) return;
    const insp = bookInspection(property.id, DAYS[dayIdx], time);
    toast.success("Inspection booked", { description: `${DAYS[dayIdx]} · ${time}` });
    onClose();
    setTime(null);
    onBooked?.(insp.id);
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Book an inspection" maxWidth={480}>
      <div style={{ padding: "8px 20px 24px" }}>
        <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 14 }}>
          Pick a day and time. You&apos;ll get a 6-digit code to read to the agent on-site.
        </p>

        <span className="label" style={{ marginBottom: 8, display: "block" }}>Day</span>
        <div className="row gap-2 scroll" style={{ overflowX: "auto", paddingBottom: 6, marginBottom: 18 }}>
          {DAYS.map((d, i) => {
            const remaining = TIMES.reduce((n, _, ti) => n + Math.max(0, DEFAULT_MAX_INSPECTIONS_PER_DAY - takenFor(i, ti)), 0);
            return (
              <button
                key={d}
                className={cn("chip", dayIdx === i && "is-active")}
                style={{ flexDirection: "column", alignItems: "flex-start", padding: "9px 14px", height: "auto" }}
                onClick={() => { setDayIdx(i); setTime(null); }}
              >
                <span>{d}</span>
                <span style={{ fontSize: 11, opacity: 0.7 }}>{remaining > 0 ? `${remaining} slots` : "Fully booked"}</span>
              </button>
            );
          })}
        </div>

        <span className="label" style={{ marginBottom: 8, display: "block" }}>Time</span>
        <div className="col gap-2">
          {slots.map((s) => (
            <button
              key={s.time}
              disabled={s.full}
              onClick={() => setTime(s.time)}
              className="row between"
              style={{
                padding: "13px 16px",
                borderRadius: 12,
                border: `1.5px solid ${time === s.time ? "var(--navy-800)" : "var(--line-2)"}`,
                background: time === s.time ? "var(--navy-050)" : s.full ? "var(--paper-2)" : "#fff",
                opacity: s.full ? 0.55 : 1,
                cursor: s.full ? "not-allowed" : "pointer",
                fontWeight: 600,
              }}
            >
              <span>{s.time}</span>
              <span style={{ fontSize: 12.5, color: s.full ? "var(--danger)" : "var(--muted)" }}>
                {s.full ? "Fully booked" : `${s.left} of ${DEFAULT_MAX_INSPECTIONS_PER_DAY} left`}
              </span>
            </button>
          ))}
        </div>

        {dayFull && (
          <div className="row gap-2" style={{ marginTop: 14, padding: "11px 13px", background: "var(--warn-bg)", color: "var(--warn)", borderRadius: 10, fontSize: 13 }}>
            <Icon name="clock" size={16} /> This day is full - join the waitlist (queue position #3).
          </div>
        )}

        <div className="row gap-2" style={{ marginTop: 16, padding: "11px 13px", background: "var(--lock-bg)", color: "var(--lock)", borderRadius: 10, fontSize: 12.5 }}>
          <Icon name="lock" size={16} />
          <span>The exact address stays hidden until the agent approves your inspection.</span>
        </div>

        <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 18 }} disabled={!time} onClick={handleBook}>
          {selected ? `Book ${DAYS[dayIdx]} · ${time}` : "Select a time"}
        </button>
      </div>
    </BottomSheet>
  );
}
