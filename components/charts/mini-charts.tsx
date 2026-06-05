"use client";

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { formatCompactCurrency } from "@/lib/utils";

const NAVY = "#001f3f";
const GOLD = "#d4af37";

interface SeriesPoint {
  label: string;
  value: number;
}

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--line)",
  fontSize: 12.5,
  boxShadow: "var(--sh-2)",
};

/** Labelled vertical bar chart (e.g. GMV by month). */
export function BarSeriesChart({
  data,
  money = false,
  height = 220,
  color = NAVY,
}: {
  data: SeriesPoint[];
  money?: boolean;
  height?: number;
  color?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--line)" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted)" />
        <YAxis
          tickLine={false}
          axisLine={false}
          fontSize={11}
          stroke="var(--muted)"
          width={money ? 52 : 32}
          tickFormatter={(v: number) => (money ? formatCompactCurrency(v) : String(v))}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v) => (money ? formatCompactCurrency(Number(v)) : String(v))}
        />
        <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} maxBarSize={44} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Sparkline / trend line (e.g. escrow fee revenue, dispute rate). */
export function LineSeriesChart({
  data,
  money = false,
  height = 120,
  color = GOLD,
}: {
  data: SeriesPoint[];
  money?: boolean;
  height?: number;
  color?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted)" />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v) => (money ? formatCompactCurrency(Number(v)) : String(v))}
        />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} dot={{ r: 3, fill: color }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
