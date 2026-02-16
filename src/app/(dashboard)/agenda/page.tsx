"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { WeekSelector } from "@/components/ui/week-selector";
import { Fab } from "@/components/ui/fab";
import { AppointmentModal } from "@/components/appointments/AppointmentModal";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { useCalendarStore } from "@/stores/calendarStore";

const DIAS_SEMANA_CURTO = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES_CURTO = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

function formatDateHeader(date: Date): string {
  const dia = DIAS_SEMANA_CURTO[date.getDay()];
  const num = date.getDate();
  const mes = MESES_CURTO[date.getMonth()];
  return `${dia}, ${num} ${mes}`;
}

export default function AgendaPage() {
  const { data: session } = useSession();
  const { dataSelecionada, setData } = useCalendarStore();
  const [modalAberto, setModalAberto] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState("todos");

  const firstName = session?.user?.name?.split(" ")[0] || "Usuário";
  const userImage = session?.user?.image;

  const filtros = [
    { id: "todos", label: "Todos" },
    { id: "agendados", label: "Agendados" },
    { id: "disponiveis", label: "Disponíveis" },
    { id: "concluidos", label: "Concluídos" },
  ];

  return (
    <div>
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          {/* Mobile avatar */}
          <div className="md:hidden">
            {userImage ? (
              <img
                className="w-12 h-12 rounded-full object-cover border-2 border-primary p-0.5"
                src={userImage}
                alt="Avatar"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold border-2 border-primary p-0.5">
                {firstName[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Olá, {firstName}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Aqui está sua agenda de hoje.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between md:justify-end gap-6 bg-surface-light dark:bg-surface-dark p-3 rounded-xl shadow-sm md:shadow-none md:bg-transparent">
          <button className="md:hidden text-gray-500">
            <span className="material-icons-round">menu</span>
          </button>
          <div className="text-center">
            <span className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <span className="material-icons-round text-primary text-xl">
                event
              </span>
              {formatDateHeader(dataSelecionada)}
            </span>
          </div>
          <div className="relative">
            <NotificationBell />
          </div>
        </div>
      </header>

      {/* Week Selector */}
      <WeekSelector
        dataSelecionada={dataSelecionada}
        onSelectDate={setData}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center md:items-start shadow-sm">
              <div className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium uppercase tracking-wider mb-1">
                Total
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                12
              </div>
              <div className="text-xs text-green-600 font-medium mt-1 flex items-center">
                <span className="material-icons-round text-sm mr-1">
                  trending_up
                </span>
                +2 hoje
              </div>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border-l-4 border-l-primary shadow-soft">
              <div className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium uppercase tracking-wider mb-1">
                Confirmados
              </div>
              <div className="text-2xl md:text-3xl font-bold text-primary">
                8
              </div>
              <div className="text-xs text-gray-400 mt-1">66% do dia</div>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center md:items-start shadow-sm">
              <div className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium uppercase tracking-wider mb-1">
                Pendentes
              </div>
              <div className="text-2xl md:text-3xl font-bold text-orange-500">
                4
              </div>
              <div className="text-xs text-orange-500/80 font-medium mt-1">
                Aguardando ação
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filtros.map((filtro) => (
              <button
                key={filtro.id}
                onClick={() => setFiltroAtivo(filtro.id)}
                className={
                  filtro.id === filtroAtivo
                    ? "px-5 py-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-sm whitespace-nowrap shadow-md"
                    : "px-5 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 font-medium text-sm hover:border-primary hover:text-primary transition-colors whitespace-nowrap"
                }
              >
                {filtro.label}
              </button>
            ))}
          </div>

          {/* Timeline List */}
          <div className="space-y-4">
            {/* Slot 09:00 - Available */}
            <div className="group flex gap-4 items-start">
              <div className="w-16 pt-3 text-right">
                <span className="text-sm font-semibold text-gray-400 group-hover:text-primary transition-colors">
                  09:00
                </span>
              </div>
              <div className="flex-1">
                <button
                  onClick={() => setModalAberto(true)}
                  className="w-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center justify-center gap-2 text-gray-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <span className="material-icons-round text-xl">
                    add_circle_outline
                  </span>
                  <span className="font-medium">Agendar horário</span>
                </button>
              </div>
            </div>

            {/* Slot 10:00 - Scheduled (Confirmed) */}
            <div className="flex gap-4 items-stretch">
              <div className="w-16 pt-6 text-right relative">
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  10:00
                </span>
                <div className="absolute right-[-21px] top-8 w-3 h-3 bg-primary rounded-full border-2 border-background-light dark:border-background-dark z-10" />
                <div className="absolute right-[-17px] top-10 h-full w-0.5 bg-gray-200 dark:bg-gray-800" />
              </div>
              <div className="flex-1 bg-surface-light dark:bg-surface-dark rounded-xl p-4 md:p-5 shadow-soft border-l-4 border-l-primary flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                    CS
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      Carlos Silva
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      <span className="material-icons-round text-sm">cut</span>
                      <span>Corte + Barba</span>
                      <span className="text-gray-300">&bull;</span>
                      <span>45 min</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-gray-100 dark:border-gray-800 pt-3 md:pt-0 mt-2 md:mt-0">
                  <div className="text-right mr-4">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                      R$ 65,00
                    </span>
                    <span className="text-xs text-gray-400">Pix</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary/20 text-primary-dark dark:text-primary text-xs font-bold uppercase tracking-wide">
                    Confirmado
                  </span>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <span className="material-icons-round">more_vert</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Slot 11:00 - Scheduled (Pending) */}
            <div className="flex gap-4 items-stretch opacity-90">
              <div className="w-16 pt-6 text-right relative">
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                  11:00
                </span>
                <div className="absolute right-[-21px] top-8 w-3 h-3 bg-orange-400 rounded-full border-2 border-background-light dark:border-background-dark z-10" />
                <div className="absolute right-[-17px] top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-800" />
              </div>
              <div className="flex-1 bg-surface-light dark:bg-surface-dark rounded-xl p-4 md:p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg">
                    PS
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      Pedro Santos
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      <span className="material-icons-round text-sm">
                        content_cut
                      </span>
                      <span>Corte Navalhado</span>
                      <span className="text-gray-300">&bull;</span>
                      <span>30 min</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-gray-100 dark:border-gray-800 pt-3 md:pt-0 mt-2 md:mt-0">
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs font-bold uppercase tracking-wide">
                    Pendente
                  </span>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
                      <span className="material-icons-round text-sm">
                        check
                      </span>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                      <span className="material-icons-round text-sm">
                        close
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Slot 12:00 - Blocked (Lunch) */}
            <div className="flex gap-4 items-center">
              <div className="w-16 text-right">
                <span className="text-sm font-medium text-gray-400">
                  12:00
                </span>
              </div>
              <div className="flex-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl p-3 flex items-center justify-center gap-2 text-gray-400 border border-gray-200 dark:border-gray-700/50">
                <span className="material-icons-round text-lg">
                  restaurant
                </span>
                <span className="font-medium text-sm">Almoço (Pausa)</span>
              </div>
            </div>

            {/* Slot 13:00 - Available */}
            <div className="group flex gap-4 items-start">
              <div className="w-16 pt-3 text-right">
                <span className="text-sm font-semibold text-gray-400 group-hover:text-primary transition-colors">
                  13:00
                </span>
              </div>
              <div className="flex-1">
                <button
                  onClick={() => setModalAberto(true)}
                  className="w-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center justify-center gap-2 text-gray-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <span className="material-icons-round text-xl">
                    add_circle_outline
                  </span>
                  <span className="font-medium">Agendar horário</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <Fab icone="add" onClick={() => setModalAberto(true)} />

      <AppointmentModal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
      />
    </div>
  );
}
