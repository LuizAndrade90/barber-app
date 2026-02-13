"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (valor: string) => void;
  debounceMs?: number;
  className?: string;
}

export function SearchInput({
  placeholder = "Buscar...",
  value: valorExterno,
  onChange,
  debounceMs = 300,
  className,
}: SearchInputProps) {
  const [valorInterno, setValorInterno] = useState(valorExterno ?? "");

  useEffect(() => {
    if (valorExterno !== undefined) {
      setValorInterno(valorExterno);
    }
  }, [valorExterno]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange?.(valorInterno);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [valorInterno, debounceMs, onChange]);

  return (
    <div className={cn("relative", className)}>
      <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">
        search
      </span>
      <input
        type="text"
        value={valorInterno}
        onChange={(e) => setValorInterno(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      {valorInterno && (
        <button
          onClick={() => {
            setValorInterno("");
            onChange?.("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <span className="material-icons-round text-lg text-muted-foreground hover:text-foreground">
            close
          </span>
        </button>
      )}
    </div>
  );
}
