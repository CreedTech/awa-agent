"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { PropertyCard } from "@/components/property/property-card";
import { EmptyState } from "@/components/shared/empty-state";
import { BottomSheet } from "@/components/shared/bottom-sheet";
import { Footer } from "@/components/layout/footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/store/app-store";
import { agentById } from "@/lib/mock-data";
import { calculateRentBreakdown, formatCurrency, cn } from "@/lib/utils";
import { PROPERTY_TYPES, AREAS, AMENITIES } from "@/lib/constants";
import type { Property } from "@/lib/types";

type SortKey = "newest" | "price-asc" | "price-desc" | "trust";

interface Filters {
  type: string;
  area: string;
  maxPrice: number;
  beds: number;
  amenities: string[];
  availableNow: boolean;
  verifiedOnly: boolean;
}

const DEFAULT_FILTERS: Filters = {
  type: "All",
  area: "All",
  maxPrice: 2500000,
  beds: 0,
  amenities: [],
  availableNow: false,
  verifiedOnly: false,
};

function priceOf(p: Property) {
  return calculateRentBreakdown(p.baseRent, agentById(p.agentId)?.commissionPct).total;
}

function FiltersPanel({
  filters,
  setFilters,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
}) {
  const patch = (p: Partial<Filters>) => setFilters({ ...filters, ...p });

  return (
    <div className="col gap-5">
      <div className="field">
        <span className="label">Property type</span>
        <div className="row wrap gap-2">
          {["All", ...PROPERTY_TYPES].map((t) => (
            <button key={t} className={cn("chip", filters.type === t && "is-active")} onClick={() => patch({ type: t })}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span className="label">Area</span>
        <div className="row wrap gap-2">
          {["All", ...AREAS.slice(0, 6)].map((a) => (
            <button key={a} className={cn("chip", filters.area === a && "is-active")} onClick={() => patch({ area: a })}>
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span className="label row between">
          <span>Max total price</span>
          <span className="num" style={{ color: "var(--navy-700)" }}>{formatCurrency(filters.maxPrice)}</span>
        </span>
        <input
          type="range"
          className="range"
          min={250000}
          max={2500000}
          step={50000}
          value={filters.maxPrice}
          onChange={(e) => patch({ maxPrice: Number(e.target.value) })}
        />
      </div>

      <div className="field">
        <span className="label">Bedrooms (min)</span>
        <div className="row wrap gap-2">
          {[0, 1, 2, 3, 4].map((b) => (
            <button key={b} className={cn("chip", filters.beds === b && "is-active")} onClick={() => patch({ beds: b })}>
              {b === 0 ? "Any" : `${b}+`}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span className="label">Amenities</span>
        <div className="col">
          {AMENITIES.slice(0, 6).map((a) => {
            const on = filters.amenities.includes(a);
            return (
              <button
                key={a}
                className={cn("check", on && "is-on")}
                onClick={() => patch({ amenities: on ? filters.amenities.filter((x) => x !== a) : [...filters.amenities, a] })}
              >
                <span className="check-box">{on && <Icon name="check" size={13} strokeWidth={2.6} />}</span>
                {a}
              </button>
            );
          })}
        </div>
      </div>

      <button className={cn("check", filters.availableNow && "is-on")} onClick={() => patch({ availableNow: !filters.availableNow })}>
        <span className="check-box">{filters.availableNow && <Icon name="check" size={13} strokeWidth={2.6} />}</span>
        Available now
      </button>
      <button className={cn("check", filters.verifiedOnly && "is-on")} onClick={() => patch({ verifiedOnly: !filters.verifiedOnly })}>
        <span className="check-box">{filters.verifiedOnly && <Icon name="check" size={13} strokeWidth={2.6} />}</span>
        Verified agents only
      </button>
    </div>
  );
}

function ExploreContent() {
  const params = useSearchParams();
  const query = params.get("q")?.toLowerCase() ?? "";
  const properties = useAppStore((s) => s.properties);

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>("newest");
  const [sheetOpen, setSheetOpen] = useState(false);

  const results = useMemo(() => {
    let list = properties.filter((p) => p.status === "LIVE");
    if (query)
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.area.toLowerCase().includes(query) ||
          p.landmark.toLowerCase().includes(query) ||
          p.type.toLowerCase().includes(query),
      );
    if (filters.type !== "All") list = list.filter((p) => p.type === filters.type);
    if (filters.area !== "All") list = list.filter((p) => p.area === filters.area);
    list = list.filter((p) => priceOf(p) <= filters.maxPrice);
    if (filters.beds > 0) list = list.filter((p) => p.beds >= filters.beds);
    if (filters.amenities.length) list = list.filter((p) => filters.amenities.every((a) => p.amenities.includes(a)));
    if (filters.availableNow) list = list.filter((p) => p.available);
    if (filters.verifiedOnly) list = list.filter((p) => agentById(p.agentId)?.verified);

    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => priceOf(a) - priceOf(b));
    else if (sort === "price-desc") sorted.sort((a, b) => priceOf(b) - priceOf(a));
    else if (sort === "trust") sorted.sort((a, b) => (agentById(b.agentId)?.trust ?? 0) - (agentById(a.agentId)?.trust ?? 0));
    return sorted;
  }, [properties, query, filters, sort]);

  return (
    <>
      {/* Trust banner */}
      <div className="page" style={{ paddingBottom: 0 }}>
        <div className="card" style={{ background: "linear-gradient(120deg, var(--navy-800), var(--navy-700))", color: "#fff", border: "none", padding: "24px 26px" }}>
          <div className="row between wrap gap-4">
            <div className="col gap-2">
              <h1 style={{ color: "#fff", fontSize: 26 }}>Escrow-protected homes in Ibadan</h1>
              <p style={{ color: "rgba(255,255,255,.8)", fontSize: 14.5 }}>Every listing shows the total upfront price. Every agent is verified.</p>
            </div>
            <div className="row gap-6">
              {[["Ibadan", "Launch city"], ["KYC", "Agent checks"], ["0", "Viewing fees"]].map(([v, l]) => (
                <div key={l} className="col" style={{ gap: 0 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22 }}>{v}</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,.65)" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="page">
        <div className="feed-layout">
          <aside className="filter-rail">
            <div className="card card-pad">
              <FiltersPanel filters={filters} setFilters={setFilters} />
            </div>
          </aside>

          <div className="col gap-4">
            <div className="row between wrap gap-3">
              <div className="row gap-3">
                <button className="chip filter-mobile" style={{ display: "none" }} onClick={() => setSheetOpen(true)}>
                  <Icon name="filter" size={15} /> Filters
                </button>
                <span style={{ color: "var(--muted)", fontSize: 14, fontWeight: 600 }}>
                  {results.length} {results.length === 1 ? "home" : "homes"}
                  {query && <> for &ldquo;{query}&rdquo;</>}
                </span>
              </div>
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: low to high</SelectItem>
                  <SelectItem value="price-desc">Price: high to low</SelectItem>
                  <SelectItem value="trust">Most trusted agent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {results.length === 0 ? (
              <EmptyState
                icon="explore"
                title="No properties match"
                description="Try widening your budget or clearing some filters."
                action={{ label: "Clear filters", onClick: () => setFilters(DEFAULT_FILTERS) }}
              />
            ) : (
              <div className="prop-grid">
                {results.map((p, i) => (
                  <PropertyCard key={p.id} property={p} priority={i === 0} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Filters" maxWidth={460}>
        <div style={{ padding: "8px 20px 24px" }}>
          <FiltersPanel filters={filters} setFilters={setFilters} />
          <button className="btn btn-primary btn-block" style={{ marginTop: 18 }} onClick={() => setSheetOpen(false)}>
            Show {results.length} homes
          </button>
        </div>
      </BottomSheet>

      <Footer />
    </>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="page" style={{ paddingTop: 48 }}><div className="spinner" /></div>}>
      <ExploreContent />
    </Suspense>
  );
}
