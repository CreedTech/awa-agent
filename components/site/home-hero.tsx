"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { PropImage } from "@/components/shared/prop-image";
import { HomeSearch } from "@/components/site/home-search";
import { useListings } from "@/hooks/use-listings";
import { isPublicListing } from "@/lib/listings";
import { SITE_IMAGES } from "@/lib/site-images";
import { formatCurrency } from "@/lib/utils";

export function HomeHero() {
  const { listings, properties, coverage } = useListings();
  const photographed = (properties ?? []).filter((property) => isPublicListing(property) && property.images.length > 0);
  const lead = photographed[0];

  return (
    <section className="aw-hero">
      <div className="aw-hero-band">
        <div className="aw-wrap aw-hero-grid">
          <div className="aw-hero-copy">
            <h1 className="aw-hero-title">
              Rent a home you&apos;ve <mark>seen in person.</mark>
            </h1>
            <p className="aw-hero-lede">
              One price with no agency, agreement or viewing fees. Inspect with a verified agent, and get the exact address only when your visit checks out.
            </p>
            <HomeSearch coverage={coverage} loading={listings.isPending} />
            <Link href="/trust-safety#address" className="aw-assurance">
              <Icon name="lock" size={17} />
              <span>Exact address shared after your in-person verification</span>
              <Icon name="arrowR" size={16} />
            </Link>
          </div>

          <div className="aw-hero-collage">
            {lead ? (
              <Link href={`/properties/${lead.id}`} className="aw-collage-main">
                <PropImage src={lead.images[0]} label={`${lead.title}, ${lead.area}`} className="aw-fill" sizes="(max-width: 1024px) 70vw, 34vw" priority />
                <span className="aw-collage-tag">
                  <strong className="num">{formatCurrency(lead.baseRent)}</strong> first-year rent · {lead.area}
                </span>
              </Link>
            ) : (
              <figure className="aw-collage-main">
                <PropImage src={SITE_IMAGES.apartments.src} label={SITE_IMAGES.apartments.alt} className="aw-fill" sizes="(max-width: 1024px) 70vw, 34vw" priority />
              </figure>
            )}
            <figure className="aw-collage-side">
              <PropImage src={SITE_IMAGES.rooftops.src} label={SITE_IMAGES.rooftops.alt} className="aw-fill" sizes="(max-width: 1024px) 40vw, 18vw" />
            </figure>
            <div className="aw-collage-code">
              <span className="aw-collage-code-label">Your inspection code</span>
              <span className="aw-code-slots" aria-hidden>
                {Array.from({ length: 6 }, (_, index) => <i key={index} />)}
              </span>
              <span className="aw-collage-code-note">
                <Icon name="checkCircle" size={15} /> Six digits, read to the agent at the door
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
