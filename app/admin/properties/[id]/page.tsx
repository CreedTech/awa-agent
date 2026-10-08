"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/property-service";
import { PageHeader } from "@/components/shared/page-header";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const listing = useQuery({ queryKey: ["admin-listing", id], queryFn: () => propertyService.manage(id), enabled: Boolean(id) });
  return <div className="page page-narrow col gap-4">
    <Link href="/admin/properties">All properties</Link>
    <PageHeader title="Listing details" subtitle="Review the submitted property and its ownership." />
    {listing.isPending ? <p>Loading listing...</p> : listing.isError ? <p role="alert">Could not load this listing.</p> : listing.data &&
      <div className="card card-pad col gap-3">
        <strong>{listing.data.title}</strong>
        <span>Status: {listing.data.status.replaceAll("_", " ")}</span>
        <p>{listing.data.description}</p>
        <span>Type: {listing.data.property_type}; {listing.data.bedrooms} bedrooms, {listing.data.bathrooms} bathrooms</span>
        <span>Year-one rent: ₦{Number(listing.data.year_1_rent_naira).toLocaleString("en-NG")}</span>
        <span>Year-two rent: ₦{Number(listing.data.year_2_rent_naira).toLocaleString("en-NG")}</span>
        <span>Address: {listing.data.address_street}, {listing.data.address_lga}</span>
        <span>Landmark: {listing.data.nearest_landmark}</span>
        <span>Agent ID: {listing.data.agent_id}</span>
        {listing.data.photos?.map((url, index) => <a key={url} href={url} target="_blank" rel="noreferrer">Open photo {index + 1}</a>)}
      </div>}
  </div>;
}
