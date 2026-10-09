"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { PropImage } from "@/components/shared/prop-image";
import { useListings } from "@/hooks/use-listings";
import { EMPTY_FILTERS, filtersToQuery } from "@/lib/listings";

export function AreaIndex() {
  const { listings, coverage } = useListings();
  if (!listings.isSuccess || coverage.areas.length === 0) return null;

  return (
    <section className="aw-section aw-wrap aw-areas" aria-labelledby="areas-heading">
      <div className="aw-section-head">
        <h2 id="areas-heading" className="aw-h2">Browse by area</h2>
      </div>
      <ol className="aw-area-list">
        {coverage.areas.map((area) => (
          <li key={area.name}>
            <Link href={`/explore${filtersToQuery({ ...EMPTY_FILTERS, area: area.name })}`} className="aw-area-row">
              <PropImage src={area.photo} label={`A home in ${area.name}`} className="aw-area-thumb" sizes="96px" />
              <span className="aw-area-name">{area.name}</span>
              <span className="aw-area-count">{area.count === 1 ? "1 home" : `${area.count} homes`}</span>
              <Icon name="arrowR" size={20} />
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
