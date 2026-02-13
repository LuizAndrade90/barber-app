import { Header } from "@/components/layout/Header";

export default function AgendaPage() {
  return (
    <div>
      <Header
        titulo="Agenda"
        subtitulo="Gerencie seus agendamentos"
      />
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-border p-12">
          <div className="text-center">
            <span className="material-icons-round text-4xl text-muted-foreground">
              calendar_today
            </span>
            <p className="mt-2 text-sm text-muted-foreground">
              Calendário será implementado na FASE 6
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
