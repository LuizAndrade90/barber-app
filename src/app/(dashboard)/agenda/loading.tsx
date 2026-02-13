export default function AgendaLoading() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="sticky top-0 z-10 border-b border-border bg-surface-light/80 px-4 py-3 backdrop-blur-xl dark:bg-surface-dark/80">
        <div className="h-6 w-32 rounded bg-muted" />
        <div className="mt-1 h-4 w-48 rounded bg-muted" />
      </div>

      <div className="p-4 md:p-6 space-y-4">
        {/* Week selector skeleton */}
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex h-16 w-12 flex-shrink-0 flex-col items-center justify-center rounded-2xl bg-muted"
            />
          ))}
        </div>

        {/* Stat cards skeleton */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-2xl border border-border bg-surface-light dark:bg-surface-dark"
            />
          ))}
        </div>

        {/* Timeline skeleton */}
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-2xl border border-border bg-surface-light dark:bg-surface-dark"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
