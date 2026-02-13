"use client";

import { AppointmentCard } from "@/components/ui/appointment-card";
import type { STATUS_COLORS } from "@/lib/design-tokens";

interface Agendamento {
  id: string;
  clienteNome: string;
  servicoNome: string;
  barbeiroNome: string;
  barbeiroCor: string;
  horaInicio: string;
  horaFim: string;
  status: keyof typeof STATUS_COLORS;
  precoCentavos: number;
}

interface DayViewProps {
  agendamentos: Agendamento[];
  onAgendamentoClick?: (id: string) => void;
}

const HORAS = Array.from({ length: 15 }, (_, i) => i + 7); // 07:00 - 21:00

export function DayView({ agendamentos, onAgendamentoClick }: DayViewProps) {
  return (
    <div className="space-y-0">
      {HORAS.map((hora) => {
        const horaStr = `${hora.toString().padStart(2, "0")}:00`;
        const agendamentosHora = agendamentos.filter((a) => {
          const h = parseInt(a.horaInicio.split(":")[0]);
          return h === hora;
        });

        return (
          <div key={hora} className="flex min-h-[4rem] border-b border-border">
            {/* Hora */}
            <div className="w-14 flex-shrink-0 pt-2 text-right">
              <span className="text-xs text-muted-foreground pr-3">
                {horaStr}
              </span>
            </div>

            {/* Agendamentos */}
            <div className="flex-1 space-y-1 py-1 pl-3">
              {agendamentosHora.map((ag) => (
                <AppointmentCard
                  key={ag.id}
                  clienteNome={ag.clienteNome}
                  servicoNome={ag.servicoNome}
                  barbeiroNome={ag.barbeiroNome}
                  barbeiroCor={ag.barbeiroCor}
                  horaInicio={ag.horaInicio}
                  horaFim={ag.horaFim}
                  status={ag.status}
                  precoCentavos={ag.precoCentavos}
                  onClick={() => onAgendamentoClick?.(ag.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
