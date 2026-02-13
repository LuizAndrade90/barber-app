import { cn } from "@/lib/utils";
import { getIniciais } from "@/lib/design-tokens";

interface BarberAvatarProps {
  nome: string;
  cor: string;
  selecionado?: boolean;
  avatar?: string | null;
  onClick?: () => void;
  className?: string;
}

export function BarberAvatar({
  nome,
  cor,
  selecionado,
  avatar,
  onClick,
  className,
}: BarberAvatarProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1.5",
        className
      )}
    >
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full text-white font-semibold transition-all",
          selecionado && "ring-2 ring-offset-2 shadow-glow"
        )}
        style={{
          backgroundColor: cor,
          ["--tw-ring-color" as string]: selecionado ? cor : undefined,
        }}
      >
        {avatar ? (
          <img
            src={avatar}
            alt={nome}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          getIniciais(nome)
        )}
      </div>
      <span
        className={cn(
          "text-xs truncate max-w-[4rem]",
          selecionado
            ? "font-semibold text-foreground"
            : "text-muted-foreground"
        )}
      >
        {nome.split(" ")[0]}
      </span>
    </button>
  );
}
