"use client";

import { useNotificationStore } from "@/stores/notificationStore";

export function NotificationBell() {
  const notificacoes = useNotificationStore((s) => s.notificacoes);
  const count = notificacoes.length;

  return (
    <button className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
      <span className="material-icons-round text-xl">notifications</span>
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}
