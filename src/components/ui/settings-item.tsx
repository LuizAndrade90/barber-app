import { cn } from "@/lib/utils";

interface SettingsItemProps {
  icone: string;
  titulo: string;
  descricao?: string;
  valor?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function SettingsItem({
  icone,
  titulo,
  descricao,
  valor,
  onClick,
  children,
  className,
}: SettingsItemProps) {
  const Comp = onClick ? "button" : "div";

  return (
    <Comp
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl border border-border bg-surface-light p-4 text-left transition-colors dark:bg-surface-dark",
        onClick && "hover:bg-accent cursor-pointer",
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
        <span className="material-icons-round text-primary">{icone}</span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{titulo}</p>
        {descricao && (
          <p className="text-xs text-muted-foreground">{descricao}</p>
        )}
      </div>

      {children}

      {valor && (
        <p className="text-sm text-muted-foreground">{valor}</p>
      )}

      {onClick && !children && (
        <span className="material-icons-round text-muted-foreground">
          chevron_right
        </span>
      )}
    </Comp>
  );
}
