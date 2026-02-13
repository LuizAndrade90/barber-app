import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-light dark:bg-background-dark">
      <div className="max-w-md px-4 text-center">
        <span className="material-icons-round text-5xl text-muted-foreground">
          search_off
        </span>
        <h2 className="mt-4 text-lg font-semibold text-foreground">
          Página não encontrada
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi removida.
        </p>
        <Link
          href="/agenda"
          className="mt-6 inline-block rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Ir para a Agenda
        </Link>
      </div>
    </div>
  );
}
