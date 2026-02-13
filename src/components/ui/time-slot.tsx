import { cn } from "@/lib/utils";

interface TimeSlotProps {
  hora: string;
  disponivel?: boolean;
  selecionado?: boolean;
  onClick?: () => void;
  className?: string;
}

export function TimeSlot({
  hora,
  disponivel = true,
  selecionado,
  onClick,
  className,
}: TimeSlotProps) {
  return (
    <button
      onClick={disponivel ? onClick : undefined}
      disabled={!disponivel}
      className={cn(
        "rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
        selecionado
          ? "border-primary bg-primary text-white"
          : disponivel
            ? "border-border bg-surface-light text-foreground hover:border-primary hover:bg-primary/5 dark:bg-surface-dark"
            : "border-border bg-muted text-muted-foreground opacity-50 cursor-not-allowed line-through",
        className
      )}
    >
      {hora}
    </button>
  );
}
