"use client";

import { Icon } from "@/components/ui/icon";
import { formatBudget, type Coverage, type ListingFilters } from "@/lib/listings";
import type { PropertyType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FilterFieldsProps {
  value: ListingFilters;
  coverage: Coverage;
  onChange: (next: ListingFilters) => void;
}

const BEDS = [0, 1, 2, 3, 4];

export function FilterFields({ value, coverage, onChange }: FilterFieldsProps) {
  const patch = (next: Partial<ListingFilters>) => onChange({ ...value, ...next });

  return (
    <div className="aw-filters">
      <fieldset>
        <legend>Area</legend>
        <div className="aw-chips">
          <button type="button" className={cn("aw-chip", !value.area && "is-on")} aria-pressed={!value.area} onClick={() => patch({ area: null })}>
            All areas
          </button>
          {coverage.areas.map((area) => (
            <button
              key={area.name}
              type="button"
              className={cn("aw-chip", value.area === area.name && "is-on")}
              aria-pressed={value.area === area.name}
              onClick={() => patch({ area: area.name })}
            >
              {area.name} <span className="aw-chip-count">{area.count}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Home type</legend>
        <div className="aw-chips">
          <button type="button" className={cn("aw-chip", !value.type && "is-on")} aria-pressed={!value.type} onClick={() => patch({ type: null })}>
            Any type
          </button>
          {coverage.types.map((type: PropertyType) => (
            <button
              key={type}
              type="button"
              className={cn("aw-chip", value.type === type && "is-on")}
              aria-pressed={value.type === type}
              onClick={() => patch({ type })}
            >
              {type}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="aw-field">
        <span>Max first-year rent</span>
        <select value={value.max ?? ""} onChange={(event) => patch({ max: event.target.value ? Number(event.target.value) : null })}>
          <option value="">Any amount</option>
          {coverage.budgets.map((budget) => (
            <option key={budget} value={budget}>{formatBudget(budget)}</option>
          ))}
          {value.max && !coverage.budgets.includes(value.max) && <option value={value.max}>{formatBudget(value.max)}</option>}
        </select>
      </label>

      <fieldset>
        <legend>Bedrooms</legend>
        <div className="aw-segment">
          {BEDS.map((beds) => (
            <button
              key={beds}
              type="button"
              className={cn(value.beds === beds && "is-on")}
              aria-pressed={value.beds === beds}
              onClick={() => patch({ beds })}
            >
              {beds === 0 ? "Any" : `${beds}+`}
            </button>
          ))}
        </div>
      </fieldset>

      {coverage.amenities.length > 0 && (
        <fieldset>
          <legend>Must have</legend>
          <div className="aw-checks">
            {coverage.amenities.map((amenity) => {
              const on = value.amenities.includes(amenity);
              return (
                <label key={amenity} className={cn("aw-check", on && "is-on")}>
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() =>
                      patch({ amenities: on ? value.amenities.filter((item) => item !== amenity) : [...value.amenities, amenity] })
                    }
                  />
                  <span className="aw-check-box" aria-hidden>{on && <Icon name="check" size={14} strokeWidth={2.4} />}</span>
                  {amenity}
                </label>
              );
            })}
          </div>
        </fieldset>
      )}
    </div>
  );
}
