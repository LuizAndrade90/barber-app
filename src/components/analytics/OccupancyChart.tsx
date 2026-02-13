"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface DataPoint {
  data: string;
  ocupacao: number;
}

interface OccupancyChartProps {
  dados: DataPoint[];
}

export function OccupancyChart({ dados }: OccupancyChartProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface-light p-4 dark:bg-surface-dark">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Taxa de Ocupação
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="data"
              tick={{ fontSize: 11 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip
              formatter={(value) => [`${value}%`, "Ocupação"]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid hsl(var(--border))",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="ocupacao" fill="#25d466" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
