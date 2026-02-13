"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";

interface ClientModalProps {
  aberto: boolean;
  onFechar: () => void;
  onCriado?: () => void;
}

export function ClientModal({ aberto, onFechar, onCriado }: ClientModalProps) {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const utils = trpc.useUtils();
  const createMutation = trpc.clients.create.useMutation({
    onSuccess: () => {
      utils.clients.list.invalidate();
      onCriado?.();
      resetar();
      onFechar();
    },
  });

  const resetar = () => {
    setNome("");
    setWhatsapp("");
    setTelefone("");
    setEmail("");
    setObservacoes("");
  };

  const handleSubmit = () => {
    if (!nome.trim()) return;
    createMutation.mutate({
      nome: nome.trim(),
      whatsapp: whatsapp.trim() || undefined,
      telefone: telefone.trim() || undefined,
      email: email.trim() || undefined,
      observacoes: observacoes.trim() || undefined,
      fonte: "manual",
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
              Novo Cliente
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

          {/* WhatsApp */}
          <section className="space-y-1.5">
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              WhatsApp
            </label>
            <div className="group relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#25D366] transition-colors">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </span>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="(11) 99999-9999"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-10 pr-4 text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white sm:text-sm"
              />
            </div>
          </section>

          {/* Telefone */}
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
                placeholder="(11) 3333-3333"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-10 pr-4 text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white sm:text-sm"
              />
            </div>
          </section>

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

          {/* Observacoes */}
          <section className="space-y-1.5">
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Observacoes
            </label>
            <div className="group relative">
              <span className="absolute left-3 top-3 text-neutral-400 transition-colors group-focus-within:text-primary">
                <span className="material-icons-round text-lg">notes</span>
              </span>
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Notas sobre o cliente..."
                rows={3}
                className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-10 pr-4 text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white sm:text-sm"
              />
            </div>
          </section>

          {createMutation.error && (
            <p className="text-xs text-red-500">
              Erro ao criar cliente. Tente novamente.
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
              {createMutation.isPending ? "Salvando..." : "Adicionar Cliente"}
            </span>
            <span className="material-icons-round text-xl">arrow_forward</span>
          </button>
        </footer>
      </main>
    </div>
  );
}
