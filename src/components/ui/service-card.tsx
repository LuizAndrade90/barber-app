import { cn } from "@/lib/utils";
import { formatCentavos } from "@/lib/design-tokens";

interface ServiceCardProps {
  nome: string;
  descricao?: string | null;
  duracaoMinutos: number;
  precoCentavos: number;
  icone?: string | null;
  selecionado?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ServiceCard({
  nome,
  descricao,
  duracaoMinutos,
  precoCentavos,
  icone,
  selecionado,
  onClick,
  className,
}: ServiceCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl border p-4 text-left transition-all",
        selecionado
          ? "border-primary bg-primary/5 ring-2 ring-primary/20 dark:bg-primary/10"
          : "border-border bg-surface-light hover:bg-accent dark:bg-surface-dark",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            selecionado ? "bg-primary/20" : "bg-primary/10"
          )}
        >
          <span className="material-icons-round text-primary">
            {icone || "content_cut"}
          </span>
        </div>

        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{nome}</p>
          {descricao && (
            <p className="mt-0.5 text-xs text-muted-foreground">{descricao}</p>
          )}
          <div className="mt-2 flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {duracaoMinutos} min
            </span>
            <span className="text-sm font-semibold text-foreground">
              {formatCentavos(precoCentavos)}
            </span>
          </div>
        </div>

        {selecionado && (
          <span className="material-icons-round text-primary">
            check_circle
          </span>
        )}
      </div>
    </button>
  );
}
