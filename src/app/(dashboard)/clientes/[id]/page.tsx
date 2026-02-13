import { Header } from "@/components/layout/Header";

export default function ClienteDetalhePage() {
  return (
    <div>
      <Header titulo="Detalhe do Cliente" />
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-border p-12">
          <div className="text-center">
            <span className="material-icons-round text-4xl text-muted-foreground">
              person
            </span>
            <p className="mt-2 text-sm text-muted-foreground">
              Detalhe do cliente será implementado na FASE 7
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
