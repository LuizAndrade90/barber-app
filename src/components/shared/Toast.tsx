"use client";

import { useNotificationStore } from "@/stores/notificationStore";
import { cn } from "@/lib/utils";

const TIPO_CONFIG = {
  sucesso: { icone: "check_circle", cor: "text-primary", bg: "bg-primary/10" },
  erro: { icone: "error", cor: "text-red-500", bg: "bg-red-50" },
  aviso: { icone: "warning", cor: "text-amber-500", bg: "bg-amber-50" },
  info: { icone: "info", cor: "text-blue-500", bg: "bg-blue-50" },
} as const;

export function ToastContainer() {
  const notificacoes = useNotificationStore((s) => s.notificacoes);
  const remover = useNotificationStore((s) => s.remover);

  if (!notificacoes.length) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 space-y-2 md:bottom-6 md:right-6">
      {notificacoes.map((notif) => {
        const config = TIPO_CONFIG[notif.tipo];
        return (
          <div
            key={notif.id}
            className={cn(
              "flex items-start gap-3 rounded-xl border border-border bg-surface-light p-3 shadow-soft dark:bg-surface-dark animate-in slide-in-from-right",
              "min-w-[280px] max-w-sm"
            )}
          >
            <div className={cn("rounded-lg p-1", config.bg)}>
              <span className={cn("material-icons-round text-lg", config.cor)}>
                {config.icone}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {notif.titulo}
              </p>
              {notif.descricao && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {notif.descricao}
                </p>
              )}
            </div>
            <button
              onClick={() => remover(notif.id)}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground"
            >
              <span className="material-icons-round text-lg">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
