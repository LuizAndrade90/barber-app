import { create } from "zustand";

interface CalendarState {
  dataSelecionada: Date;
  barbeiroFiltradoId: string | null;
  viewMode: "dia" | "semana";
  setData: (data: Date) => void;
  setBarbeiroFiltrado: (id: string | null) => void;
  setViewMode: (mode: "dia" | "semana") => void;
  irParaHoje: () => void;
  irParaDiaAnterior: () => void;
  irParaProximoDia: () => void;
}

export const useCalendarStore = create<CalendarState>()((set) => ({
  dataSelecionada: new Date(),
  barbeiroFiltradoId: null,
  viewMode: "dia",
  setData: (data) => set({ dataSelecionada: data }),
  setBarbeiroFiltrado: (id) => set({ barbeiroFiltradoId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  irParaHoje: () => set({ dataSelecionada: new Date() }),
  irParaDiaAnterior: () =>
    set((state) => {
      const novaData = new Date(state.dataSelecionada);
      novaData.setDate(novaData.getDate() - 1);
      return { dataSelecionada: novaData };
    }),
  irParaProximoDia: () =>
    set((state) => {
      const novaData = new Date(state.dataSelecionada);
      novaData.setDate(novaData.getDate() + 1);
      return { dataSelecionada: novaData };
    }),
}));
