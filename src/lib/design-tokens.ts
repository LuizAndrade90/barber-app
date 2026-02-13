export const STATUS_COLORS = {
  agendado: {
    bg: "bg-blue-50 dark:bg-blue-950",
    text: "text-blue-700 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  confirmado: {
    bg: "bg-primary/10 dark:bg-primary/20",
    text: "text-primary-dark dark:text-primary",
    dot: "bg-primary",
  },
  em_atendimento: {
    bg: "bg-amber-50 dark:bg-amber-950",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  concluido: {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-600 dark:text-gray-400",
    dot: "bg-gray-400",
  },
  cancelado: {
    bg: "bg-red-50 dark:bg-red-950",
    text: "text-red-700 dark:text-red-300",
    dot: "bg-red-500",
  },
  no_show: {
    bg: "bg-orange-50 dark:bg-orange-950",
    text: "text-orange-700 dark:text-orange-300",
    dot: "bg-orange-500",
  },
} as const;

export const STATUS_LABELS: Record<string, string> = {
  agendado: "Agendado",
  confirmado: "Confirmado",
  em_atendimento: "Em Atendimento",
  concluido: "Concluído",
  cancelado: "Cancelado",
  no_show: "Não Compareceu",
};

export const AVATAR_COLORS = [
  "bg-primary text-white",
  "bg-orange-500 text-white",
  "bg-blue-500 text-white",
  "bg-purple-500 text-white",
  "bg-teal-500 text-white",
] as const;

export function getAvatarColor(index: number) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

export function formatCentavos(centavos: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(centavos / 100);
}

export function getIniciais(nome: string): string {
  return nome
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
