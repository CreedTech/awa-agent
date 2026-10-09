"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { EMPTY_FILTERS, filtersToQuery, formatBudget, parseFilters, type Coverage } from "@/lib/listings";

export function HomeSearch({ coverage, loading }: { coverage: Coverage; loading: boolean }) {
  const router = useRouter();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const picked = parseFilters({ get: (name) => (data.get(name) as string | null) || null });
    router.push(`/explore${filtersToQuery({ ...EMPTY_FILTERS, area: picked.area, type: picked.type, max: picked.max })}`);
  };

  return (
    <form className="aw-search" onSubmit={submit} role="search" aria-label="Find a home">
      <label className="aw-search-field">
        <span>Where</span>
        <select name="area" defaultValue="" disabled={loading}>
          <option value="">Any area</option>
          {coverage.areas.map((area) => (
            <option key={area.name} value={area.name}>{area.name}</option>
          ))}
        </select>
      </label>
      <label className="aw-search-field">
        <span>Home type</span>
        <select name="type" defaultValue="" disabled={loading}>
          <option value="">Any type</option>
          {coverage.types.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </label>
      <label className="aw-search-field">
        <span>Rent per year</span>
        <select name="max" defaultValue="" disabled={loading}>
          <option value="">Any budget</option>
          {coverage.budgets.map((budget) => (
            <option key={budget} value={budget}>{formatBudget(budget)}</option>
          ))}
        </select>
      </label>
      <button type="submit" className="aw-btn aw-btn-citron aw-search-go">
        <Icon name="search" size={18} /> Find homes
      </button>
    </form>
  );
}
