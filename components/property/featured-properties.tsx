"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { PropertyCard } from "@/components/property/property-card";
import { ListingSkeleton } from "@/components/property/listing-skeleton";
import { LoadError } from "@/components/property/load-error";
import { NoInventory } from "@/components/property/no-inventory";
import { useListings } from "@/hooks/use-listings";
import { isPublicListing } from "@/lib/listings";

export function FeaturedProperties() {
  const { listings, properties, isGuestView } = useListings();
  const live = (properties ?? []).filter(isPublicListing);
  const featured = [...live].sort((a, b) => Number(b.images.length > 0) - Number(a.images.length > 0)).slice(0, 6);

  return (
    <section className="aw-section aw-wrap" aria-labelledby="homes-heading">
      <div className="aw-section-head">
        <h2 id="homes-heading" className="aw-h2">Homes for rent</h2>
        {listings.isSuccess && live.length > 0 && !isGuestView && (
          <p className="aw-section-meta">{live.length === 1 ? "1 home" : `${live.length} homes`} open for inspection</p>
        )}
        {live.length > 0 && (
          <Link href="/explore" className="aw-link-arrow">
            See all homes <Icon name="arrowR" size={16} />
          </Link>
        )}
      </div>
      {listings.isPending ? (
        <ListingSkeleton count={3} />
      ) : listings.isError ? (
        <LoadError title="We couldn't load homes just now" onRetry={() => listings.refetch()} retrying={listings.isFetching} />
      ) : featured.length === 0 ? (
        <NoInventory />
      ) : (
        <div className="aw-grid">
          {featured.map((property, index) => (
            <PropertyCard key={property.id} property={property} priority={index === 0} />
          ))}
        </div>
      )}
    </section>
  );
}
