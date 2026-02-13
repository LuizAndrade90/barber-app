"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { WeekSelector } from "@/components/ui/week-selector";
import { StatCard } from "@/components/ui/stat-card";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { BarberFilter } from "@/components/calendar/BarberFilter";
import { DayView } from "@/components/calendar/DayView";
import { CalendarView } from "@/components/calendar/CalendarView";
import { Fab } from "@/components/ui/fab";
import { AppointmentModal } from "@/components/appointments/AppointmentModal";
import { useCalendarStore } from "@/stores/calendarStore";
import { UserMenu } from "@/components/layout/UserMenu";
import { NotificationBell } from "@/components/layout/NotificationBell";

// TODO: Substituir por dados reais do tRPC nas proximas fases
const BARBEIROS_MOCK = [
  { id: "1", nome: "João Silva", cor: "#25d466" },
  { id: "2", nome: "Carlos Santos", cor: "#3b82f6" },
];

export default function AgendaPage() {
  const {
    dataSelecionada,
    barbeiroFiltradoId,
    viewMode,
    setData,
    setBarbeiroFiltrado,
    setViewMode,
    irParaHoje,
    irParaDiaAnterior,
    irParaProximoDia,
  } = useCalendarStore();

  const [modalAberto, setModalAberto] = useState(false);

  return (
    <div>
      <Header titulo="Agenda" subtitulo="Gerencie seus agendamentos">
        <NotificationBell />
        <UserMenu />
      </Header>

      <div className="space-y-4 p-4 md:p-6">
        {/* Seletor de semana (mobile) */}
        <div className="md:hidden">
          <WeekSelector
            dataSelecionada={dataSelecionada}
            onSelectDate={setData}
          />
        </div>

        {/* Header do calendário */}
        <CalendarHeader
          dataSelecionada={dataSelecionada}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAnterior={irParaDiaAnterior}
          onProximo={irParaProximoDia}
          onHoje={irParaHoje}
        />

        {/* Filtro de barbeiros */}
        <BarberFilter
          barbeiros={BARBEIROS_MOCK}
          selecionadoId={barbeiroFiltradoId}
          onSelect={setBarbeiroFiltrado}
        />

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard titulo="Total" valor="8" icone="event" />
          <StatCard titulo="Confirmados" valor="5" icone="check_circle" />
          <StatCard titulo="Pendentes" valor="3" icone="pending" />
          <StatCard titulo="Receita" valor="R$ 280" icone="attach_money" />
        </div>

        {/* Visão de dia (mobile) / FullCalendar (desktop) */}
        <div className="md:hidden">
          <DayView agendamentos={[]} />
        </div>
        <div className="hidden md:block">
          <CalendarView
            eventos={[]}
            dataSelecionada={dataSelecionada}
            viewMode={viewMode}
          />
        </div>
      </div>

      {/* FAB Novo Agendamento */}
      <Fab
        icone="add"
        label="Novo"
        onClick={() => setModalAberto(true)}
      />

      <AppointmentModal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
      />
    </div>
  );
}
