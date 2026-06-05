import { Icon } from "@/components/ui/icon";
import type { GeoPoint } from "@/lib/types";

interface MapPlaceholderProps {
  /** When false, the pin is blurred (address-privacy gate). */
  unlocked?: boolean;
  landmark?: string;
  address?: string;
  location?: GeoPoint;
  height?: number;
}

/**
 * Stand-in for Google Maps / Mapbox. Shows a gridded map with a route.
 * TODO(maps): replace with <GoogleMap> using env.googleMapsApiKey and
 * render a real route from the user's location to `location`.
 */
export function MapPlaceholder({ unlocked, landmark, address, location, height = 180 }: MapPlaceholderProps) {
  return (
    <div className="map-ph" style={{ height }}>
      {/* simple SVG route */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, filter: unlocked ? "none" : "blur(5px)" }} aria-hidden>
        <path d="M20 140 C 80 100, 120 120, 170 70 S 260 40, 300 30" fill="none" stroke="var(--navy-600)" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" opacity="0.8" />
        <circle cx="20" cy="140" r="7" fill="var(--navy-800)" />
        <circle cx="300" cy="30" r="8" fill="var(--gold-600)" stroke="#fff" strokeWidth="2.5" />
      </svg>
      <div
        className="row gap-2"
        style={{
          position: "absolute",
          left: 12,
          bottom: 12,
          background: "rgba(255,255,255,.92)",
          padding: "8px 12px",
          borderRadius: 10,
          boxShadow: "var(--sh-1)",
          maxWidth: "85%",
        }}
      >
        <Icon name={unlocked ? "pin" : "lock"} size={16} color={unlocked ? "var(--gold-600)" : "var(--muted)"} />
        <span style={{ fontSize: 13, fontWeight: 600 }}>
          {unlocked ? address ?? "Exact location" : `Near ${landmark ?? "landmark"}`}
        </span>
      </div>
      {!unlocked && (
        <div
          className="row gap-2"
          style={{ position: "absolute", right: 12, top: 12, background: "var(--lock-bg)", color: "var(--lock)", padding: "5px 10px", borderRadius: 8, fontSize: 11.5, fontWeight: 700 }}
        >
          <Icon name="lock" size={13} strokeWidth={2} /> LOCKED
        </div>
      )}
      {unlocked && location && (
        <a
          className="btn btn-gold btn-sm"
          style={{ position: "absolute", right: 12, bottom: 12 }}
          href={`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`}
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="nav" size={15} /> Navigate
        </a>
      )}
    </div>
  );
}
