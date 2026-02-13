"use client";

import { Header } from "@/components/layout/Header";
import { useUIStore } from "@/stores/uiStore";
import Link from "next/link";

const items = [
  {
    href: "/configuracoes/horarios",
    icon: "schedule",
    titulo: "Horários de Funcionamento",
    descricao: "Defina os horários de abertura e fechamento",
  },
  {
    href: "/equipe",
    icon: "groups",
    titulo: "Equipe",
    descricao: "Gerencie barbeiros e permissões",
  },
  {
    href: "/servicos",
    icon: "content_cut",
    titulo: "Serviços",
    descricao: "Configure serviços, preços e duração",
  },
  {
    href: "/configuracoes/whatsapp",
    icon: "chat",
    titulo: "WhatsApp",
    descricao: "Configure a integração com WhatsApp",
  },
];

export default function ConfiguracoesPage() {
  const darkMode = useUIStore((s) => s.darkMode);
  const toggleDarkMode = useUIStore((s) => s.toggleDarkMode);

  return (
    <div>
      <Header titulo="Configurações" subtitulo="Personalize sua barbearia" />
      <div className="p-4 md:p-6">
        <div className="space-y-2">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex w-full items-center gap-4 rounded-2xl border border-border bg-surface-light p-4 text-left transition-colors hover:bg-accent dark:bg-surface-dark"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <span className="material-icons-round text-primary">
                {darkMode ? "light_mode" : "dark_mode"}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Modo Escuro
              </p>
              <p className="text-xs text-muted-foreground">
                {darkMode ? "Ativado" : "Desativado"} — alterne o tema da interface
              </p>
            </div>
            <div
              className={`relative h-6 w-11 rounded-full transition-colors ${
                darkMode ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  darkMode ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </div>
          </button>

          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 rounded-2xl border border-border bg-surface-light p-4 transition-colors hover:bg-accent dark:bg-surface-dark"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <span className="material-icons-round text-primary">
                  {item.icon}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {item.titulo}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.descricao}
                </p>
              </div>
              <span className="material-icons-round text-muted-foreground">
                chevron_right
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
