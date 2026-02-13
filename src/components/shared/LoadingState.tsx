import { cn } from "@/lib/utils";

interface LoadingStateProps {
  mensagem?: string;
  className?: string;
}

export function LoadingState({
  mensagem = "Carregando...",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12",
        className
      )}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="mt-3 text-sm text-muted-foreground">{mensagem}</p>
    </div>
  );
}
