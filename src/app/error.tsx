"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-light dark:bg-background-dark">
      <div className="max-w-md px-4 text-center">
        <span className="material-icons-round text-5xl text-red-500">
          error_outline
        </span>
        <h2 className="mt-4 text-lg font-semibold text-foreground">
          Algo deu errado
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Ocorreu um erro inesperado. Tente novamente ou entre em contato com o
          suporte.
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
