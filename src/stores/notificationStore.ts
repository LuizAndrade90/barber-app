import { create } from "zustand";

export interface Notificacao {
  id: string;
  tipo: "sucesso" | "erro" | "aviso" | "info";
  titulo: string;
  descricao?: string;
  duracao?: number;
}

interface NotificationState {
  notificacoes: Notificacao[];
  adicionar: (notificacao: Omit<Notificacao, "id">) => void;
  remover: (id: string) => void;
  limpar: () => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notificacoes: [],
  adicionar: (notificacao) => {
    const id = crypto.randomUUID();
    set((state) => ({
      notificacoes: [...state.notificacoes, { ...notificacao, id }],
    }));

    // Auto-remover apos duracao
    const duracao = notificacao.duracao ?? 5000;
    if (duracao > 0) {
      setTimeout(() => {
        set((state) => ({
          notificacoes: state.notificacoes.filter((n) => n.id !== id),
        }));
      }, duracao);
    }
  },
  remover: (id) =>
    set((state) => ({
      notificacoes: state.notificacoes.filter((n) => n.id !== id),
    })),
  limpar: () => set({ notificacoes: [] }),
}));
