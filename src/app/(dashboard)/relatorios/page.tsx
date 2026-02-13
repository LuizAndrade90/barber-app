"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/ui/stat-card";
import { PeriodSelector } from "@/components/analytics/PeriodSelector";
import { RevenueChart } from "@/components/analytics/RevenueChart";
import { OccupancyChart } from "@/components/analytics/OccupancyChart";
import { AIInsights } from "@/components/analytics/AIInsights";
import { LoadingState } from "@/components/shared/LoadingState";
import { trpc } from "@/lib/trpc/client";
import { formatCentavos } from "@/lib/design-tokens";

function getDateRange(periodo: string) {
  const hoje = new Date();
  let dataInicio: Date;
  let dataFim: Date = new Date(hoje);

  switch (periodo) {
    case "semana": {
      dataInicio = new Date(hoje);
      dataInicio.setDate(hoje.getDate() - hoje.getDay());
      break;
    }
    case "mes": {
      dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      break;
    }
    case "mes_anterior": {
      dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
      dataFim = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
      break;
    }
    default:
      dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  }

  dataInicio.setHours(0, 0, 0, 0);
  dataFim.setHours(23, 59, 59, 999);

  return {
    dataInicio: dataInicio.toISOString(),
    dataFim: dataFim.toISOString(),
  };
}

export default function RelatoriosPage() {
  const [periodo, setPeriodo] = useState("mes");
  const range = useMemo(() => getDateRange(periodo), [periodo]);

  const { data: overview, isLoading } = trpc.analytics.getOverview.useQuery(range);

  return (
    <div>
      <Header titulo="Relatórios" subtitulo="Acompanhe o desempenho" />

      <div className="space-y-4 p-4 md:p-6">
        <PeriodSelector periodoAtual={periodo} onPeriodoChange={setPeriodo} />

        {isLoading ? (
          <LoadingState mensagem="Carregando métricas..." />
        ) : overview ? (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <StatCard
                titulo="Receita"
                valor={formatCentavos(overview.receita)}
                icone="attach_money"
              />
              <StatCard
                titulo="Agendamentos"
                valor={String(overview.totalAgendamentos)}
                icone="event"
              />
              <StatCard
                titulo="Cancelamentos"
                valor={`${overview.taxaCancelamento}%`}
                icone="event_busy"
              />
              <StatCard
                titulo="Ticket Médio"
                valor={formatCentavos(overview.ticketMedio)}
                icone="receipt"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <StatCard
                titulo="Ocupação"
                valor={`${overview.taxaOcupacao}%`}
                icone="pie_chart"
              />
              <StatCard
                titulo="Não Compareceram"
                valor={String(overview.noShows)}
                icone="person_off"
              />
            </div>

            {/* Charts placeholders with real data when available */}
            <RevenueChart dados={[]} />
            <OccupancyChart dados={[]} />

            {/* AI Insights */}
            <AIInsights />
          </>
        ) : null}
      </div>
    </div>
  );
}
