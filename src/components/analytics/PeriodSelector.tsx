"use client";

import { cn } from "@/lib/utils";

interface PeriodSelectorProps {
  periodoAtual: string;
  onPeriodoChange: (periodo: string) => void;
}

const PERIODOS = [
  { key: "semana", label: "Esta semana" },
  { key: "mes", label: "Este mês" },
  { key: "mes_anterior", label: "Mês anterior" },
];

export function PeriodSelector({
  periodoAtual,
  onPeriodoChange,
}: PeriodSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {PERIODOS.map((p) => (
        <button
          key={p.key}
          onClick={() => onPeriodoChange(p.key)}
          className={cn(
            "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            periodoAtual === p.key
              ? "bg-primary text-white"
              : "bg-muted text-muted-foreground hover:bg-accent"
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
