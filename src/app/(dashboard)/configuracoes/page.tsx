import { Header } from "@/components/layout/Header";
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
  return (
    <div>
      <Header titulo="Configurações" subtitulo="Personalize sua barbearia" />
      <div className="p-4 md:p-6">
        <div className="space-y-2">
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
