"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { PropImage } from "@/components/shared/prop-image";
import { Avatar } from "@/components/shared/avatar";
import { TrustBadge } from "@/components/shared/trust-badge";
import { Naira } from "@/components/shared/naira";
import { RestrictedPrompt } from "@/components/property/restricted-prompt";
import { BookingSheet } from "@/components/inspection/booking-sheet";
import { LocationPanel } from "@/components/shared/location-panel";
import { Footer } from "@/components/layout/footer";
import { useAppStore } from "@/store/app-store";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/property-service";
import { ApiError } from "@/lib/api";

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const liveProperty = useQuery({
    queryKey: ["property", id],
    queryFn: () => propertyService.get(id),
    enabled: !!id,
  });
  const property = liveProperty.data;
  const unlockedAddress = useAppStore((s) => s.inspections.find((i) => i.propertyId === id && i.addressUnlocked)?.exactAddress);
  const unlocked = Boolean(unlockedAddress);
  const role = useAuthStore((s) => s.role);
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const savedHomes = useQuery({ queryKey: ["saved-properties"], queryFn: propertyService.saved, enabled: isAuthed && role === "tenant" });
  const isSaved = savedHomes.data?.some((item) => item.id === id) ?? false;

  const [booking, setBooking] = useState(false);
  const [restricted, setRestricted] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const toggleSaved = async () => {
    setSaving(true); setSaveError(null);
    try {
      if (isSaved) await propertyService.unsave(id);
      else await propertyService.save(id);
      await savedHomes.refetch();
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : "Could not update saved home.");
    } finally { setSaving(false); }
  };

  if (liveProperty.isPending) return <div className="page">Loading property...</div>;
  if (liveProperty.isError && !(liveProperty.error instanceof ApiError && liveProperty.error.status === 404)) {
    return <div className="page" role="alert">Could not load this property. Please try again.</div>;
  }
  if (!property) return notFound();

  const isGuest = !isAuthed || role === "guest";

  const guard = (action: string, fn: () => void) => () => {
    if (isGuest) setRestricted(action);
    else fn();
  };

  return (
    <>
      <div className="page">
        {/* Gallery */}
        <div className="gallery" style={{ marginBottom: 22 }}>
          {property.images.slice(0, 5).map((src, i) => (
            <PropImage key={i} src={src} label={property.imageLabels[i]} className="h-full w-full" sizes="(max-width:720px) 100vw, 60vw" priority={i < 2} />
          ))}
        </div>

        <div className="detail-grid">
          {/* Main */}
          <div className="col gap-5">
            <div>
              <div className="row gap-2 wrap" style={{ marginBottom: 8 }}>
                <span className="tag tag-navy">{property.type}</span>
                {property.available ? (
                  <span className="tag tag-ok">Available now</span>
                ) : (
                  <span className="tag tag-lock">Occupied{property.nextFree ? ` · free ${property.nextFree}` : ""}</span>
                )}
                {property.badge === "Premium" && <span className="tag tag-gold">Premium</span>}
              </div>
              <h1 style={{ fontSize: 30 }}>{property.title}</h1>
              <div className="row gap-3 wrap" style={{ color: "var(--muted)", marginTop: 8, fontSize: 14.5 }}>
                <span className="row gap-2"><Icon name="pin" size={16} /> {property.area} · Near {property.landmark}</span>
                <span className="row gap-2"><Icon name="bed" size={16} /> {property.beds} bed</span>
                <span className="row gap-2"><Icon name="bath" size={16} /> {property.baths} bath</span>
              </div>
            </div>

            <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--ink-2)" }}>{property.description}</p>

            {/* Amenities */}
            <div>
              <h3 style={{ fontSize: 17, marginBottom: 12 }}>What this place offers</h3>
              <div className="row wrap gap-2">
                {property.amenities.map((a) => (
                  <span key={a} className="chip"><Icon name="check" size={14} strokeWidth={2.2} color="var(--ok)" /> {a}</span>
                ))}
              </div>
            </div>

            {/* Address privacy gate */}
            <div className="card card-pad">
              <div className="row between" style={{ marginBottom: 12 }}>
                <h3 style={{ fontSize: 17 }}>Location</h3>
                <span className={`tag ${unlocked ? "tag-ok" : "tag-lock"}`}>
                  <Icon name={unlocked ? "pin" : "lock"} size={13} strokeWidth={2} /> {unlocked ? "Unlocked" : "Hidden until inspection"}
                </span>
              </div>
              <LocationPanel unlocked={unlocked} landmark={property.landmark} address={unlockedAddress} />
              {unlocked ? (
                <div className="col gap-3" style={{ marginTop: 14 }}>
                  <div className="row gap-2"><Icon name="pin" size={16} color="var(--gold-600)" /> <strong style={{ fontSize: 14.5 }}>{unlockedAddress}</strong></div>
                  <div className="card" style={{ background: "var(--ok-bg)", border: "none", padding: "12px 14px" }}>
                    <strong className="row gap-2" style={{ color: "var(--ok)", fontSize: 13.5 }}><Icon name="shieldCheck" size={15} strokeWidth={2} /> Safety tips</strong>
                    <ul style={{ margin: "8px 0 0 18px", color: "var(--ink-2)", fontSize: 13, lineHeight: 1.7 }}>
                      <li>Inspect during daylight and tell someone where you&apos;re going.</li>
                      <li>Never pay any &ldquo;viewing fee&rdquo; - it&apos;s illegal on AwaAgent.</li>
                      <li>Only share your OTP with the verified agent, in person.</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <p style={{ marginTop: 12, color: "var(--muted)", fontSize: 13.5 }}>
                  For everyone&apos;s safety, the exact address unlocks after the agent verifies your inspection code.
                </p>
              )}
            </div>

            {/* Agent */}
            {property.agentName && (
              <div className="card card-pad row between wrap gap-3">
                <div className="row gap-3">
                  <Avatar name={property.agentName} size={52} gold />
                  <div className="col" style={{ gap: 2 }}>
                    <strong style={{ fontSize: 15 }}>{property.agentName}</strong>
                    {property.agentKycStatus === "VERIFIED" && <span className="row gap-2" style={{ fontSize: 12.5, color: "var(--ok)", fontWeight: 600 }}>
                      <Icon name="shieldCheck" size={14} strokeWidth={2} /> NIN-verified agent
                    </span>}
                  </div>
                </div>
                {property.agentTrustScore !== undefined && <TrustBadge score={property.agentTrustScore} />}
              </div>
            )}
          </div>

          {/* Aside */}
          <aside className="detail-aside">
            <div className="card card-pad col gap-4">
              <div className="col" style={{ gap: 2 }}>
                <span style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 600 }}>Total first-year price</span>
                <Naira value={property.baseRent} size={30} />
              </div>
              <div className="col gap-2">
                <button className="btn btn-ghost btn-block" onClick={guard("book an inspection", () => setBooking(true))}>
                  <Icon name="calendar" size={17} /> Request inspection
                </button>
                {role === "tenant" && <button className="btn btn-quiet btn-block" onClick={toggleSaved} disabled={saving || savedHomes.isPending}>
                  {isSaved ? "Remove from saved homes" : "Save this home"}
                </button>}
                {saveError && <p role="alert" style={{ color: "var(--danger)", fontSize: 13 }}>{saveError}</p>}
                <p style={{ color: "var(--muted)", fontSize: 13 }}>Online payment is currently unavailable.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <BookingSheet property={property} open={booking} onClose={() => setBooking(false)} />
      <RestrictedPrompt open={restricted !== null} onClose={() => setRestricted(null)} action={restricted ?? undefined} />

      <Footer />
    </>
  );
}
