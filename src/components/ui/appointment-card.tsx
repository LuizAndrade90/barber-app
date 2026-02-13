import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import { AvatarIniciais } from "./avatar-initials";
import type { STATUS_COLORS } from "@/lib/design-tokens";
import { formatCentavos } from "@/lib/design-tokens";

interface AppointmentCardProps {
  clienteNome: string;
  servicoNome: string;
  barbeiroNome: string;
  barbeiroCor: string;
  horaInicio: string;
  horaFim: string;
  status: keyof typeof STATUS_COLORS;
  precoCentavos: number;
  onClick?: () => void;
  className?: string;
}

export function AppointmentCard({
  clienteNome,
  servicoNome,
  barbeiroNome,
  barbeiroCor,
  horaInicio,
  horaFim,
  status,
  precoCentavos,
  onClick,
  className,
}: AppointmentCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl border border-border bg-surface-light p-3 text-left transition-colors hover:bg-accent dark:bg-surface-dark",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Barra de cor do barbeiro */}
        <div
          className="mt-1 h-12 w-1 rounded-full"
          style={{ backgroundColor: barbeiroCor }}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-foreground truncate">
              {clienteNome}
            </p>
            <StatusBadge status={status} />
          </div>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {servicoNome} • {barbeiroNome}
          </p>

          <div className="mt-1.5 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {horaInicio} - {horaFim}
            </p>
            <p className="text-xs font-medium text-foreground">
              {formatCentavos(precoCentavos)}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}
