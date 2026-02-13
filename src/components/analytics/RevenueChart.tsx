"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface DataPoint {
  data: string;
  receita: number;
}

interface RevenueChartProps {
  dados: DataPoint[];
}

export function RevenueChart({ dados }: RevenueChartProps) {
  const formatarValor = (valor: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor / 100);

  return (
    <div className="rounded-2xl border border-border bg-surface-light p-4 dark:bg-surface-dark">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Receita ao longo do tempo
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="data"
              tick={{ fontSize: 11 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              tickFormatter={(v) => `R$${(v / 100).toFixed(0)}`}
              tick={{ fontSize: 11 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip
              formatter={(value) => [formatarValor(value as number), "Receita"]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid hsl(var(--border))",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="receita"
              stroke="#25d466"
              strokeWidth={2}
              dot={{ fill: "#25d466", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
