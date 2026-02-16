import { cn } from "@/lib/utils";

interface FabProps {
  icone?: string;
  label?: string;
  onClick?: () => void;
  className?: string;
}

export function Fab({
  icone = "add",
  label = "Novo Agendamento",
  onClick,
  className,
}: FabProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed right-6 bottom-20 md:bottom-8 z-40 bg-primary hover:bg-green-500 text-white rounded-2xl p-4 shadow-glow flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 group",
        className
      )}
    >
      <span className="material-icons-round text-2xl group-hover:rotate-90 transition-transform">
        {icone}
      </span>
      {label && (
        <span className="font-bold pr-1 hidden md:inline">{label}</span>
      )}
    </button>
  );
}
