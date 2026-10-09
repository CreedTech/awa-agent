"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/icon";
import { FilterFields } from "@/components/explore/filter-fields";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { EMPTY_FILTERS, type Coverage, type ListingFilters } from "@/lib/listings";

interface FilterSheetProps {
  draft: ListingFilters;
  coverage: Coverage;
  matches: number;
  onDraftChange: (next: ListingFilters) => void;
  onApply: () => void;
  onClose: () => void;
}

export function FilterSheet({ draft, coverage, matches, onDraftChange, onApply, onClose }: FilterSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return (
    <div className="aw-sheet-backdrop" onClick={onClose}>
      <div
        ref={panelRef}
        className="aw-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-sheet-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="aw-sheet-head">
          <h2 id="filter-sheet-title">Filters</h2>
          <button type="button" className="aw-icon-btn" onClick={onClose} aria-label="Close filters">
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="aw-sheet-body">
          <FilterFields value={draft} coverage={coverage} onChange={onDraftChange} />
        </div>
        <div className="aw-sheet-foot">
          <button
            type="button"
            className="aw-btn aw-btn-line"
            onClick={() => onDraftChange({ ...EMPTY_FILTERS, q: draft.q, sort: draft.sort })}
          >
            Clear
          </button>
          <button type="button" className="aw-btn aw-btn-ink aw-grow" onClick={onApply}>
            {matches === 1 ? "Show 1 home" : `Show ${matches} homes`}
          </button>
        </div>
      </div>
    </div>
  );
}
