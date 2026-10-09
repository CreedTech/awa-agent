import { formatCurrency } from "@/lib/utils";

const BASE = 500_000;
const OFFLINE_EXTRAS = 250_000;
const COMMISSION = 45_000;
const PLATFORM_FEE = 12_500;

const ROWS = [
  {
    key: "offline",
    label: "Renting through an offline agent",
    note: "Agency, agreement and viewing fees on top, often paid before you see the home",
    segments: [
      { label: "Rent", value: BASE, tone: "base" },
      { label: "Extra fees", value: OFFLINE_EXTRAS, tone: "extra" },
    ],
    total: `${formatCurrency(BASE + OFFLINE_EXTRAS)}+`,
  },
  {
    key: "awa-1",
    label: "AwaAgent, year one",
    note: "One price. The agent's commission and AwaAgent's 2.5% fee are already inside it",
    segments: [
      { label: "Rent", value: BASE, tone: "base" },
      { label: "Commission and fee", value: COMMISSION + PLATFORM_FEE, tone: "awa" },
    ],
    total: formatCurrency(BASE + COMMISSION + PLATFORM_FEE),
  },
  {
    key: "awa-2",
    label: "AwaAgent, year two onwards",
    note: "Base rent only",
    segments: [{ label: "Rent", value: BASE, tone: "base" }],
    total: formatCurrency(BASE),
  },
];

const SCALE = BASE + OFFLINE_EXTRAS;

export function CostComparison() {
  return (
    <figure className="aw-compare-chart">
      <figcaption>
        <span>Example: a home with {formatCurrency(BASE)} base rent</span>
        <span className="aw-compare-legend" aria-hidden>
          <i className="is-base" /> Rent
          <i className="is-extra" /> Offline fees
          <i className="is-awa" /> Commission and AwaAgent fee
        </span>
      </figcaption>
      <ul>
        {ROWS.map((row) => (
          <li key={row.key}>
            <div className="aw-compare-label">
              <strong>{row.label}</strong>
              <span>{row.note}</span>
            </div>
            <div className="aw-compare-track">
              <div className="aw-compare-bar" role="img" aria-label={`${row.label}: ${row.total}`}>
                {row.segments.map((segment) => (
                  <span key={segment.label} className={`is-${segment.tone}`} style={{ width: `${(segment.value / SCALE) * 100}%` }} />
                ))}
              </div>
              <strong className="aw-compare-total num">{row.total}</strong>
            </div>
          </li>
        ))}
      </ul>
    </figure>
  );
}
