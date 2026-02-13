import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icone: string;
  titulo: string;
  descricao?: string;
  ctaLabel?: string;
  onCta?: () => void;
  className?: string;
}

export function EmptyState({
  icone,
  titulo,
  descricao,
  ctaLabel,
  onCta,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 px-6",
        className
      )}
    >
      <span className="material-icons-round text-4xl text-muted-foreground">
        {icone}
      </span>
      <h3 className="mt-3 text-sm font-semibold text-foreground">{titulo}</h3>
      {descricao && (
        <p className="mt-1 text-center text-xs text-muted-foreground max-w-xs">
          {descricao}
        </p>
      )}
      {ctaLabel && onCta && (
        <button
          onClick={onCta}
          className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
