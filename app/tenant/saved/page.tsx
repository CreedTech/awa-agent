"use client";

import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/property-service";
import { PropertyCard } from "@/components/property/property-card";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export default function SavedHomesPage() {
  const saved = useQuery({ queryKey: ["saved-properties"], queryFn: propertyService.saved });
  return <div className="page col gap-5">
    <PageHeader title="Saved homes" subtitle="Properties saved to your account." />
    {saved.isPending ? <p>Loading saved homes...</p> : saved.isError ? <p role="alert">Could not load saved homes.</p> :
      saved.data.length === 0 ? <EmptyState icon="home" title="No saved homes" description="Save a listing to find it here later."
        action={{ label: "Explore homes", href: "/explore" }} /> :
        <div className="aw-grid">{saved.data.map((property) => <PropertyCard key={property.id} property={property} />)}</div>}
  </div>;
}
