import { Header } from "@/components/layout/Header";

export default function RelatoriosPage() {
  return (
    <div>
      <Header titulo="Relatórios" subtitulo="Acompanhe o desempenho" />
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-border p-12">
          <div className="text-center">
            <span className="material-icons-round text-4xl text-muted-foreground">
              bar_chart
            </span>
            <p className="mt-2 text-sm text-muted-foreground">
              Relatórios serão implementados na FASE 10
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
