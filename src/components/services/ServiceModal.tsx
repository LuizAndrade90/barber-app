"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";

interface ServiceModalProps {
  aberto: boolean;
  onFechar: () => void;
  onCriado?: () => void;
}

const DURACOES = [15, 30, 45, 60, 90, 120];

export function ServiceModal({
  aberto,
  onFechar,
  onCriado,
}: ServiceModalProps) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [duracaoMinutos, setDuracaoMinutos] = useState("30");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");

  const utils = trpc.useUtils();
  const createMutation = trpc.services.create.useMutation({
    onSuccess: () => {
      utils.services.list.invalidate();
      onCriado?.();
      resetar();
      onFechar();
    },
  });

  const resetar = () => {
    setNome("");
    setDescricao("");
    setDuracaoMinutos("30");
    setPreco("");
    setCategoria("");
  };

  const handleSubmit = () => {
    if (!nome.trim() || !duracaoMinutos || !preco) return;

    // Converter reais para centavos (ex: "35.50" -> 3550)
    const precoCentavos = Math.round(parseFloat(preco) * 100);
    if (isNaN(precoCentavos) || precoCentavos < 0) return;

    createMutation.mutate({
      nome: nome.trim(),
      descricao: descricao.trim() || undefined,
      duracaoMinutos: parseInt(duracaoMinutos),
      precoCentavos,
      categoria: categoria.trim() || undefined,
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
              Novo Servico
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
              Nome do servico *
            </label>
            <div className="group relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-primary">
                <span className="material-icons-round text-lg">content_cut</span>
              </span>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Corte masculino"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-10 pr-4 text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white sm:text-sm"
              />
            </div>
          </section>

          {/* Descricao */}
          <section className="space-y-1.5">
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Descricao
            </label>
            <div className="group relative">
              <span className="absolute left-3 top-3 text-neutral-400 transition-colors group-focus-within:text-primary">
                <span className="material-icons-round text-lg">notes</span>
              </span>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descricao breve do servico..."
                rows={2}
                className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-10 pr-4 text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white sm:text-sm"
              />
            </div>
          </section>

          {/* Duracao */}
          <section className="space-y-3">
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Duracao *
            </label>
            <div className="flex flex-wrap gap-2">
              {DURACOES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuracaoMinutos(String(d))}
                  className={`flex items-center gap-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                    duracaoMinutos === String(d)
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-neutral-200 text-neutral-500 hover:border-primary/50 dark:border-neutral-700 dark:text-neutral-400"
                  }`}
                >
                  <span className="material-icons-round text-base">schedule</span>
                  {d} min
                </button>
              ))}
            </div>
          </section>

          {/* Preco */}
          <section className="space-y-1.5">
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Preco (R$) *
            </label>
            <div className="group relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-primary">
                <span className="material-icons-round text-lg">payments</span>
              </span>
              <input
                type="number"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="0,00"
                min={0}
                step="0.01"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-10 pr-4 text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white sm:text-sm"
              />
            </div>
          </section>

          {/* Categoria */}
          <section className="space-y-1.5">
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Categoria
            </label>
            <div className="group relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-primary">
                <span className="material-icons-round text-lg">category</span>
              </span>
              <input
                type="text"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                placeholder="Ex: Cabelo, Barba, Combo"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-10 pr-4 text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-transparent focus:ring-2 focus:ring-primary dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-white sm:text-sm"
              />
            </div>
          </section>

          {createMutation.error && (
            <p className="text-xs text-red-500">
              Erro ao criar servico. Tente novamente.
            </p>
          )}
        </div>

        {/* Sticky Footer */}
        <footer className="absolute bottom-0 left-0 right-0 z-30 border-t border-neutral-100 bg-white p-6 pb-8 dark:border-neutral-700/50 dark:bg-[#1a2c20] md:pb-6">
          <button
            onClick={handleSubmit}
            disabled={
              !nome.trim() ||
              !duracaoMinutos ||
              !preco ||
              createMutation.isPending
            }
            className="flex w-full transform items-center justify-center gap-2 rounded-xl bg-primary py-4 text-lg font-bold text-white shadow-lg shadow-primary/30 transition-all active:scale-[0.98] hover:bg-green-500 disabled:opacity-50"
          >
            <span>
              {createMutation.isPending ? "Salvando..." : "Adicionar Servico"}
            </span>
            <span className="material-icons-round text-xl">arrow_forward</span>
          </button>
        </footer>
      </main>
    </div>
  );
}
