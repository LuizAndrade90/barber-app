"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/agenda", label: "Agenda", icon: "calendar_today" },
  { href: "/clientes", label: "Clientes", icon: "people" },
  { href: "/servicos", label: "Serviços", icon: "content_cut" },
  { href: "/equipe", label: "Equipe", icon: "groups" },
  { href: "/relatorios", label: "Relatórios", icon: "bar_chart" },
  { href: "/configuracoes", label: "Configurações", icon: "settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-border bg-surface-light dark:bg-surface-dark md:flex">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
          <span className="material-icons-round text-white text-xl">
            content_cut
          </span>
        </div>
        <div>
          <h1 className="text-base font-semibold text-foreground">
            AgendaBarber
          </h1>
        </div>
      </div>

      {/* Navegacao */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary dark:bg-primary/20"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <span className="material-icons-round text-xl">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Perfil e sair */}
      <div className="border-t border-border p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <span className="material-icons-round text-xl">logout</span>
          Sair
        </button>
      </div>
    </aside>
  );
}
