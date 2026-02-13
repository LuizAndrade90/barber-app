"use client";

import { useCallback } from "react";
import dynamic from "next/dynamic";
import type { EventInput, EventClickArg } from "@fullcalendar/core";

const FullCalendar = dynamic(
  () =>
    Promise.all([
      import("@fullcalendar/react"),
      import("@fullcalendar/timegrid"),
      import("@fullcalendar/interaction"),
    ]).then(([mod]) => mod.default),
  { ssr: false, loading: () => <div className="h-[600px] animate-pulse rounded-2xl bg-muted" /> }
);

interface CalendarEvent {
  id: string;
  titulo: string;
  inicio: string;
  fim: string;
  cor: string;
  status: string;
}

interface CalendarViewProps {
  eventos: CalendarEvent[];
  dataSelecionada: Date;
  viewMode: "dia" | "semana";
  onEventoClick?: (id: string) => void;
  onDataClick?: (data: Date) => void;
}

export function CalendarView({
  eventos,
  dataSelecionada,
  viewMode,
  onEventoClick,
  onDataClick,
}: CalendarViewProps) {
  const fullCalendarEvents: EventInput[] = eventos.map((e) => ({
    id: e.id,
    title: e.titulo,
    start: e.inicio,
    end: e.fim,
    backgroundColor: e.cor,
    borderColor: e.cor,
    extendedProps: { status: e.status },
  }));

  const handleEventClick = useCallback(
    (info: EventClickArg) => {
      onEventoClick?.(info.event.id);
    },
    [onEventoClick]
  );

  return (
    <div className="rounded-2xl border border-border bg-surface-light p-2 dark:bg-surface-dark [&_.fc]:text-sm [&_.fc-timegrid-slot]:h-12 [&_.fc-col-header-cell]:py-2 [&_.fc-col-header-cell]:text-xs [&_.fc-col-header-cell]:font-medium [&_.fc-col-header-cell]:text-muted-foreground [&_.fc-event]:rounded-lg [&_.fc-event]:border-0 [&_.fc-event]:px-2 [&_.fc-event]:py-1 [&_.fc-event]:text-xs [&_.fc-event]:font-medium [&_.fc-timegrid-axis]:text-xs [&_.fc-timegrid-axis]:text-muted-foreground [&_.fc-scrollgrid]:border-0 [&_.fc-scrollgrid td]:border-border [&_.fc-scrollgrid th]:border-border [&_table]:border-border [&_.fc-toolbar]:hidden">
      <FullCalendar
        initialView={viewMode === "dia" ? "timeGridDay" : "timeGridWeek"}
        initialDate={dataSelecionada}
        events={fullCalendarEvents}
        eventClick={handleEventClick}
        headerToolbar={false}
        slotMinTime="07:00:00"
        slotMaxTime="22:00:00"
        slotDuration="00:30:00"
        allDaySlot={false}
        nowIndicator
        locale="pt-br"
        height="auto"
      />
    </div>
  );
}
