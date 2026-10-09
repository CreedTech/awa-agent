"use client";

import { Suspense, useCallback, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams, notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Icon } from "@/components/ui/icon";
import { PropertyGallery } from "@/components/property/property-gallery";
import { InspectionPanel } from "@/components/property/inspection-panel";
import { AgentCard } from "@/components/property/agent-card";
import { SaveButton } from "@/components/property/save-button";
import { LoadError } from "@/components/property/load-error";
import { RestrictedPrompt } from "@/components/property/restricted-prompt";
import { BookingSheet } from "@/components/inspection/booking-sheet";
import { LocationPanel } from "@/components/shared/location-panel";
import { useAppStore } from "@/store/app-store";
import { useAuthStore } from "@/store/auth-store";
import { propertyService } from "@/services/property-service";
import { ApiError } from "@/lib/api";
import { bathLabel, bedLabel } from "@/lib/listings";
import { formatCurrency } from "@/lib/utils";

function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const params = useSearchParams();
  const back = params.get("back");
  const backHref = back && back.startsWith("/explore") ? back : "/explore";
  const listing = useQuery({ queryKey: ["property", id], queryFn: () => propertyService.get(id), enabled: !!id });
  const unlockedAddress = useAppStore((s) => s.inspections.find((i) => i.propertyId === id && i.addressUnlocked)?.exactAddress);
  const role = useAuthStore((s) => s.role);
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const [booking, setBooking] = useState(false);
  const [restricted, setRestricted] = useState<string | null>(null);
  const closeBooking = useCallback(() => setBooking(false), []);
  const closeRestricted = useCallback(() => setRestricted(null), []);

  if (listing.isPending) {
    return (
      <div className="aw-wrap aw-detail" aria-busy="true">
        <div className="aw-gallery aw-gallery-1"><div className="aw-gallery-tile aw-shimmer" /></div>
        <span className="aw-shimmer aw-line-lg" style={{ marginTop: 32 }} />
      </div>
    );
  }
  if (listing.isError) {
    if (listing.error instanceof ApiError && listing.error.status === 404) notFound();
    return (
      <div className="aw-wrap aw-detail">
        <LoadError title="We couldn't load this home" message="Check your connection and try again." onRetry={() => listing.refetch()} retrying={listing.isFetching} />
      </div>
    );
  }

  const property = listing.data;
  const isGuest = !isAuthed || role === "guest";
  const isPartner = !isGuest && role !== "tenant";
  const requestInspection = () => (isGuest ? setRestricted("request an inspection") : setBooking(true));

  const share = async () => {
    const url = window.location.href.split("?")[0];
    try {
      if (navigator.share) await navigator.share({ title: property.title, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch (cause) {
      if (!(cause instanceof DOMException && cause.name === "AbortError")) toast.error("Could not share this link.");
    }
  };

  return (
    <>
      <div className="aw-wrap aw-detail">
        <div className="aw-detail-top">
          <Link href={backHref} className="aw-back">
            <Icon name="arrowL" size={18} /> Back to homes
          </Link>
          <div className="aw-detail-tools">
            <button type="button" className="aw-btn aw-btn-line aw-btn-sm" onClick={share}>
              <Icon name="share" size={17} /> Share
            </button>
            <SaveButton propertyId={property.id} onGuest={() => setRestricted("save homes")} />
          </div>
        </div>

        <PropertyGallery images={property.images} title={property.title} />

        <div className="aw-detail-grid">
          <div className="aw-detail-main">
            <header className="aw-detail-head">
              <p className="aw-detail-place">
                <span>{property.area || "Area not listed"}</span>
                {property.landmark && <> · near {property.landmark}</>}
              </p>
              <h1 className="aw-h1">{property.title}</h1>
              <ul className="aw-facts">
                <li>{property.type}</li>
                {property.beds > 0 && <li>{bedLabel(property.beds)}</li>}
                {property.baths > 0 && <li>{bathLabel(property.baths)}</li>}
                <li className={property.available ? "is-ok" : undefined}>
                  {property.available ? "Taking inspection requests" : "Not taking inspections"}
                </li>
              </ul>
            </header>

            {property.description && (
              <section className="aw-detail-section" aria-labelledby="about-heading">
                <h2 id="about-heading">About this home</h2>
                <p className="aw-prose">{property.description}</p>
              </section>
            )}

            {property.amenities.length > 0 && (
              <section className="aw-detail-section" aria-labelledby="amenities-heading">
                <h2 id="amenities-heading">What&apos;s included</h2>
                <ul className="aw-amenities">
                  {property.amenities.map((amenity) => (
                    <li key={amenity}>
                      <Icon name="check" size={18} /> {amenity}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="aw-detail-section" aria-labelledby="location-heading">
              <h2 id="location-heading">Location</h2>
              <LocationPanel unlocked={Boolean(unlockedAddress)} address={unlockedAddress} area={property.area} landmark={property.landmark} />
            </section>

            {property.agentName && (
              <section className="aw-detail-section" aria-labelledby="agent-heading">
                <h2 id="agent-heading">Who you&apos;ll meet</h2>
                <AgentCard name={property.agentName} kycStatus={property.agentKycStatus} trustScore={property.agentTrustScore} />
              </section>
            )}
          </div>

          <aside className="aw-detail-aside" aria-label="Rent and inspection">
            <InspectionPanel property={property} onRequest={requestInspection} />
          </aside>
        </div>
      </div>

      <div className="aw-actionbar">
        <div>
          <strong className="num">{formatCurrency(property.baseRent)}</strong>
          <span>first-year rent</span>
        </div>
        <button type="button" className="aw-btn aw-btn-clay" onClick={requestInspection} disabled={!property.available || isPartner}>
          {property.available ? "Request inspection" : "Not taking inspections"}
        </button>
      </div>

      <BookingSheet property={property} open={booking} onClose={closeBooking} />
      <RestrictedPrompt open={restricted !== null} onClose={closeRestricted} action={restricted ?? undefined} />
    </>
  );
}

export default function PropertyDetailPage() {
  return (
    <Suspense fallback={<div className="aw-wrap aw-detail" aria-busy="true" />}>
      <PropertyDetail />
    </Suspense>
  );
}
