"use client";

import { useAppStore } from "@/store/app-store";
import { PropertyCard } from "@/components/property/property-card";

export function FeaturedProperties() {
  const properties = useAppStore((state) => state.properties);
  const featured = properties.filter((property) => property.available).slice(0, 3);
  return <div className="prop-grid-premium">
    {featured.map((property, index) => <div key={property.id} className="prop-card-wrapper" style={{ animationDelay: `${index * 0.15}s` }}>
      <PropertyCard property={property} priority={index === 0} />
    </div>)}
  </div>;
}
