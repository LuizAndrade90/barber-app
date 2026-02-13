"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { ClientCard } from "@/components/ui/client-card";
import { FilterPill } from "@/components/ui/filter-pill";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Fab } from "@/components/ui/fab";
import { trpc } from "@/lib/trpc/client";

type Filtro = "todos" | "vip" | "novos" | "inativos";

export default function ClientesPage() {
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const { data: clientes, isLoading } = trpc.clients.list.useQuery({
    busca,
    filtro,
  });

  const handleBusca = useCallback((valor: string) => {
    setBusca(valor);
  }, []);

  return (
    <div>
      <Header titulo="Clientes" subtitulo="Gerencie sua base de clientes" />

      <div className="space-y-4 p-4 md:p-6">
        {/* Busca */}
        <SearchInput
          placeholder="Buscar por nome, WhatsApp..."
          onChange={handleBusca}
        />

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {(["todos", "vip", "novos", "inativos"] as Filtro[]).map((f) => (
            <FilterPill
              key={f}
              label={f === "todos" ? "Todos" : f === "vip" ? "VIP" : f === "novos" ? "Novos" : "Inativos"}
              ativo={filtro === f}
              onClick={() => setFiltro(f)}
            />
          ))}
        </div>

        {/* Lista */}
        {isLoading ? (
          <LoadingState mensagem="Carregando clientes..." />
        ) : !clientes?.length ? (
          <EmptyState
            icone="people"
            titulo="Nenhum cliente encontrado"
            descricao={
              busca
                ? "Nenhum cliente corresponde à busca."
                : "Adicione seus primeiros clientes."
            }
            ctaLabel={busca ? undefined : "Adicionar Cliente"}
          />
        ) : (
          <div className="space-y-2">
            {clientes.map((cliente) => (
              <ClientCard
                key={cliente.id}
                nome={cliente.nome}
                whatsapp={cliente.whatsapp}
                vip={cliente.vip}
                totalVisitas={cliente.metricas?.totalVisitas}
                onClick={() => router.push(`/clientes/${cliente.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      <Fab icone="person_add" label="Novo Cliente" />
    </div>
  );
}
