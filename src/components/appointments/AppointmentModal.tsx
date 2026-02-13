"use client";

import { useState } from "react";
import { BarberAvatar } from "@/components/ui/barber-avatar";
import { ServiceCard } from "@/components/ui/service-card";
import { TimeSlot } from "@/components/ui/time-slot";
import { SearchInput } from "@/components/shared/SearchInput";
import { ClientCard } from "@/components/ui/client-card";
import { trpc } from "@/lib/trpc/client";
import { formatCentavos } from "@/lib/design-tokens";

interface AppointmentModalProps {
  aberto: boolean;
  onFechar: () => void;
  onCriado?: () => void;
}

type Etapa = "barbeiro" | "servico" | "data" | "horario" | "cliente" | "confirmar";

const ETAPAS: { key: Etapa; titulo: string }[] = [
  { key: "barbeiro", titulo: "Selecione o profissional" },
  { key: "servico", titulo: "Escolha o serviço" },
  { key: "data", titulo: "Escolha a data" },
  { key: "horario", titulo: "Escolha o horário" },
  { key: "cliente", titulo: "Selecione o cliente" },
  { key: "confirmar", titulo: "Confirmar agendamento" },
];

export function AppointmentModal({
  aberto,
  onFechar,
  onCriado,
}: AppointmentModalProps) {
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [barbeiroId, setBarbeiroId] = useState<string | null>(null);
  const [servicoId, setServicoId] = useState<string | null>(null);
  const [data, setData] = useState<string>("");
  const [horario, setHorario] = useState<string | null>(null);
  const [clienteId, setClienteId] = useState<string | null>(null);
  const [buscaCliente, setBuscaCliente] = useState("");

  const { data: barbeiros } = trpc.barbers.list.useQuery();
  const { data: servicos } = trpc.services.list.useQuery();
  const { data: slots } = trpc.appointments.getAvailableSlots.useQuery(
    { barbeiroId: barbeiroId!, servicoId: servicoId!, data },
    { enabled: !!barbeiroId && !!servicoId && !!data }
  );
  const { data: clientesBusca } = trpc.clients.search.useQuery(
    { termo: buscaCliente },
    { enabled: buscaCliente.length >= 2 }
  );
  const { data: todosClientes } = trpc.clients.list.useQuery(
    { busca: "", filtro: "todos" },
    { enabled: !buscaCliente }
  );

  const createMutation = trpc.appointments.create.useMutation({
    onSuccess: () => {
      onCriado?.();
      resetar();
      onFechar();
    },
  });

  const resetar = () => {
    setEtapaAtual(0);
    setBarbeiroId(null);
    setServicoId(null);
    setData("");
    setHorario(null);
    setClienteId(null);
    setBuscaCliente("");
  };

  const avancar = () => setEtapaAtual((e) => Math.min(e + 1, ETAPAS.length - 1));
  const voltar = () => {
    if (etapaAtual === 0) {
      onFechar();
    } else {
      setEtapaAtual((e) => e - 1);
    }
  };

  const confirmar = () => {
    if (!barbeiroId || !servicoId || !clienteId || !data || !horario) return;

    const [h, m] = horario.split(":");
    const dataHora = new Date(data);
    dataHora.setHours(parseInt(h), parseInt(m), 0, 0);

    createMutation.mutate({
      barbeiroId,
      servicoId,
      clienteId,
      dataHora: dataHora.toISOString(),
    });
  };

  if (!aberto) return null;

  const etapa = ETAPAS[etapaAtual];
  const barbeiroSelecionado = barbeiros?.find((b) => b.id === barbeiroId);
  const servicoSelecionado = servicos?.find((s) => s.id === servicoId);
  const clientesExibidos = buscaCliente ? clientesBusca : todosClientes;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <div className="fixed inset-0 bg-black/50" onClick={onFechar} />

      <div className="relative z-10 flex max-h-[90vh] w-full flex-col rounded-t-3xl border border-border bg-surface-light dark:bg-surface-dark md:max-w-lg md:rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <button onClick={voltar} className="text-muted-foreground">
            <span className="material-icons-round">
              {etapaAtual === 0 ? "close" : "arrow_back"}
            </span>
          </button>
          <h2 className="text-sm font-semibold text-foreground">
            {etapa.titulo}
          </h2>
          <span className="text-xs text-muted-foreground">
            {etapaAtual + 1}/{ETAPAS.length}
          </span>
        </div>

        {/* Conteudo */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Etapa 1: Barbeiro */}
          {etapa.key === "barbeiro" && (
            <div className="flex flex-wrap gap-4 justify-center">
              {barbeiros?.filter((b) => b.ativo).map((b) => (
                <BarberAvatar
                  key={b.id}
                  nome={b.nome}
                  cor={b.corCalendario}
                  selecionado={barbeiroId === b.id}
                  onClick={() => {
                    setBarbeiroId(b.id);
                    avancar();
                  }}
                />
              ))}
            </div>
          )}

          {/* Etapa 2: Serviço */}
          {etapa.key === "servico" && (
            <div className="space-y-3">
              {servicos?.filter((s) => s.ativo).map((s) => (
                <ServiceCard
                  key={s.id}
                  nome={s.nome}
                  descricao={s.descricao}
                  duracaoMinutos={s.duracaoMinutos}
                  precoCentavos={s.precocentavos}
                  icone={s.icone}
                  selecionado={servicoId === s.id}
                  onClick={() => {
                    setServicoId(s.id);
                    avancar();
                  }}
                />
              ))}
            </div>
          )}

          {/* Etapa 3: Data */}
          {etapa.key === "data" && (
            <div>
              <input
                type="date"
                value={data}
                onChange={(e) => {
                  setData(e.target.value);
                  setHorario(null);
                  avancar();
                }}
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-xl border border-border bg-background p-4 text-foreground"
              />
            </div>
          )}

          {/* Etapa 4: Horário */}
          {etapa.key === "horario" && (
            <div className="grid grid-cols-3 gap-2">
              {slots?.map((slot) => (
                <TimeSlot
                  key={slot.horaInicio}
                  hora={slot.horaInicio}
                  selecionado={horario === slot.horaInicio}
                  onClick={() => {
                    setHorario(slot.horaInicio);
                    avancar();
                  }}
                />
              ))}
              {slots?.length === 0 && (
                <p className="col-span-3 py-8 text-center text-sm text-muted-foreground">
                  Nenhum horário disponível nesta data.
                </p>
              )}
            </div>
          )}

          {/* Etapa 5: Cliente */}
          {etapa.key === "cliente" && (
            <div className="space-y-3">
              <SearchInput
                placeholder="Buscar cliente..."
                onChange={setBuscaCliente}
              />
              <div className="space-y-2">
                {clientesExibidos?.map((c) => (
                  <ClientCard
                    key={c.id}
                    nome={c.nome}
                    whatsapp={c.whatsapp}
                    vip={c.vip}
                    onClick={() => {
                      setClienteId(c.id);
                      avancar();
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Etapa 6: Confirmar */}
          {etapa.key === "confirmar" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Profissional</span>
                  <span className="text-sm font-medium text-foreground">
                    {barbeiroSelecionado?.nome}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Serviço</span>
                  <span className="text-sm font-medium text-foreground">
                    {servicoSelecionado?.nome}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Data</span>
                  <span className="text-sm font-medium text-foreground">
                    {data && new Date(data + "T12:00:00").toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Horário</span>
                  <span className="text-sm font-medium text-foreground">{horario}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="text-sm font-semibold text-foreground">Valor</span>
                  <span className="text-sm font-bold text-primary">
                    {servicoSelecionado && formatCentavos(servicoSelecionado.precocentavos)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {etapa.key === "confirmar" && (
          <div className="border-t border-border p-4">
            <button
              onClick={confirmar}
              disabled={createMutation.isPending}
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
            >
              {createMutation.isPending
                ? "Agendando..."
                : "Confirmar Agendamento"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
