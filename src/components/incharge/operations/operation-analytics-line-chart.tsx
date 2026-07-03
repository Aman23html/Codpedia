"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartRow = {
  date: string;
  fullDate: string;
  queryGenerated: number;
  dealsDone: number;
  tutorAssigned: number;
  dealsDoneAmount: number;
};

export default function OperationAnalyticsLineChart({
  title,
  description,
  data,
  dataKey,
  prefix,
}: {
  title: string;
  description: string;
  data: ChartRow[];
  dataKey:
    | "queryGenerated"
    | "dealsDone"
    | "tutorAssigned"
    | "dealsDoneAmount";
  prefix?: string;
}) {
  return (
    <section className="rounded-[32px] border border-[var(--border)] bg-[var(--card)]/40 p-8 shadow-sm backdrop-blur-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-[var(--foreground)]">
          {title}
        </h2>

        <p className="mt-2 text-sm font-medium text-[var(--muted-foreground)]">
          {description}
        </p>
      </div>

      <div className="h-[320px] w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background)] text-sm font-semibold text-[var(--muted-foreground)]">
            No analytics data found.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.4}
              />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                allowDecimals={false}
              />

              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                }}
                formatter={(value: any) => [
                  `${prefix ?? ""}${Number(value).toLocaleString("en-IN")}`,
                  title,
                ]}
                labelFormatter={(_, payload) => {
                  const row = payload?.[0]?.payload;
                  return row?.fullDate ?? "";
                }}
              />

              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="currentColor"
                strokeWidth={3}
                dot={{
                  r: 4,
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}