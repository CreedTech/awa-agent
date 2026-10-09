"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { PropImage } from "@/components/shared/prop-image";
import { SaveButton } from "@/components/property/save-button";
import { formatCurrency } from "@/lib/utils";
import type { Property } from "@/lib/types";

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
  /** Explore query string to return to from the listing page. */
  backQuery?: string;
}

export function PropertyCard({ property, priority, backQuery }: PropertyCardProps) {
  const href = `/properties/${property.id}${backQuery ? `?back=${encodeURIComponent(`/explore${backQuery}`)}` : ""}`;
  const photoCount = property.images.length;

  return (
    <article className="aw-card">
      <div className="aw-card-media">
        <PropImage
          src={property.images[0]}
          label={`${property.title}, ${property.area}`}
          className="aw-card-photo"
          sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 400px"
          priority={priority}
        />
        {photoCount > 1 && (
          <span className="aw-card-count">
            <Icon name="image" size={14} /> {photoCount}
          </span>
        )}
        <div className="aw-card-save">
          <SaveButton propertyId={property.id} variant="overlay" />
        </div>
      </div>
      <div className="aw-card-body">
        <p className="aw-card-price">
          <strong className="num">{formatCurrency(property.baseRent)}</strong>
          <span>/ first year</span>
        </p>
        {property.year2Rent && (
          <p className="aw-card-year2"><span className="num">{formatCurrency(property.year2Rent)}</span> / year from year two</p>
        )}
        <p className="aw-card-facts">
          {[
            property.beds > 0 && <span key="bd"><b>{property.beds}</b> bd</span>,
            property.baths > 0 && <span key="ba"><b>{property.baths}</b> ba</span>,
            <span key="type">{property.type}</span>,
          ].filter(Boolean)}
        </p>
        <h3 className="aw-card-title">
          <Link href={href} className="aw-stretch">{property.title}</Link>
        </h3>
        <p className="aw-card-place">
          <Icon name="pin" size={14} />
          <span>{property.area || "Area not listed"}{property.landmark && ` · near ${property.landmark}`}</span>
        </p>
        <div className="aw-card-meta">
          <p className={property.available ? "aw-card-status" : "aw-card-status is-off"}>
            {property.available ? "Taking inspection requests" : "Not taking inspections"}
          </p>
          {property.agentTrustScore !== undefined && (
            <span className="aw-card-trust" title="Agent trust score out of 100">
              <Icon name="shieldCheck" size={14} /> Agent trust {property.agentTrustScore}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
