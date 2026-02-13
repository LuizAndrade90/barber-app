"use client";

import { BarberAvatar } from "@/components/ui/barber-avatar";

interface Barbeiro {
  id: string;
  nome: string;
  cor: string;
  avatar?: string | null;
}

interface BarberFilterProps {
  barbeiros: Barbeiro[];
  selecionadoId: string | null;
  onSelect: (id: string | null) => void;
}

export function BarberFilter({
  barbeiros,
  selecionadoId,
  onSelect,
}: BarberFilterProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {/* Todos */}
      <button
        onClick={() => onSelect(null)}
        className={`flex flex-col items-center gap-1.5 ${
          selecionadoId === null
            ? "opacity-100"
            : "opacity-60"
        }`}
      >
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all ${
            selecionadoId === null ? "ring-2 ring-primary ring-offset-2" : ""
          }`}
        >
          <span className="material-icons-round">groups</span>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          Todos
        </span>
      </button>

      {barbeiros.map((b) => (
        <BarberAvatar
          key={b.id}
          nome={b.nome}
          cor={b.cor}
          avatar={b.avatar}
          selecionado={selecionadoId === b.id}
          onClick={() => onSelect(selecionadoId === b.id ? null : b.id)}
        />
      ))}
    </div>
  );
}
