import { cn } from "@/lib/utils";
import { getIniciais, getAvatarColor } from "@/lib/design-tokens";

interface AvatarIniciaisProps {
  nome: string;
  tamanho?: "sm" | "md" | "lg";
  corIndex?: number;
  className?: string;
}

const tamanhos = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

export function AvatarIniciais({
  nome,
  tamanho = "md",
  corIndex = 0,
  className,
}: AvatarIniciaisProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-semibold",
        tamanhos[tamanho],
        getAvatarColor(corIndex),
        className
      )}
    >
      {getIniciais(nome)}
    </div>
  );
}
