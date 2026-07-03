"use client";

import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartPoint = {
  date: string;
  whatsappGroups: number;
  whatsappPosts: number;
  telegramGroups: number;
  telegramPosts: number;
  facebookGroups: number;
  facebookPosts: number;
  resourceLogin: number;
  accountClean: number;
  totalGroups: number;
  totalPosts: number;
};

export default function EmployeeMarketingLineChart({
  data,
  dataKey,
  label,
}: {
  data: ChartPoint[];
  dataKey: keyof ChartPoint;
  label: string;
}) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
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