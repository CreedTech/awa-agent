"use client";

import { Icon } from "@/components/ui/icon";
import { EMPTY_FILTERS, formatBudget, type ListingFilters } from "@/lib/listings";

interface ActiveFiltersProps {
  filters: ListingFilters;
  onChange: (next: ListingFilters) => void;
}

export function ActiveFilters({ filters, onChange }: ActiveFiltersProps) {
  const chips: { key: string; label: string; next: ListingFilters }[] = [];
  if (filters.q) chips.push({ key: "q", label: `"${filters.q}"`, next: { ...filters, q: "" } });
  if (filters.area) chips.push({ key: "area", label: filters.area, next: { ...filters, area: null } });
  if (filters.type) chips.push({ key: "type", label: filters.type, next: { ...filters, type: null } });
  if (filters.max) chips.push({ key: "max", label: `Up to ${formatBudget(filters.max)}`, next: { ...filters, max: null } });
  if (filters.beds) chips.push({ key: "beds", label: `${filters.beds}+ bedrooms`, next: { ...filters, beds: 0 } });
  filters.amenities.forEach((amenity) =>
    chips.push({ key: `a-${amenity}`, label: amenity, next: { ...filters, amenities: filters.amenities.filter((item) => item !== amenity) } }),
  );

  if (chips.length === 0) return null;

  return (
    <div className="aw-active" aria-label="Active filters">
      {chips.map((chip) => (
        <button key={chip.key} type="button" className="aw-active-chip" onClick={() => onChange(chip.next)} aria-label={`Remove filter ${chip.label}`}>
          {chip.label} <Icon name="close" size={14} />
        </button>
      ))}
      <button type="button" className="aw-active-clear" onClick={() => onChange({ ...EMPTY_FILTERS, sort: filters.sort })}>
        Clear all
      </button>
    </div>
  );
}
