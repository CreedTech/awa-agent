"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/page-header";
import { propertyService } from "@/services/property-service";
import { uploadService } from "@/services/upload-service";

export function PropertyEditor({ role }: { role: "agent" | "landlord" }) {
  const { id } = useParams<{ id: string }>();
  const listing = useQuery({ queryKey: ["managed-listing", id], queryFn: () => propertyService.manage(id), enabled: Boolean(id) });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!listing.data) return;
    setBusy(true); setMessage(null);
    const form = new FormData(event.currentTarget);
    const value = (key: string) => String(form.get(key) ?? "").trim();
    try {
      const values: Record<string, unknown> = {
        title: value("title"), description: value("description"), propertyType: value("propertyType"),
        bedrooms: Number(value("bedrooms")), bathrooms: Number(value("bathrooms")),
        year1RentNaira: Number(value("year1RentNaira")), year2RentNaira: Number(value("year2RentNaira")),
        securityDeposit: Number(value("securityDeposit")), inspectionSlotsPerDay: Number(value("inspectionSlotsPerDay")),
        address: { street: value("street"), lga: value("lga"), landmark: value("landmark") },
        amenities: value("amenities").split(",").map((item) => item.trim()).filter(Boolean),
      };
      const kept = form.getAll("keepPhoto").map(String);
      const newPhotos = form.getAll("photos").filter((item): item is File => item instanceof File && item.size > 0);
      if (newPhotos.length || kept.length !== (listing.data.photos?.length ?? 0)) {
        const uploaded: string[] = [];
        for (const photo of newPhotos) {
          const receipt = await uploadService.upload(photo, "LISTING_PHOTO");
          if (!receipt.url) throw new Error("Photo upload did not complete.");
          uploaded.push(receipt.url);
        }
        values.photos = [...kept, ...uploaded];
      }
      await propertyService.update(id, values);
      await listing.refetch();
      setMessage("Changes saved. An administrator will review updates before publication.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not save listing."); }
    finally { setBusy(false); }
  };

  return <div className="page page-narrow col gap-4">
    <PageHeader title="Edit property" subtitle="Update real listing details and images." />
    {listing.isPending ? <p>Loading listing...</p> : listing.isError ? <p role="alert">Could not load this listing.</p> : listing.data &&
      <form key={listing.data.id} className="card card-pad col gap-3" onSubmit={save}>
        <p>Current status: {listing.data.status.replaceAll("_", " ")}</p>
        <label className="field"><span className="label">Title</span><input className="input" name="title" defaultValue={listing.data.title} minLength={4} maxLength={255} required /></label>
        <label className="field"><span className="label">Description</span><textarea className="input" name="description" defaultValue={listing.data.description} rows={4} required /></label>
        <label className="field"><span className="label">Type</span><select className="input" name="propertyType" defaultValue={listing.data.property_type ?? "flat"}>
          {["studio", "mini flat", "flat", "duplex", "bungalow"].map((type) => <option key={type} value={type}>{type}</option>)}
        </select></label>
        <div className="row gap-2 wrap"><label className="field grow"><span className="label">Bedrooms</span><input className="input" name="bedrooms" type="number" min={0} max={20} defaultValue={listing.data.bedrooms ?? 0} required /></label>
          <label className="field grow"><span className="label">Bathrooms</span><input className="input" name="bathrooms" type="number" min={1} max={20} defaultValue={listing.data.bathrooms} required /></label></div>
        <div className="row gap-2 wrap"><label className="field grow"><span className="label">Year-one rent (₦)</span><input className="input" name="year1RentNaira" type="number" min={1} defaultValue={listing.data.year_1_rent_naira} required /></label>
          <label className="field grow"><span className="label">Year-two rent (₦)</span><input className="input" name="year2RentNaira" type="number" min={1} defaultValue={listing.data.year_2_rent_naira} required /></label></div>
        <label className="field"><span className="label">Security deposit (₦)</span><input className="input" name="securityDeposit" type="number" min={0} defaultValue={listing.data.security_deposit} required /></label>
        <label className="field"><span className="label">Street address</span><input className="input" name="street" defaultValue={listing.data.address_street} required /></label>
        <label className="field"><span className="label">Local government area</span><input className="input" name="lga" defaultValue={listing.data.address_lga ?? ""} required /></label>
        <label className="field"><span className="label">Public landmark</span><input className="input" name="landmark" defaultValue={listing.data.nearest_landmark ?? ""} required /></label>
        <label className="field"><span className="label">Amenities (comma-separated)</span><input className="input" name="amenities" defaultValue={listing.data.amenities?.join(", ") ?? ""} /></label>
        <label className="field"><span className="label">Inspection slots per day</span><input className="input" name="inspectionSlotsPerDay" type="number" min={1} max={20} defaultValue={listing.data.inspection_slots_per_day} required /></label>
        <strong>Photos</strong>
        {listing.data.photos?.map((url) => <label className="row gap-2" key={url}><input type="checkbox" name="keepPhoto" value={url} defaultChecked />Keep photo</label>)}
        <label className="field"><span className="label">Add photos</span><input className="input" type="file" name="photos" accept="image/jpeg,image/png,image/webp" multiple /></label>
        <button className="btn btn-primary" disabled={busy} type="submit">{busy ? "Saving..." : "Save changes"}</button>
        {message && <p role="status">{message}</p>}
      </form>}
  </div>;
}
