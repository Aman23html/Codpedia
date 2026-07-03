"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

export default function ReportStatusPieChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <div className="w-full min-h-[320px] rounded-2xl bg-slate-900 p-4">
      <h2 className="mb-4 text-white font-semibold">
        Report Status Overview
      </h2>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}