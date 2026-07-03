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

type ChartPoint = {
  date: string;
  queryGenerated: number;
  dealsDone: number;
  tutorAssigned: number;
  dealsDoneAmount: number;
};

export default function OperationsLineChart({
  data,
  dataKey,
  label,
  prefix = "",
}: {
  data: ChartPoint[];
  dataKey: keyof ChartPoint;
  label: string;
  prefix?: string;
}) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: -20,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.25} />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />

          <Tooltip
            contentStyle={{
              borderRadius: "14px",
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--foreground)",
              fontSize: "12px",
            }}
            formatter={(value: any) => [`${prefix}${value}`, label]}
            labelStyle={{
              color: "var(--foreground)",
              fontWeight: 800,
            }}
          />

          <Line
            type="monotone"
            dataKey={dataKey as string}
            name={label}
            stroke="currentColor"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}