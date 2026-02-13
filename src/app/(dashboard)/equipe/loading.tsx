export default function EquipeLoading() {
  return (
    <div className="animate-pulse">
      <div className="sticky top-0 z-10 border-b border-border bg-surface-light/80 px-4 py-3 backdrop-blur-xl dark:bg-surface-dark/80">
        <div className="h-6 w-24 rounded bg-muted" />
        <div className="mt-1 h-4 w-40 rounded bg-muted" />
      </div>

      <div className="p-4 md:p-6 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-2xl border border-border bg-surface-light p-4 dark:bg-surface-dark"
          >
            <div className="h-12 w-12 rounded-full bg-muted" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="h-3 w-48 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
