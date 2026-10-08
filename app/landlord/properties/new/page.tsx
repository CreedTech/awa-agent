"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authorizationService } from "@/services/authorization-service";
import { propertyService } from "@/services/property-service";
import { uploadService } from "@/services/upload-service";
import { PageHeader } from "@/components/shared/page-header";

export default function NewLandlordPropertyPage() {
  const router = useRouter();
  const agents = useQuery({ queryKey: ["my-agents"], queryFn: authorizationService.myAgents });
  const activeAgents = agents.data?.filter((item) => item.status === "ACTIVE") ?? [];
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setError(null);
    const form = new FormData(event.currentTarget);
    const value = (key: string) => String(form.get(key) ?? "").trim();
    const year1 = Number(value("year1RentNaira"));
    const year2 = Number(value("year2RentNaira"));
    if (!Number.isSafeInteger(year1) || !Number.isSafeInteger(year2) || year2 >= year1 || year2 <= 0) {
      setError("Enter valid prices with year-two rent below year-one rent."); setBusy(false); return;
    }
    try {
      const photos = form.getAll("photos").filter((item): item is File => item instanceof File && item.size > 0);
      if (photos.length < 1 || photos.length > 12) throw new Error("Choose between one and twelve property photos.");
      const uploadedPhotos: string[] = [];
      for (const photo of photos) {
        const uploaded = await uploadService.upload(photo, "LISTING_PHOTO");
        if (!uploaded.url) throw new Error("Property photo upload did not return a URL.");
        uploadedPhotos.push(uploaded.url);
      }
      const property = await propertyService.create({
        agentId: value("agentId"), title: value("title"), description: value("description"),
        propertyType: value("propertyType"), bedrooms: Number(value("bedrooms")), bathrooms: Number(value("bathrooms")),
        year1RentNaira: year1, year2RentNaira: year2,
        address: { street: value("street"), lga: value("lga"), landmark: value("landmark") },
        amenities: value("amenities").split(",").map((item) => item.trim()).filter(Boolean),
        photos: uploadedPhotos,
        inspectionSlotsPerDay: Number(value("inspectionSlotsPerDay")),
      });
      router.push(`/landlord/properties/${property.id}`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not create property."); setBusy(false); }
  };

  return <div className="page page-narrow col gap-5">
    <PageHeader title="Add property" subtitle="Submit your property with an authorized agent for admin review." />
    {agents.isPending ? <p>Loading agents...</p> : agents.isError ? <p role="alert">Could not load agents.</p> :
      activeAgents.length === 0 ? <p>Invite an agent and wait for them to accept first. <Link href="/landlord/agents">Manage agents</Link></p> :
      <form className="card card-pad col gap-4" onSubmit={submit}>
        {error && <p role="alert" style={{ color: "var(--danger)" }}>{error}</p>}
        <label className="field"><span className="label">Authorized agent</span><select name="agentId" className="input" required>
          {activeAgents.map((item) => <option key={item.id} value={item.agentId}>{item.agentName}</option>)}
        </select></label>
        <label className="field"><span className="label">Title</span><input className="input" name="title" minLength={4} maxLength={255} required /></label>
        <label className="field"><span className="label">Description</span><textarea className="input" name="description" rows={4} required /></label>
        <label className="field"><span className="label">Type</span><select className="input" name="propertyType"><option value="studio">Studio</option><option value="mini flat">Mini Flat</option><option value="flat">Flat</option><option value="duplex">Duplex</option><option value="bungalow">Bungalow</option></select></label>
        <div className="row gap-3 wrap"><label className="field grow"><span className="label">Bedrooms</span><input className="input" name="bedrooms" type="number" min={0} max={20} defaultValue={1} required /></label>
          <label className="field grow"><span className="label">Bathrooms</span><input className="input" name="bathrooms" type="number" min={1} max={20} defaultValue={1} required /></label></div>
        <div className="row gap-3 wrap"><label className="field grow"><span className="label">First-year total (₦)</span><input className="input" name="year1RentNaira" type="number" min={1} required /></label>
          <label className="field grow"><span className="label">Year-two rent (₦)</span><input className="input" name="year2RentNaira" type="number" min={1} required /></label></div>
        <label className="field"><span className="label">Street address (private until inspection verification)</span><input className="input" name="street" required /></label>
        <label className="field"><span className="label">Local government area</span><input className="input" name="lga" required /></label>
        <label className="field"><span className="label">Public landmark</span><input className="input" name="landmark" required /></label>
        <label className="field"><span className="label">Amenities (comma-separated)</span><input className="input" name="amenities" /></label>
        <label className="field"><span className="label">Property photos (JPEG, PNG or WebP; up to 10 MB each)</span><input className="input" name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple required /></label>
        <label className="field"><span className="label">Inspection slots per day</span><input className="input" name="inspectionSlotsPerDay" type="number" min={1} max={20} defaultValue={3} required /></label>
        <button className="btn btn-primary btn-block" type="submit" disabled={busy}>{busy ? "Creating..." : "Create listing"}</button>
      </form>}
  </div>;
}
