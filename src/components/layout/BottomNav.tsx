"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/agenda", label: "Agenda", icon: "calendar_today" },
  { href: "/clientes", label: "Clientes", icon: "people" },
  { href: "/relatorios", label: "Caixa", icon: "attach_money" },
  { href: "/configuracoes", label: "Ajustes", icon: "settings" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 flex justify-around items-center px-2 py-3 z-50 pb-safe">
      {navItems.map((item, index) => {
        const isActive = pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 p-2",
              isActive
                ? "text-primary"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            )}
          >
            <span className="material-icons-round">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
