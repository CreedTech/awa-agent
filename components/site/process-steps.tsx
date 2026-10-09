"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { PropImage } from "@/components/shared/prop-image";
import { useInspectionPrice } from "@/hooks/use-inspection-price";
import { useListings } from "@/hooks/use-listings";
import { isPublicListing } from "@/lib/listings";
import type { Property } from "@/lib/types";
import { env } from "@/lib/env";
import { formatCurrency } from "@/lib/utils";

function ListingMock({ property }: { property?: Property }) {
  return (
    <div className="aw-mock aw-mock-listing" aria-hidden>
      {property?.images[0] ? (
        <PropImage src={property.images[0]} label={property.title} className="aw-mock-photo" sizes="64px" />
      ) : (
        <span className="aw-mock-photo" />
      )}
      {property ? (
        <div>
          <strong className="num">{formatCurrency(property.baseRent)} <small>/ first year</small></strong>
          <span>{[property.beds > 0 && `${property.beds} bd`, property.baths > 0 && `${property.baths} ba`, property.type].filter(Boolean).join(" | ")}</span>
          <span className="aw-mock-muted"><Icon name="pin" size={12} /> {property.area}</span>
        </div>
      ) : (
        <div>
          <strong>First-year rent</strong>
          <span>Bedrooms | Bathrooms | Type</span>
          <span className="aw-mock-muted"><Icon name="pin" size={12} /> Area · nearby landmark</span>
        </div>
      )}
    </div>
  );
}

const noopSubscribe = () => () => {};
const dayLabel = (offset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toLocaleDateString("en-NG", { weekday: "short", day: "numeric" });
};

function DayMock() {
  const today = useSyncExternalStore(noopSubscribe, () => new Date().toDateString(), () => "");
  const days = today ? [1, 2, 3].map(dayLabel) : ["", "", ""];
  return (
    <div className="aw-mock aw-mock-days" aria-hidden>
      <span>Preferred day</span>
      <div>
        {days.map((day, index) => <i key={index} className={index === 1 ? "is-on" : undefined}>{day || "\u00a0"}</i>)}
      </div>
      <b>Request inspection</b>
    </div>
  );
}

function CodeMock() {
  return (
    <div className="aw-mock aw-mock-code" aria-hidden>
      <span>Inspection code</span>
      <div>
        {Array.from({ length: 6 }, (_, index) => <i key={index} />)}
      </div>
      <span className="aw-mock-ok"><Icon name="checkCircle" size={14} /> Agent confirms in person</span>
    </div>
  );
}

function AddressMock() {
  return (
    <div className="aw-mock aw-mock-address" aria-hidden>
      <span className="aw-mock-row"><Icon name="lock" size={14} /> Hidden until your visit</span>
      <span className="aw-mock-row is-open"><Icon name="pin" size={14} /> Full street address</span>
      <span className="aw-mock-muted">Shared after the code matched</span>
    </div>
  );
}

export function ProcessSteps() {
  const price = useInspectionPrice();
  const { properties } = useListings();
  const sample = properties?.find((property) => isPublicListing(property) && property.images.length > 0);
  const access = price.data ? `${formatCurrency(price.data.priceNaira)} for ${price.data.durationDays} days` : null;

  const steps = [
    {
      mock: <ListingMock property={sample} />,
      title: "Find a home",
      body: "Every listing shows the area, a landmark and the first-year rent. No account needed to browse.",
    },
    {
      mock: <DayMock />,
      title: "Request a visit",
      body: (
        <>
          Needs a tenant account, verified ID and inspection access{access ? ` (${access})` : ""}. <Link href="/pricing">Details</Link>
        </>
      ),
    },
    {
      mock: <CodeMock />,
      title: "Meet the assigned agent",
      body: "Read your six-digit code to the agent named on the listing. They enter it to confirm the visit.",
    },
    {
      mock: <AddressMock />,
      title: "Get the address, then decide",
      body: env.rentCheckoutLive
        ? "The street address appears in your account. If you take the home, pay in the app; the money is held until you confirm you have the keys."
        : "The street address appears in your account. Online rent payment isn't open yet, so don't pay anyone directly.",
    },
  ];

  return (
    <ol className="aw-steps">
      {steps.map((step, index) => (
        <li key={step.title} className="aw-step">
          <div className="aw-step-visual">{step.mock}</div>
          <h3><span className="aw-step-num">{index + 1}</span>{step.title}</h3>
          <p>{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
