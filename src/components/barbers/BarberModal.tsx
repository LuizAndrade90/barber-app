"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";

interface BarberModalProps {
  aberto: boolean;
  onFechar: () => void;
  onCriado?: () => void;
}

const CORES_CALENDARIO = [
  "#25d466",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
];

export function BarberModal({ aberto, onFechar, onCriado }: BarberModalProps) {
  const [nome, setNome] = useState("");
  const [apelido, setApelido] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [corCalendario, setCorCalendario] = useState(CORES_CALENDARIO[0]);
  const [especialidades, setEspecialidades] = useState("");
  const [comissao, setComissao] = useState("");

  const utils = trpc.useUtils();
  const createMutation = trpc.barbers.create.useMutation({
    onSuccess: () => {
      utils.barbers.list.invalidate();
      onCriado?.();
      resetar();
      onFechar();
    },
  });

  const resetar = () => {
    setNome("");
    setApelido("");
    setTelefone("");
    setEmail("");
    setCorCalendario(CORES_CALENDARIO[0]);
    setEspecialidades("");
    setComissao("");
  };

  const handleSubmit = () => {
    if (!nome.trim()) return;

    const specs = especialidades
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    createMutation.mutate({
      nome: nome.trim(),
      apelido: apelido.trim() || undefined,
      telefone: telefone.trim() || undefined,
      email: email.trim() || undefined,
      corCalendario,
      especialidades: specs.length > 0 ? specs : undefined,
      comissao: comissao ? Number(comissao) : undefined,
    });
  };

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm"
        onClick={onFechar}
      />

      {/* Modal */}
      <main className="relative z-10 flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border border-neutral-100 bg-white shadow-2xl dark:border-neutral-700/30 dark:bg-[#1a2c20] md:rounded-2xl">
        {/* Header */}
        <header className="flex-none bg-white px-6 pb-2 pt-4 dark:bg-[#1a2c20]">
          {/* Handle Bar */}
          <div className="mx-auto mb-6 h-1.5 w-12 cursor-grab rounded-full bg-neutral-200 active:cursor-grabbing dark:bg-neutral-700 md:hidden" />
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Novo Barbeiro
            </h3>
            <button
              onClick={onFechar}
              className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
            >
              <span className="material-icons-round text-xl">close</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 pb-24">
          {/* Nome */}
          <section className="space-y-1.5">
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Nome *
            </label>
            <div className="group relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-primary">
                <span className="material-icons-round text-lg">person_outline</span>
              </span>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome completo"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-10 pr-4 text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white sm:text-sm"
              />
            </div>
          </section>

          {/* Apelido */}
          <section className="space-y-1.5">
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Apelido
            </label>
            <div className="group relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-primary">
                <span className="material-icons-round text-lg">badge</span>
              </span>
              <input
                type="text"
                value={apelido}
                onChange={(e) => setApelido(e.target.value)}
                placeholder="Como ele e conhecido"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-10 pr-4 text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white sm:text-sm"
              />
            </div>
          </section>

          {/* Telefone + Comissao */}
          <div className="grid grid-cols-2 gap-3">
            <section className="space-y-1.5">
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Telefone
              </label>
              <div className="group relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-primary">
                  <span className="material-icons-round text-lg">phone</span>
                </span>
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-10 pr-4 text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white sm:text-sm"
                />
              </div>
            </section>

            <section className="space-y-1.5">
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Comissao (%)
              </label>
              <div className="group relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-primary">
                  <span className="material-icons-round text-lg">percent</span>
                </span>
                <input
                  type="number"
                  value={comissao}
                  onChange={(e) => setComissao(e.target.value)}
                  placeholder="0"
                  min={0}
                  max={100}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-10 pr-4 text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white sm:text-sm"
                />
              </div>
            </section>
          </div>

          {/* E-mail */}
          <section className="space-y-1.5">
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              E-mail
            </label>
            <div className="group relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-primary">
                <span className="material-icons-round text-lg">mail_outline</span>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-10 pr-4 text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white sm:text-sm"
              />
            </div>
          </section>

          {/* Especialidades */}
          <section className="space-y-1.5">
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Especialidades
            </label>
            <div className="group relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-primary">
                <span className="material-icons-round text-lg">content_cut</span>
              </span>
              <input
                type="text"
                value={especialidades}
                onChange={(e) => setEspecialidades(e.target.value)}
                placeholder="Barba, degrade, pigmentacao (separar por virgula)"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-10 pr-4 text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white sm:text-sm"
              />
            </div>
          </section>

          {/* Cor no Calendario */}
          <section className="space-y-3">
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Cor no calendario
            </label>
            <div className="flex gap-3">
              {CORES_CALENDARIO.map((cor) => (
                <button
                  key={cor}
                  type="button"
                  onClick={() => setCorCalendario(cor)}
                  className="relative h-9 w-9 rounded-full transition-transform active:scale-95"
                  style={{ backgroundColor: cor }}
                >
                  {corCalendario === cor && (
                    <span className="material-icons-round absolute inset-0 flex items-center justify-center text-sm text-white">
                      check
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {createMutation.error && (
            <p className="text-xs text-red-500">
              Erro ao criar barbeiro. Tente novamente.
            </p>
          )}
        </div>

        {/* Sticky Footer */}
        <footer className="absolute bottom-0 left-0 right-0 z-30 border-t border-neutral-100 bg-white p-6 pb-8 dark:border-neutral-700/50 dark:bg-[#1a2c20] md:pb-6">
          <button
            onClick={handleSubmit}
            disabled={!nome.trim() || createMutation.isPending}
            className="flex w-full transform items-center justify-center gap-2 rounded-xl bg-primary py-4 text-lg font-bold text-white shadow-lg shadow-primary/30 transition-all active:scale-[0.98] hover:bg-green-500 disabled:opacity-50"
          >
            <span>
              {createMutation.isPending ? "Salvando..." : "Adicionar Barbeiro"}
            </span>
            <span className="material-icons-round text-xl">arrow_forward</span>
          </button>
        </footer>
      </main>
    </div>
  );
}
