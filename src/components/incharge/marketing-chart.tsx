"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface ChartData {
  date: string;
  [key: string]: string | number;
}

interface MarketingChartProps {
  data: ChartData[];
}

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#8B5CF6",
  "#F59E0B",
  "#EF4444",
];

export function MarketingChart({ data }: MarketingChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-3xl border border-dashed border-[var(--border)]">
        <div className="text-center">
          <div className="mb-4 text-5xl opacity-30">📊</div>
          <h3 className="font-semibold text-lg">
            No analytics available
          </h3>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            No approved reports found for the selected period.
          </p>
        </div>
      </div>
    );
  }

  const totals: Record<string, number> = {};

  data.forEach((row) => {
    Object.entries(row).forEach(([key, value]) => {
      if (key === "date") return;

      totals[key] = (totals[key] || 0) + Number(value);
    });
  });

  const countries = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([country]) => country);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          left: -15,
          bottom: 0,
        }}
      >
        <defs>
          {COLORS.map((color, index) => (
            <linearGradient
              key={index}
              id={`gradient-${index}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor={color}
                stopOpacity={0.35}
              />
              <stop
                offset="95%"
                stopColor={color}
                stopOpacity={0}
              />
            </linearGradient>
          ))}
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="rgba(148,163,184,0.12)"
        />

        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tick={{
            fill: "#94A3B8",
            fontSize: 12,
          }}
        />

        <YAxis
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          tick={{
            fill: "#94A3B8",
            fontSize: 12,
          }}
        />

        <Tooltip
          cursor={{
            stroke: "#3B82F6",
            strokeDasharray: "4 4",
          }}
          contentStyle={{
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(15,23,42,.95)",
            color: "#fff",
            backdropFilter: "blur(18px)",
            boxShadow: "0 20px 50px rgba(0,0,0,.35)",
          }}
        />

        <Legend
          iconType="circle"
          verticalAlign="top"
          height={40}
          wrapperStyle={{
            fontSize: 12,
            fontWeight: 600,
          }}
        />

        {countries.map((country, index) => (
          <Area
            key={country}
            type="monotone"
            dataKey={country}
            name={country}
            stroke={COLORS[index]}
            fill={`url(#gradient-${index})`}
            strokeWidth={3}
            animationDuration={900}
            activeDot={{
              r: 6,
              strokeWidth: 2,
              stroke: "#fff",
              fill: COLORS[index],
            }}
            dot={false}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}