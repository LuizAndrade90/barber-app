"use client";

import { cn } from "@/lib/utils";

interface WeekSelectorProps {
  dataSelecionada: Date;
  onSelectDate: (date: Date) => void;
  className?: string;
}

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function WeekSelector({
  dataSelecionada,
  onSelectDate,
  className,
}: WeekSelectorProps) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // Calcular inicio da semana (domingo)
  const inicioSemana = new Date(dataSelecionada);
  inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());

  const dias = Array.from({ length: 7 }, (_, i) => {
    const dia = new Date(inicioSemana);
    dia.setDate(dia.getDate() + i);
    return dia;
  });

  return (
    <div className={cn("flex gap-1", className)}>
      {dias.map((dia, i) => {
        const isHoje = dia.toDateString() === hoje.toDateString();
        const isSelecionado =
          dia.toDateString() === dataSelecionada.toDateString();

        return (
          <button
            key={i}
            onClick={() => onSelectDate(dia)}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-xs transition-colors",
              isSelecionado
                ? "bg-primary text-white"
                : isHoje
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent"
            )}
          >
            <span className="font-medium">{DIAS_SEMANA[i]}</span>
            <span className="text-lg font-bold">{dia.getDate()}</span>
          </button>
        );
      })}
    </div>
  );
}
