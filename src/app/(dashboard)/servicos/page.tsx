"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { ServiceCard } from "@/components/ui/service-card";
import { EmptyState } from "@/components/shared/EmptyState";
import { Fab } from "@/components/ui/fab";
import { trpc } from "@/lib/trpc/client";
import { LoadingState } from "@/components/shared/LoadingState";

export default function ServicosPage() {
  const [dialogAberto, setDialogAberto] = useState(false);
  const { data: servicos, isLoading } = trpc.services.list.useQuery();

  return (
    <div>
      <Header titulo="Serviços" subtitulo="Gerencie seus serviços" />

      <div className="p-4 md:p-6">
        {isLoading ? (
          <LoadingState mensagem="Carregando serviços..." />
        ) : !servicos?.length ? (
          <EmptyState
            icone="content_cut"
            titulo="Nenhum serviço cadastrado"
            descricao="Adicione seus serviços para que clientes possam agendar."
            ctaLabel="Adicionar Serviço"
            onCta={() => setDialogAberto(true)}
          />
        ) : (
          <div className="space-y-3">
            {servicos.map((servico) => (
              <div
                key={servico.id}
                className="flex items-center gap-3"
              >
                <div className="flex-1">
                  <ServiceCard
                    nome={servico.nome}
                    descricao={servico.descricao}
                    duracaoMinutos={servico.duracaoMinutos}
                    precoCentavos={servico.precocentavos}
                    icone={servico.icone}
                  />
                </div>
                {!servico.ativo && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    Inativo
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Fab
        icone="add"
        label="Novo Serviço"
        onClick={() => setDialogAberto(true)}
      />
    </div>
  );
}
