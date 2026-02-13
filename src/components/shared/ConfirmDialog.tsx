"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  aberto: boolean;
  titulo: string;
  descricao?: string;
  labelConfirmar?: string;
  labelCancelar?: string;
  variante?: "perigo" | "padrao";
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ConfirmDialog({
  aberto,
  titulo,
  descricao,
  labelConfirmar = "Confirmar",
  labelCancelar = "Cancelar",
  variante = "padrao",
  onConfirmar,
  onCancelar,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (aberto) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [aberto]);

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onCancelar}
      />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-border bg-surface-light p-6 shadow-lg dark:bg-surface-dark mx-4">
        <h3 className="text-base font-semibold text-foreground">{titulo}</h3>
        {descricao && (
          <p className="mt-2 text-sm text-muted-foreground">{descricao}</p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancelar}
            className="flex-1 rounded-xl border border-border py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {labelCancelar}
          </button>
          <button
            onClick={onConfirmar}
            className={cn(
              "flex-1 rounded-xl py-2 text-sm font-semibold text-white transition-colors",
              variante === "perigo"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-primary hover:bg-primary-hover"
            )}
          >
            {labelConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
