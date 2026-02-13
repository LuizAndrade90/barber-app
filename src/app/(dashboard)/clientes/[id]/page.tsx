"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { AvatarIniciais } from "@/components/ui/avatar-initials";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingState } from "@/components/shared/LoadingState";
import { trpc } from "@/lib/trpc/client";
import { formatCentavos } from "@/lib/design-tokens";
import type { STATUS_COLORS } from "@/lib/design-tokens";

export default function ClienteDetalhePage() {
  const params = useParams();
  const clienteId = params.id as string;

  const { data: cliente, isLoading } = trpc.clients.getById.useQuery({
    id: clienteId,
  });

  if (isLoading) {
    return (
      <div>
        <Header titulo="Cliente" />
        <LoadingState mensagem="Carregando cliente..." />
      </div>
    );
  }

  if (!cliente) {
    return (
      <div>
        <Header titulo="Cliente" />
        <div className="p-4 text-center text-sm text-muted-foreground">
          Cliente não encontrado
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header titulo={cliente.nome} />

      <div className="space-y-4 p-4 md:p-6">
        {/* Perfil */}
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface-light p-4 dark:bg-surface-dark">
          <AvatarIniciais nome={cliente.nome} tamanho="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground">
                {cliente.nome}
              </h2>
              {cliente.vip && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                  VIP
                </span>
              )}
            </div>
            {cliente.whatsapp && (
              <p className="text-sm text-muted-foreground">{cliente.whatsapp}</p>
            )}
            {cliente.email && (
              <p className="text-sm text-muted-foreground">{cliente.email}</p>
            )}
          </div>
        </div>

        {/* Botoes contato */}
        {cliente.whatsapp && (
          <div className="flex gap-3">
            <a
              href={`https://wa.me/${cliente.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white"
            >
              <span className="material-icons-round text-lg">chat</span>
              WhatsApp
            </a>
            <a
              href={`tel:${cliente.telefone || cliente.whatsapp}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground"
            >
              <span className="material-icons-round text-lg">phone</span>
              Ligar
            </a>
          </div>
        )}

        {/* Metricas */}
        {cliente.metricas && (
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              titulo="Visitas"
              valor={String(cliente.metricas.totalVisitas)}
              icone="event_available"
            />
            <StatCard
              titulo="Total Gasto"
              valor={formatCentavos(cliente.metricas.totalGasto)}
              icone="attach_money"
            />
            <StatCard
              titulo="Ticket Médio"
              valor={formatCentavos(cliente.metricas.ticketMedio)}
              icone="receipt"
            />
            <StatCard
              titulo="Frequência"
              valor={
                cliente.metricas.frequenciaDias
                  ? `${cliente.metricas.frequenciaDias} dias`
                  : "—"
              }
              icone="calendar_today"
            />
          </div>
        )}

        {/* Historico de agendamentos */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Histórico de Agendamentos
          </h3>
          {!cliente.ultimosAgendamentos?.length ? (
            <p className="text-sm text-muted-foreground">
              Nenhum agendamento registrado.
            </p>
          ) : (
            <div className="space-y-2">
              {cliente.ultimosAgendamentos.map((ag) => (
                <div
                  key={ag.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface-light p-3 dark:bg-surface-dark"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {ag.servico?.nome}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ag.barbeiro?.nome} •{" "}
                      {new Date(ag.dataHora).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {formatCentavos(ag.precoFinal ?? ag.precoOriginal)}
                    </span>
                    <StatusBadge status={ag.status as keyof typeof STATUS_COLORS} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Observacoes */}
        {cliente.observacoes && (
          <div className="rounded-2xl border border-border bg-surface-light p-4 dark:bg-surface-dark">
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              Observações
            </h3>
            <p className="text-sm text-muted-foreground">
              {cliente.observacoes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
