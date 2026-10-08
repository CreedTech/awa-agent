"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { PropImage } from "@/components/shared/prop-image";
import { Naira } from "@/components/shared/naira";
import { TrustBadge } from "@/components/shared/trust-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import type { Property } from "@/lib/types";

export function PropertyCard({ property, priority }: { property: Property; priority?: boolean }) {
  const total = property.baseRent;

  return (
    <article className="prop-card-premium">
      <Link href={`/properties/${property.id}`} aria-label={property.title}>
        <div className="prop-photo-premium">
          <PropImage 
            src={property.images[0]} 
            label={property.imageLabels[0]} 
            className="h-full w-full" 
            sizes="(max-width:720px) 100vw, 340px" 
            priority={priority} 
          />
          <div className="prop-overlay-premium"></div>
          
          <div className="prop-badges-premium">
            {property.available ? (
              <StatusBadge variant="ok">
                <Icon name="check" size={12} strokeWidth={2.4} /> Available
              </StatusBadge>
            ) : (
              <StatusBadge variant="lock">Occupied{property.nextFree ? ` · ${property.nextFree}` : ""}</StatusBadge>
            )}
            {property.badge === "Premium" && <StatusBadge variant="gold">Premium</StatusBadge>}
          </div>
        </div>
      </Link>


      <Link href={`/properties/${property.id}`}>
        <div className="prop-content-premium">
          <div className="prop-specs-premium">
            <span className="prop-spec">
              <Icon name="bed" size={15} /> {property.beds} bed
            </span>
            <span className="prop-spec">
              <Icon name="bath" size={15} /> {property.baths} bath
            </span>
            <span className="prop-spec-type">{property.type}</span>
          </div>

          <h3 className="prop-title-premium">{property.title}</h3>

          <div className="prop-location-premium">
            <Icon name="pin" size={14} /> 
            <span>{property.area} · Near {property.landmark}</span>
          </div>

          <div className="prop-footer-premium">
            <div className="prop-price-section">
              <Naira value={total} size={20} />
              <span className="prop-price-label">Total first-year price</span>
            </div>
            {property.agentTrustScore !== undefined && <TrustBadge score={property.agentTrustScore} sm />}
          </div>
        </div>
      </Link>
    </article>
  );
}
