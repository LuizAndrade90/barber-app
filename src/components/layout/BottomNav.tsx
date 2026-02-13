"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/agenda", label: "Agenda", icon: "calendar_today" },
  { href: "/clientes", label: "Clientes", icon: "people" },
  { href: "/agenda?novo=1", label: "Novo", icon: "add", isFab: true },
  { href: "/relatorios", label: "Relatórios", icon: "bar_chart" },
  { href: "/configuracoes", label: "Ajustes", icon: "settings" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-surface-light dark:bg-surface-dark md:hidden">
      <div className="flex items-end justify-around px-2 pb-safe">
        {navItems.map((item) => {
          const isActive =
            !item.isFab && pathname.startsWith(item.href.split("?")[0]);

          if (item.isFab) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex -mt-5 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-glow transition-transform active:scale-95"
              >
                <span className="material-icons-round text-white text-2xl">
                  {item.icon}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <span className="material-icons-round text-xl">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
