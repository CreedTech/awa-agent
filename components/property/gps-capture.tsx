"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { IBADAN_CENTER } from "@/lib/constants";
import type { GeoPoint } from "@/lib/types";

type State = "idle" | "capturing" | "captured" | "denied";

interface GpsCaptureProps {
  value: GeoPoint | null;
  onCapture: (point: GeoPoint) => void;
}

/**
 * GPS location capture for adding a property.
 * Uses navigator.geolocation; on denial shows the "enable & retry" state.
 * In the prototype a denial falls back to a simulated Ibadan coordinate.
 * TODO(maps): reverse-geocode the point and show it on a real map.
 */
export function GpsCapture({ value, onCapture }: GpsCaptureProps) {
  const [state, setState] = useState<State>(value ? "captured" : "idle");

  const capture = () => {
    setState("capturing");
    if (!navigator.geolocation) {
      simulate();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onCapture({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setState("captured");
      },
      () => setState("denied"),
      { timeout: 8000 },
    );
  };

  // Demo fallback: jitter around Ibadan centre.
  const simulate = () => {
    const point = {
      lat: IBADAN_CENTER.lat + (Math.random() - 0.5) * 0.06,
      lng: IBADAN_CENTER.lng + (Math.random() - 0.5) * 0.06,
    };
    onCapture(point);
    setState("captured");
  };

  if (state === "captured" && value) {
    return (
      <div className="card card-pad row between" style={{ background: "var(--ok-bg)", border: "none" }}>
        <div className="row gap-3">
          <Icon name="gps" size={22} color="var(--ok)" />
          <div className="col" style={{ gap: 2 }}>
            <strong style={{ fontSize: 14, color: "var(--ok)" }}>Location captured</strong>
            <span className="mono" style={{ fontSize: 12.5, color: "var(--ink-2)" }}>
              {value.lat.toFixed(5)}° N, {value.lng.toFixed(5)}° E
            </span>
          </div>
        </div>
        <button className="btn btn-quiet btn-sm" onClick={capture}>Recapture</button>
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className="card card-pad col gap-3" style={{ background: "var(--danger-bg)", border: "none" }}>
        <div className="row gap-3">
          <Icon name="alert" size={22} color="var(--danger)" />
          <div className="col" style={{ gap: 2 }}>
            <strong style={{ fontSize: 14, color: "var(--danger)" }}>Location blocked</strong>
            <span style={{ fontSize: 12.5, color: "var(--ink-2)" }}>Enable location access in your browser, then retry.</span>
          </div>
        </div>
        <div className="row gap-2">
          <button className="btn btn-danger btn-sm" onClick={capture}><Icon name="refresh" size={15} /> Enable & retry</button>
          <button className="btn btn-quiet btn-sm" onClick={simulate}>Use demo location</button>
        </div>
      </div>
    );
  }

  return (
    <button className="card card-pad col center" style={{ width: "100%", gap: 10, padding: "28px", border: "1.5px dashed var(--line-2)" }} onClick={capture} disabled={state === "capturing"}>
      {state === "capturing" ? <div className="spinner" /> : <Icon name="gps" size={30} color="var(--navy-600)" />}
      <strong style={{ fontSize: 14.5 }}>{state === "capturing" ? "Getting your location…" : "Capture property location"}</strong>
      <span style={{ fontSize: 12.5, color: "var(--muted)", textAlign: "center" }}>
        Stand at the property and capture its GPS coordinates. Fake locations can lead to a ban.
      </span>
    </button>
  );
}
