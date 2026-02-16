"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/agenda", label: "Agenda", icon: "calendar_today" },
  { href: "/clientes", label: "Clientes", icon: "people" },
  { href: "/servicos", label: "Serviços", icon: "content_cut" },
  { href: "/relatorios", label: "Financeiro", icon: "attach_money" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const userName = session?.user?.name || "Usuário";
  const userImage = session?.user?.image;

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-surface-light dark:bg-surface-dark border-r border-gray-100 dark:border-gray-800 z-50">
      {/* Logo */}
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl">
          AB
        </div>
        <h1 className="text-xl font-bold tracking-tight">AgendaBarber</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
            >
              <span className="material-icons-round">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Settings & Profile */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <Link
          href="/configuracoes"
          className={cn(
            "flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors",
            pathname.startsWith("/configuracoes")
              ? "bg-primary/10 text-primary"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          )}
        >
          <span className="material-icons-round">settings</span>
          Configurações
        </Link>
        <div className="mt-4 flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
          {userImage ? (
            <img
              className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-gray-700"
              src={userImage}
              alt="Avatar"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
              {userName
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{userName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Pro Account
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
