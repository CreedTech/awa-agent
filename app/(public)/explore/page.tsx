"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { PropertyCard } from "@/components/property/property-card";
import { ListingSkeleton } from "@/components/property/listing-skeleton";
import { LoadError } from "@/components/property/load-error";
import { NoInventory } from "@/components/property/no-inventory";
import { SearchBox } from "@/components/explore/search-box";
import { ActiveFilters } from "@/components/explore/active-filters";
import { FilterSheet } from "@/components/explore/filter-sheet";
import { GuestViewNotice } from "@/components/property/guest-view-notice";
import { useListings } from "@/hooks/use-listings";
import {
  EMPTY_FILTERS,
  activeFilterCount,
  applyFilters,
  filtersToQuery,
  formatBudget,
  parseFilters,
  type ListingFilters,
  type ListingSort,
} from "@/lib/listings";

const SORT_LABELS: Record<ListingSort, string> = {
  recent: "Newest first",
  "price-asc": "Rent: low to high",
  "price-desc": "Rent: high to low",
};

function ExploreContent() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { listings, properties, isGuestView, coverage } = useListings();
  const query = params.toString();
  const filters = useMemo(() => parseFilters(new URLSearchParams(query)), [query]);
  const results = useMemo(() => applyFilters(properties ?? [], filters), [properties, filters]);
  const [draft, setDraft] = useState<ListingFilters | null>(null);
  const draftMatches = useMemo(() => (draft ? applyFilters(properties ?? [], draft).length : 0), [properties, draft]);

  const update = useCallback(
    (next: ListingFilters) => router.push(`${pathname}${filtersToQuery(next)}`, { scroll: false }),
    [router, pathname],
  );
  const closeSheet = useCallback(() => setDraft(null), []);
  const filterCount = activeFilterCount(filters);
  const backQuery = filtersToQuery(filters);
  const heading = filters.area ? `Homes in ${filters.area}` : "Homes for rent";

  return (
    <div className="aw-explore">
      <div className="aw-wrap aw-explore-head">
        <h1 className="aw-h1">{heading}</h1>
        <p className="aw-explore-meta" aria-live="polite">
          {listings.isSuccess && coverage.total > 0 && !isGuestView
            ? `${results.length} of ${coverage.total} ${coverage.total === 1 ? "home" : "homes"} open for inspection`
            : listings.isSuccess
              ? "Showing homes that are open for inspection"
              : ""}
        </p>
      </div>

      <div className="aw-toolbar">
        <div className="aw-wrap aw-toolbar-inner">
          <SearchBox key={filters.q} initial={filters.q} placeholder="Search by area, landmark or home type" onSubmit={(q) => update({ ...filters, q })} />
          <div className="aw-quick">
            <label>
              <span className="sr-only">Area</span>
              <select value={filters.area ?? ""} onChange={(event) => update({ ...filters, area: event.target.value || null })}>
                <option value="">All areas</option>
                {coverage.areas.map((area) => (
                  <option key={area.name} value={area.name}>{area.name}</option>
                ))}
                {filters.area && !coverage.areas.some((area) => area.name === filters.area) && <option value={filters.area}>{filters.area}</option>}
              </select>
            </label>
            <label>
              <span className="sr-only">Home type</span>
              <select value={filters.type ?? ""} onChange={(event) => update({ ...filters, type: parseFilters({ get: () => event.target.value }).type })}>
                <option value="">Any type</option>
                {coverage.types.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">First-year rent up to</span>
              <select value={filters.max ?? ""} onChange={(event) => update({ ...filters, max: event.target.value ? Number(event.target.value) : null })}>
                <option value="">Any rent</option>
                {coverage.budgets.map((budget) => (
                  <option key={budget} value={budget}>Up to {formatBudget(budget)}</option>
                ))}
                {filters.max && !coverage.budgets.includes(filters.max) && <option value={filters.max}>Up to {formatBudget(filters.max)}</option>}
              </select>
            </label>
          </div>
          <button type="button" className="aw-btn aw-btn-line aw-filter-btn" onClick={() => setDraft(filters)}>
            <Icon name="filter" size={18} /> Filters
            {filterCount > 0 && <span className="aw-badge-count">{filterCount}</span>}
          </button>
          <label className="aw-sort">
            <span className="sr-only">Sort</span>
            <select value={filters.sort} onChange={(event) => update({ ...filters, sort: parseFilters({ get: () => event.target.value }).sort })}>
              {Object.entries(SORT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="aw-wrap aw-results">
        {listings.isSuccess && isGuestView && coverage.total > 0 && <GuestViewNotice />}
        <ActiveFilters filters={filters} onChange={update} />
        {listings.isPending ? (
          <ListingSkeleton count={6} />
        ) : listings.isError ? (
          <LoadError title="We couldn't load homes just now" onRetry={() => listings.refetch()} retrying={listings.isFetching} />
        ) : coverage.total === 0 ? (
          <NoInventory />
        ) : results.length === 0 ? (
          <div className="aw-state aw-state-quiet">
            <Icon name="search" size={22} />
            <div>
              <h3>No homes match these filters</h3>
              <p>{coverage.total === 1 ? "1 home is" : `${coverage.total} homes are`} open for inspection. Remove a filter to see more.</p>
            </div>
            <button type="button" className="aw-btn aw-btn-ink aw-btn-sm" onClick={() => update({ ...EMPTY_FILTERS, sort: filters.sort })}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="aw-grid">
            {results.map((property, index) => (
              <PropertyCard key={property.id} property={property} priority={index === 0} backQuery={backQuery} />
            ))}
          </div>
        )}
      </div>

      {draft && (
        <FilterSheet
          draft={draft}
          coverage={coverage}
          matches={draftMatches}
          onDraftChange={setDraft}
          onApply={() => {
            update(draft);
            setDraft(null);
          }}
          onClose={closeSheet}
        />
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="aw-wrap aw-explore-head"><ListingSkeleton count={6} /></div>}>
      <ExploreContent />
    </Suspense>
  );
}
