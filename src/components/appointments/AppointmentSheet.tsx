"use client";

import { StatusBadge } from "@/components/ui/status-badge";
import { AvatarIniciais } from "@/components/ui/avatar-initials";
import { LoadingState } from "@/components/shared/LoadingState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { trpc } from "@/lib/trpc/client";
import { formatCentavos, STATUS_LABELS } from "@/lib/design-tokens";
import type { STATUS_COLORS } from "@/lib/design-tokens";
import { useState } from "react";

interface AppointmentSheetProps {
  agendamentoId: string | null;
  onFechar: () => void;
  onAtualizado?: () => void;
}

export function AppointmentSheet({
  agendamentoId,
  onFechar,
  onAtualizado,
}: AppointmentSheetProps) {
  const [dialogCancelar, setDialogCancelar] = useState(false);

  const { data: agendamento, isLoading } =
    trpc.appointments.getById.useQuery(
      { id: agendamentoId! },
      { enabled: !!agendamentoId }
    );

  const confirmMutation = trpc.appointments.confirm.useMutation({
    onSuccess: () => onAtualizado?.(),
  });
  const cancelMutation = trpc.appointments.cancel.useMutation({
    onSuccess: () => {
      setDialogCancelar(false);
      onAtualizado?.();
    },
  });
  const completeMutation = trpc.appointments.complete.useMutation({
    onSuccess: () => onAtualizado?.(),
  });
  const noShowMutation = trpc.appointments.markNoShow.useMutation({
    onSuccess: () => onAtualizado?.(),
  });

  if (!agendamentoId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <div className="fixed inset-0 bg-black/50" onClick={onFechar} />

      <div className="relative z-10 flex max-h-[85vh] w-full flex-col rounded-t-3xl border border-border bg-surface-light dark:bg-surface-dark md:max-w-lg md:rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">
            Detalhes do Agendamento
          </h2>
          <button onClick={onFechar}>
            <span className="material-icons-round text-muted-foreground">
              close
            </span>
          </button>
        </div>

        {/* Conteudo */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <LoadingState />
          ) : !agendamento ? (
            <p className="text-center text-sm text-muted-foreground">
              Agendamento não encontrado
            </p>
          ) : (
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <StatusBadge
                  status={agendamento.status as keyof typeof STATUS_COLORS}
                />
                <span className="text-xs text-muted-foreground">
                  {new Date(agendamento.criadoEm).toLocaleDateString("pt-BR")}
                </span>
              </div>

              {/* Cliente */}
              {agendamento.cliente && (
                <div className="flex items-center gap-3 rounded-xl border border-border p-3">
                  <AvatarIniciais nome={agendamento.cliente.nome} tamanho="md" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {agendamento.cliente.nome}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {agendamento.cliente.whatsapp}
                    </p>
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="rounded-xl border border-border p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Serviço</span>
                  <span className="text-sm font-medium text-foreground">
                    {agendamento.servico?.nome}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Profissional</span>
                  <span className="text-sm font-medium text-foreground">
                    {agendamento.barbeiro?.nome}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Data</span>
                  <span className="text-sm font-medium text-foreground">
                    {new Date(agendamento.dataHora).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Horário</span>
                  <span className="text-sm font-medium text-foreground">
                    {new Date(agendamento.dataHora).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(agendamento.dataHoraFim).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between">
                  <span className="text-sm font-semibold text-foreground">
                    Valor
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {formatCentavos(agendamento.precoFinal ?? agendamento.precoOriginal)}
                  </span>
                </div>
              </div>

              {/* Historico */}
              {agendamento.historico && agendamento.historico.length > 0 && (
                <div>
                  <h3 className="mb-2 text-xs font-semibold text-muted-foreground uppercase">
                    Histórico
                  </h3>
                  <div className="space-y-2">
                    {agendamento.historico.map((h) => (
                      <div
                        key={h.id}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                        <span className="font-medium">
                          {STATUS_LABELS[h.acao] || h.acao}
                        </span>
                        <span>
                          {new Date(h.criadoEm).toLocaleString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Acoes por status */}
              <div className="space-y-2 pt-2">
                {agendamento.status === "agendado" && (
                  <>
                    <button
                      onClick={() => confirmMutation.mutate({ id: agendamento.id })}
                      disabled={confirmMutation.isPending}
                      className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => setDialogCancelar(true)}
                      className="w-full rounded-xl border border-red-300 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      Cancelar
                    </button>
                  </>
                )}

                {agendamento.status === "confirmado" && (
                  <>
                    <button
                      onClick={() =>
                        completeMutation.mutate({ id: agendamento.id })
                      }
                      disabled={completeMutation.isPending}
                      className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
                    >
                      Concluir Atendimento
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => noShowMutation.mutate({ id: agendamento.id })}
                        className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground hover:bg-accent"
                      >
                        Não Compareceu
                      </button>
                      <button
                        onClick={() => setDialogCancelar(true)}
                        className="flex-1 rounded-xl border border-red-300 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Cancelar
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        aberto={dialogCancelar}
        titulo="Cancelar agendamento?"
        descricao="Esta ação não pode ser desfeita. O cliente será notificado do cancelamento."
        labelConfirmar="Cancelar Agendamento"
        variante="perigo"
        onConfirmar={() =>
          cancelMutation.mutate({
            id: agendamentoId!,
            canceladoPor: "barbeiro",
          })
        }
        onCancelar={() => setDialogCancelar(false)}
      />
    </div>
  );
}
