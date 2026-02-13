import { Header } from "@/components/layout/Header";

export default function ServicosPage() {
  return (
    <div>
      <Header titulo="Serviços" subtitulo="Gerencie seus serviços" />
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-border p-12">
          <div className="text-center">
            <span className="material-icons-round text-4xl text-muted-foreground">
              content_cut
            </span>
            <p className="mt-2 text-sm text-muted-foreground">
              Lista de serviços será implementada na FASE 7
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
