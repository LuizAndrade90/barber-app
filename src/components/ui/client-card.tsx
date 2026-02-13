import { cn } from "@/lib/utils";
import { AvatarIniciais } from "./avatar-initials";

interface ClientCardProps {
  nome: string;
  whatsapp?: string | null;
  ultimaVisita?: string;
  totalVisitas?: number;
  vip?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ClientCard({
  nome,
  whatsapp,
  ultimaVisita,
  totalVisitas,
  vip,
  onClick,
  className,
}: ClientCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border border-border bg-surface-light p-3 text-left transition-colors hover:bg-accent dark:bg-surface-dark",
        className
      )}
    >
      <AvatarIniciais nome={nome} tamanho="md" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground truncate">
            {nome}
          </p>
          {vip && (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900 dark:text-amber-300">
              VIP
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {whatsapp || "Sem WhatsApp"}
          {totalVisitas != null && ` • ${totalVisitas} visitas`}
        </p>
        {ultimaVisita && (
          <p className="text-xs text-muted-foreground">
            Última visita: {ultimaVisita}
          </p>
        )}
      </div>

      <span className="material-icons-round text-lg text-muted-foreground">
        chevron_right
      </span>
    </button>
  );
}
