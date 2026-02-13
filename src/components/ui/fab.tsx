import { cn } from "@/lib/utils";

interface FabProps {
  icone?: string;
  label?: string;
  onClick?: () => void;
  className?: string;
}

export function Fab({
  icone = "add",
  label,
  onClick,
  className,
}: FabProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-24 right-4 z-20 flex items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-white shadow-glow transition-transform active:scale-95 md:bottom-6",
        className
      )}
    >
      <span className="material-icons-round">{icone}</span>
      {label && <span className="text-sm font-semibold">{label}</span>}
    </button>
  );
}
