"use client";

import { cn } from "@/lib/utils";

interface WeekSelectorProps {
  dataSelecionada: Date;
  onSelectDate: (date: Date) => void;
  className?: string;
}

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

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
    <section className={cn("mb-8 overflow-x-auto pb-4 md:pb-0 scrollbar-hide", className)}>
      <div className="flex md:grid md:grid-cols-7 gap-3 min-w-max md:min-w-0">
        {dias.map((dia, i) => {
          const isSelecionado =
            dia.toDateString() === dataSelecionada.toDateString();

          return (
            <button
              key={i}
              onClick={() => onSelectDate(dia)}
              className={cn(
                "flex flex-col items-center justify-center p-3 w-16 md:w-auto h-20 md:h-24 rounded-xl transition-all",
                isSelecionado
                  ? "bg-primary text-white shadow-glow transform scale-105"
                  : "bg-surface-light dark:bg-surface-dark text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              )}
            >
              <span
                className={cn(
                  "text-xs font-medium uppercase mb-1",
                  isSelecionado && "opacity-90"
                )}
              >
                {DIAS_SEMANA[i]}
              </span>
              <span
                className={cn(
                  isSelecionado ? "text-2xl font-bold" : "text-lg font-semibold"
                )}
              >
                {dia.getDate()}
              </span>
              {isSelecionado && (
                <div className="w-1.5 h-1.5 bg-white rounded-full mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
