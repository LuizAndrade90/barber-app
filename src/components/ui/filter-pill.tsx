import { cn } from "@/lib/utils";

interface FilterPillProps {
  label: string;
  ativo?: boolean;
  contagem?: number;
  onClick?: () => void;
  className?: string;
}

export function FilterPill({
  label,
  ativo,
  contagem,
  onClick,
  className,
}: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
        ativo
          ? "bg-primary text-white"
          : "bg-muted text-muted-foreground hover:bg-accent",
        className
      )}
    >
      {label}
      {contagem != null && (
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
            ativo
              ? "bg-white/20 text-white"
              : "bg-background text-muted-foreground"
          )}
        >
          {contagem}
        </span>
      )}
    </button>
  );
}
