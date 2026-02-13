import { cn } from "@/lib/utils";

interface StatCardProps {
  titulo: string;
  valor: string;
  icone: string;
  variacao?: string;
  positivo?: boolean;
  className?: string;
}

export function StatCard({
  titulo,
  valor,
  icone,
  variacao,
  positivo,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface-light p-4 dark:bg-surface-dark",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{titulo}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{valor}</p>
          {variacao && (
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                positivo ? "text-primary" : "text-red-500"
              )}
            >
              {positivo ? "+" : ""}
              {variacao}
            </p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <span className="material-icons-round text-primary">{icone}</span>
        </div>
      </div>
    </div>
  );
}
