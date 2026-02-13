"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { AvatarIniciais } from "@/components/ui/avatar-initials";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Fab } from "@/components/ui/fab";
import { trpc } from "@/lib/trpc/client";

export default function EquipePage() {
  const [dialogAberto, setDialogAberto] = useState(false);
  const { data: barbeiros, isLoading } = trpc.barbers.list.useQuery();

  return (
    <div>
      <Header titulo="Equipe" subtitulo="Gerencie seus barbeiros" />

      <div className="p-4 md:p-6">
        {isLoading ? (
          <LoadingState mensagem="Carregando equipe..." />
        ) : !barbeiros?.length ? (
          <EmptyState
            icone="groups"
            titulo="Nenhum barbeiro cadastrado"
            descricao="Adicione os barbeiros da sua equipe."
            ctaLabel="Adicionar Barbeiro"
            onCta={() => setDialogAberto(true)}
          />
        ) : (
          <div className="space-y-3">
            {barbeiros.map((barbeiro, i) => (
              <div
                key={barbeiro.id}
                className="flex items-center gap-4 rounded-2xl border border-border bg-surface-light p-4 transition-colors hover:bg-accent dark:bg-surface-dark"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-white font-semibold"
                  style={{ backgroundColor: barbeiro.corCalendario }}
                >
                  {barbeiro.nome
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {barbeiro.nome}
                    </p>
                    {!barbeiro.ativo && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        Inativo
                      </span>
                    )}
                  </div>
                  {barbeiro.especialidades && barbeiro.especialidades.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {barbeiro.especialidades.join(", ")}
                    </p>
                  )}
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{barbeiro.totalAtendimentos} atendimentos</span>
                    {barbeiro.comissao != null && barbeiro.comissao > 0 && (
                      <span>Comissão: {barbeiro.comissao}%</span>
                    )}
                  </div>
                </div>

                <span className="material-icons-round text-muted-foreground">
                  chevron_right
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Fab
        icone="person_add"
        label="Novo Barbeiro"
        onClick={() => setDialogAberto(true)}
      />
    </div>
  );
}
