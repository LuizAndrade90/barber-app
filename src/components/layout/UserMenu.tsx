"use client";

import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function UserMenu() {
  const { data: session } = useSession();
  const [aberto, setAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickFora(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  if (!session?.user) return null;

  const iniciais = session.user.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setAberto(!aberto)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white"
      >
        {iniciais || "U"}
      </button>

      {aberto && (
        <div className="absolute right-0 top-12 w-56 rounded-xl border border-border bg-surface-light p-1 shadow-soft dark:bg-surface-dark">
          <div className="border-b border-border px-3 py-2">
            <p className="text-sm font-medium text-foreground">
              {session.user.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {session.user.email}
            </p>
          </div>
          <Link
            href="/configuracoes"
            onClick={() => setAberto(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-accent"
          >
            <span className="material-icons-round text-lg">settings</span>
            Configurações
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-accent"
          >
            <span className="material-icons-round text-lg">logout</span>
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
