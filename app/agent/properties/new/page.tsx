"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { Naira } from "@/components/shared/naira";
import { Field } from "@/components/shared/field";
import { GpsCapture } from "@/components/property/gps-capture";
import { useAppStore } from "@/store/app-store";
import { PROPERTY_TYPES, AREAS, AMENITIES, AGENT_UPLOAD_LIMITS } from "@/lib/constants";
import { propertyBasicsSchema, propertyLocationSchema } from "@/lib/validations";
import { calculateRentBreakdown, cn } from "@/lib/utils";
import { AGENT_ME } from "@/lib/mock-data";
import { toast } from "sonner";
import type { GeoPoint, PropertyType } from "@/lib/types";

const STEPS = ["Basics", "Photos", "Location", "Landlord", "Inspections", "Review"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AddPropertyPage() {
  const router = useRouter();
  const addProperty = useAppStore((s) => s.addProperty);

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Draft
  const [title, setTitle] = useState("");
  const [type, setType] = useState<PropertyType>("Flat");
  const [beds, setBeds] = useState(2);
  const [baths, setBaths] = useState(2);
  const [baseRent, setBaseRent] = useState(500000);
  const [photos, setPhotos] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [location, setLocation] = useState<GeoPoint | null>(null);
  const [area, setArea] = useState<string>(AREAS[0]);
  const [landmark, setLandmark] = useState("");
  const [exactAddress, setExactAddress] = useState("");
  const [hideExact, setHideExact] = useState(true);
  const [landlordMode, setLandlordMode] = useState<"existing" | "request">("existing");
  const [maxPerDay, setMaxPerDay] = useState(4);
  const [workingDays, setWorkingDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);

  const breakdown = calculateRentBreakdown(baseRent, AGENT_ME.commissionPct);

  const validateStep = (): boolean => {
    setErrors({});
    if (step === 0) {
      const r = propertyBasicsSchema.safeParse({ title, type, beds, baths, baseRent });
      if (!r.success) {
        setErrors(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message])));
        return false;
      }
    }
    if (step === 1 && photos.length < 3) {
      setErrors({ photos: "Add at least 3 photos" });
      return false;
    }
    if (step === 2) {
      if (!location) {
        setErrors({ location: "Capture the property's GPS location" });
        return false;
      }
      const r = propertyLocationSchema.safeParse({ area, landmark, exactAddress, hideExact });
      if (!r.success) {
        setErrors(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message])));
        return false;
      }
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const submit = () => {
    const property = addProperty({
      title, type, beds, baths, baseRent, amenities, location: location ?? undefined, area, landmark, exactAddress,
      images: photos, imageLabels: photos.map((_, i) => `Photo ${i + 1}`),
      agentId: AGENT_ME.id,
      status: landlordMode === "request" ? "AWAITING_LANDLORD_AUTHORIZATION" : "AWAITING_ADMIN_REVIEW",
    });
    toast.success("Property submitted", {
      description: landlordMode === "request" ? "Awaiting landlord authorization." : "Awaiting admin review.",
    });
    router.push(`/agent/properties/${property.id}`);
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      {/* Progress */}
      <div className="row between" style={{ marginBottom: 8 }}>
        <button className="row gap-2" style={{ color: "var(--muted)", fontSize: 13.5 }} onClick={() => (step === 0 ? router.back() : setStep((s) => s - 1))}>
          <Icon name="arrowL" size={16} /> {step === 0 ? "Cancel" : "Back"}
        </button>
        <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>Step {step + 1} of {STEPS.length} · {STEPS[step]}</span>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: "var(--paper-2)", overflow: "hidden", marginBottom: 22 }}>
        <div style={{ width: `${((step + 1) / STEPS.length) * 100}%`, height: "100%", background: "var(--navy-800)", transition: ".3s" }} />
      </div>

      <div className="card card-pad col gap-5">
        {step === 0 && (
          <>
            <h2 style={{ fontSize: 20 }}>Property basics</h2>
            <Field label="Listing title" error={errors.title}>
              <input className="input" placeholder="2 Bedroom Flat - Bodija" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Field>
            <div className="field">
              <span className="label">Type</span>
              <div className="row wrap gap-2">
                {PROPERTY_TYPES.map((t) => (
                  <button key={t} className={cn("chip", type === t && "is-active")} onClick={() => setType(t)}>{t}</button>
                ))}
              </div>
            </div>
            <div className="row gap-4">
              <Counter label="Bedrooms" value={beds} setValue={setBeds} min={0} />
              <Counter label="Bathrooms" value={baths} setValue={setBaths} min={1} />
            </div>
            <div className="field">
              <span className="label row between"><span>Base rent (annual)</span><Naira value={baseRent} size={15} color="var(--navy-700)" /></span>
              <input type="range" className="range" min={80000} max={2000000} step={20000} value={baseRent} onChange={(e) => setBaseRent(Number(e.target.value))} />
              {errors.baseRent && <span style={{ fontSize: 12.5, color: "var(--danger)" }}>{errors.baseRent}</span>}
            </div>
            <div className="card" style={{ background: "var(--navy-050)", border: "none", padding: "12px 14px" }}>
              <div className="row between"><span style={{ fontSize: 13, color: "var(--navy-700)" }}>Tenant pays (all-in, 1st year)</span><Naira value={breakdown.total} size={17} color="var(--navy-800)" /></div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 style={{ fontSize: 20 }}>Photos</h2>
            <p style={{ color: "var(--muted)", fontSize: 14 }}>Add at least 3 clear photos of the property.</p>
            <div className="drawer-grid">
              {photos.map((src, i) => (
                <div key={i} style={{ position: "relative", aspectRatio: "4/3", borderRadius: 12, overflow: "hidden", background: "var(--paper-2)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Photo ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button
                    type="button"
                    aria-label="Remove photo"
                    onClick={() => setPhotos((p) => p.filter((_, idx) => idx !== i))}
                    style={{ position: "absolute", top: 6, right: 6, width: 26, height: 26, borderRadius: "50%", background: "rgba(7,18,35,.7)", color: "#fff", display: "grid", placeItems: "center" }}
                  >
                    <Icon name="close" size={14} />
                  </button>
                </div>
              ))}
              <label
                className="col center"
                style={{ aspectRatio: "4/3", borderRadius: 12, border: "1.5px dashed var(--line-2)", color: "var(--muted)", gap: 6, cursor: "pointer" }}
              >
                <Icon name="plus" size={22} /> <span style={{ fontSize: 12.5 }}>Add photo</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    files.forEach((f) => {
                      const reader = new FileReader();
                      reader.onload = () => setPhotos((p) => [...p, reader.result as string]);
                      reader.readAsDataURL(f);
                    });
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
            {errors.photos && <span style={{ fontSize: 12.5, color: "var(--danger)" }}>{errors.photos}</span>}
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={{ fontSize: 20 }}>Location</h2>
            <GpsCapture value={location} onCapture={setLocation} />
            {errors.location && <span style={{ fontSize: 12.5, color: "var(--danger)" }}>{errors.location}</span>}
            <Field label="Area" error={errors.area}>
              <select className="select" value={area} onChange={(e) => setArea(e.target.value)}>
                {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </Field>
            <Field label="Public landmark (shown to everyone)" error={errors.landmark}>
              <input className="input" placeholder="UI Main Gate" value={landmark} onChange={(e) => setLandmark(e.target.value)} />
            </Field>
            <Field label="Exact address (hidden until inspection approved)" error={errors.exactAddress}>
              <input className="input" placeholder="14 Awolowo Avenue, Bodija" value={exactAddress} onChange={(e) => setExactAddress(e.target.value)} />
            </Field>
            <button className={cn("check", hideExact && "is-on")} onClick={() => setHideExact((v) => !v)}>
              <span className="check-box">{hideExact && <Icon name="check" size={13} strokeWidth={2.6} />}</span>
              Keep exact address private until inspection is approved
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 style={{ fontSize: 20 }}>Landlord authorization</h2>
            <p style={{ color: "var(--muted)", fontSize: 14 }}>A property must be authorized by its landlord before it can go live.</p>
            {(["existing", "request"] as const).map((m) => (
              <button key={m} className="card card-pad row gap-3" style={{ textAlign: "left", border: landlordMode === m ? "2px solid var(--navy-800)" : "1px solid var(--line)" }} onClick={() => setLandlordMode(m)}>
                <Icon name={m === "existing" ? "shieldCheck" : "mail"} size={22} color="var(--navy-600)" />
                <div className="col" style={{ gap: 2 }}>
                  <strong style={{ fontSize: 14.5 }}>{m === "existing" ? "Use an authorized landlord" : "Request authorization"}</strong>
                  <span style={{ fontSize: 12.5, color: "var(--muted)" }}>
                    {m === "existing" ? "Pick a landlord who already authorized you → goes to admin review." : "Send the landlord a request → waits for their approval."}
                  </span>
                </div>
              </button>
            ))}
          </>
        )}

        {step === 4 && (
          <>
            <h2 style={{ fontSize: 20 }}>Inspection availability</h2>
            <div className="field">
              <span className="label row between"><span>Max inspections / day</span><strong>{maxPerDay}</strong></span>
              <input type="range" className="range" min={1} max={8} value={maxPerDay} onChange={(e) => setMaxPerDay(Number(e.target.value))} />
            </div>
            <div className="field">
              <span className="label">Working days</span>
              <div className="row wrap gap-2">
                {DAYS.map((d) => {
                  const on = workingDays.includes(d);
                  return (
                    <button key={d} className={cn("chip", on && "is-active")} onClick={() => setWorkingDays((w) => on ? w.filter((x) => x !== d) : [...w, d])}>{d}</button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h2 style={{ fontSize: 20 }}>Review & submit</h2>
            {[
              ["Title", title || "-"],
              ["Type", `${type} · ${beds} bed · ${baths} bath`],
              ["Base rent", `₦${baseRent.toLocaleString()}`],
              ["Tenant all-in", `₦${breakdown.total.toLocaleString()}`],
              ["Photos", `${photos.length} added`],
              ["Area", `${area} · Near ${landmark || "-"}`],
              ["GPS", location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "-"],
              ["Landlord", landlordMode === "existing" ? "Authorized landlord" : "Authorization requested"],
              ["Inspections", `${maxPerDay}/day · ${workingDays.length} days`],
            ].map(([k, v]) => (
              <div key={k} className="brk-row" style={{ padding: "10px 0" }}>
                <span style={{ fontSize: 13.5, color: "var(--muted)" }}>{k}</span>
                <span style={{ fontSize: 13.5, fontWeight: 600, textAlign: "right" }}>{v}</span>
              </div>
            ))}
            <div className="row gap-2" style={{ background: "var(--warn-bg)", color: "var(--warn)", padding: "10px 13px", borderRadius: 10, fontSize: 12.5 }}>
              <Icon name="info" size={15} /> Submitting a fake or duplicate listing can lead to suspension.
            </div>
          </>
        )}

        {/* Footer */}
        {step < STEPS.length - 1 ? (
          <button className="btn btn-primary btn-block btn-lg" onClick={next}>Continue</button>
        ) : (
          <button className="btn btn-gold btn-block btn-lg" onClick={submit}><Icon name="check" size={18} strokeWidth={2.2} /> Submit for review</button>
        )}
      </div>

      <p style={{ textAlign: "center", fontSize: 12, color: "var(--faint)", marginTop: 12 }}>
        New agents can list up to {AGENT_UPLOAD_LIMITS.new} properties · high-trust agents up to {AGENT_UPLOAD_LIMITS.highTrust}.
      </p>
    </div>
  );
}

function Counter({ label, value, setValue, min }: { label: string; value: number; setValue: (n: number) => void; min: number }) {
  return (
    <div className="field grow">
      <span className="label">{label}</span>
      <div className="row gap-3" style={{ alignItems: "center" }}>
        <button className="icon-btn" style={{ border: "1px solid var(--line-2)" }} onClick={() => setValue(Math.max(min, value - 1))} aria-label={`Decrease ${label}`}><Icon name="minus" size={16} /></button>
        <strong style={{ fontFamily: "var(--font-display)", fontSize: 18, minWidth: 24, textAlign: "center" }}>{value}</strong>
        <button className="icon-btn" style={{ border: "1px solid var(--line-2)" }} onClick={() => setValue(value + 1)} aria-label={`Increase ${label}`}><Icon name="plus" size={16} /></button>
      </div>
    </div>
  );
}
