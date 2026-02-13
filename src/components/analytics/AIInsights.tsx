"use client";

import { trpc } from "@/lib/trpc/client";

const TIPO_ICONES: Record<string, string> = {
  oportunidade: "lightbulb",
  alerta: "warning",
  tendencia: "trending_up",
  sugestao: "tips_and_updates",
};

const TIPO_CORES: Record<string, string> = {
  oportunidade: "text-amber-500",
  alerta: "text-red-500",
  tendencia: "text-blue-500",
  sugestao: "text-primary",
};

export function AIInsights() {
  const { data: insights } = trpc.analytics.listInsights.useQuery();
  const dismissMutation = trpc.analytics.dismissInsight.useMutation();
  const utils = trpc.useUtils();

  if (!insights?.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">
        Insights da IA
      </h3>
      {insights.map((insight) => (
        <div
          key={insight.id}
          className="flex gap-3 rounded-2xl border border-border bg-surface-light p-4 dark:bg-surface-dark"
        >
          <span
            className={`material-icons-round mt-0.5 ${TIPO_CORES[insight.tipo] || "text-muted-foreground"}`}
          >
            {TIPO_ICONES[insight.tipo] || "info"}
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {insight.titulo}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {insight.descricao}
            </p>
          </div>
          <button
            onClick={() => {
              dismissMutation.mutate(
                { id: insight.id },
                { onSuccess: () => utils.analytics.listInsights.invalidate() }
              );
            }}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground"
          >
            <span className="material-icons-round text-lg">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}
