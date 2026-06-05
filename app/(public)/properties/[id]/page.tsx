"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { PropImage } from "@/components/shared/prop-image";
import { Avatar } from "@/components/shared/avatar";
import { TrustBadge } from "@/components/shared/trust-badge";
import { Naira } from "@/components/shared/naira";
import { RentBreakdownView } from "@/components/property/rent-breakdown";
import { EscrowExplainer } from "@/components/property/escrow-explainer";
import { RestrictedPrompt } from "@/components/property/restricted-prompt";
import { BookingSheet } from "@/components/inspection/booking-sheet";
import { PaySheet } from "@/components/escrow/pay-sheet";
import { MapPlaceholder } from "@/components/shared/map-placeholder";
import { Footer } from "@/components/layout/footer";
import { useAppStore } from "@/store/app-store";
import { useAuthStore } from "@/store/auth-store";
import { agentById } from "@/lib/mock-data";
import { calculateRentBreakdown } from "@/lib/utils";
import { toast } from "sonner";

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const property = useAppStore((s) => s.properties.find((p) => p.id === id));
  const saved = useAppStore((s) => (id ? s.savedIds.includes(id) : false));
  const toggleSaved = useAppStore((s) => s.toggleSaved);
  const unlocked = useAppStore((s) =>
    s.inspections.some((i) => i.propertyId === id && i.addressUnlocked),
  );
  const role = useAuthStore((s) => s.role);
  const isAuthed = useAuthStore((s) => s.isAuthenticated);

  const [explainer, setExplainer] = useState(false);
  const [booking, setBooking] = useState(false);
  const [paying, setPaying] = useState(false);
  const [restricted, setRestricted] = useState<string | null>(null);

  if (!property) return notFound();

  const agent = agentById(property.agentId);
  const breakdown = calculateRentBreakdown(property.baseRent, agent?.commissionPct);
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
            <PropImage key={i} src={src} label={property.imageLabels[i]} className="h-full w-full" sizes="(max-width:720px) 100vw, 60vw" priority={i === 0} />
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
              <MapPlaceholder unlocked={unlocked} landmark={property.landmark} address={property.exactAddress} location={property.location} height={200} />
              {unlocked ? (
                <div className="col gap-3" style={{ marginTop: 14 }}>
                  <div className="row gap-2"><Icon name="pin" size={16} color="var(--gold-600)" /> <strong style={{ fontSize: 14.5 }}>{property.exactAddress}</strong></div>
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
                  For everyone&apos;s safety, the exact address and map pin unlock once your inspection is approved.
                </p>
              )}
            </div>

            {/* Agent */}
            {agent && (
              <div className="card card-pad row between wrap gap-3">
                <div className="row gap-3">
                  <Avatar name={agent.name} photo={agent.photo} size={52} gold />
                  <div className="col" style={{ gap: 2 }}>
                    <strong style={{ fontSize: 15 }}>{agent.name}</strong>
                    <span style={{ fontSize: 13, color: "var(--muted)" }}>{agent.area} · {agent.deals} deals</span>
                    <span className="row gap-2" style={{ fontSize: 12.5, color: "var(--ok)", fontWeight: 600 }}>
                      <Icon name="shieldCheck" size={14} strokeWidth={2} /> NIN-verified agent
                    </span>
                  </div>
                </div>
                <TrustBadge score={agent.trust} />
              </div>
            )}
          </div>

          {/* Aside */}
          <aside className="detail-aside">
            <div className="card card-pad col gap-4">
              <div className="col" style={{ gap: 2 }}>
                <span style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 600 }}>1st-year, all-in</span>
                <Naira value={breakdown.total} size={30} />
              </div>
              <RentBreakdownView breakdown={breakdown} />
              <div className="col gap-2">
                <button className="btn btn-gold btn-block btn-lg" onClick={guard("pay securely", () => setPaying(true))}>
                  <Icon name="lock" size={18} /> Pay securely
                </button>
                <button className="btn btn-ghost btn-block" onClick={guard("book an inspection", () => setBooking(true))}>
                  <Icon name="calendar" size={17} /> Request inspection
                </button>
                <div className="row gap-2">
                  <button className="btn btn-quiet grow" onClick={guard("save this home", () => { toggleSaved(property.id); toast(saved ? "Removed from saved" : "Saved"); })}>
                    <Icon name="bookmark" size={16} strokeWidth={saved ? 2.4 : 1.7} /> {saved ? "Saved" : "Save"}
                  </button>
                  <button className="btn btn-quiet grow" onClick={() => toast("Listing reported - our team will review it.")}>
                    <Icon name="alert" size={16} /> Report
                  </button>
                </div>
              </div>
              <button className="row gap-2 center" style={{ fontSize: 13, color: "var(--navy-600)", fontWeight: 600 }} onClick={() => setExplainer(true)}>
                <Icon name="info" size={15} /> How does escrow protect me?
              </button>
            </div>
          </aside>
        </div>
      </div>

      <EscrowExplainer open={explainer} onClose={() => setExplainer(false)} />
      <BookingSheet property={property} open={booking} onClose={() => setBooking(false)} />
      <PaySheet property={property} open={paying} onClose={() => setPaying(false)} />
      <RestrictedPrompt open={restricted !== null} onClose={() => setRestricted(null)} action={restricted ?? undefined} />

      <Footer />
    </>
  );
}
