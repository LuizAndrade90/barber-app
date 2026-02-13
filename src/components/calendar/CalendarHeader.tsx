"use client";

import { cn } from "@/lib/utils";

interface CalendarHeaderProps {
  dataSelecionada: Date;
  viewMode: "dia" | "semana";
  onViewModeChange: (mode: "dia" | "semana") => void;
  onAnterior: () => void;
  onProximo: () => void;
  onHoje: () => void;
}

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const DIAS_SEMANA = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export function CalendarHeader({
  dataSelecionada,
  viewMode,
  onViewModeChange,
  onAnterior,
  onProximo,
  onHoje,
}: CalendarHeaderProps) {
  const hoje = new Date();
  const isHoje = dataSelecionada.toDateString() === hoje.toDateString();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={onAnterior}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent"
        >
          <span className="material-icons-round text-lg">chevron_left</span>
        </button>
        <button
          onClick={onProximo}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent"
        >
          <span className="material-icons-round text-lg">chevron_right</span>
        </button>

        <div className="ml-1">
          <p className="text-sm font-semibold text-foreground">
            {dataSelecionada.getDate()} de{" "}
            {MESES[dataSelecionada.getMonth()]}
          </p>
          <p className="text-xs text-muted-foreground">
            {DIAS_SEMANA[dataSelecionada.getDay()]}
          </p>
        </div>

        {!isHoje && (
          <button
            onClick={onHoje}
            className="ml-2 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20"
          >
            Hoje
          </button>
        )}
      </div>

      {/* Toggle dia/semana */}
      <div className="flex rounded-xl bg-muted p-0.5">
        <button
          onClick={() => onViewModeChange("dia")}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            viewMode === "dia"
              ? "bg-surface-light text-foreground shadow-sm dark:bg-surface-dark"
              : "text-muted-foreground"
          )}
        >
          Dia
        </button>
        <button
          onClick={() => onViewModeChange("semana")}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            viewMode === "semana"
              ? "bg-surface-light text-foreground shadow-sm dark:bg-surface-dark"
              : "text-muted-foreground"
          )}
        >
          Semana
        </button>
      </div>
    </div>
  );
}
