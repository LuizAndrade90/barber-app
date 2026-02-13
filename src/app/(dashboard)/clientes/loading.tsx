export default function ClientesLoading() {
  return (
    <div className="animate-pulse">
      <div className="sticky top-0 z-10 border-b border-border bg-surface-light/80 px-4 py-3 backdrop-blur-xl dark:bg-surface-dark/80">
        <div className="h-6 w-28 rounded bg-muted" />
        <div className="mt-1 h-4 w-40 rounded bg-muted" />
      </div>

      <div className="p-4 md:p-6 space-y-4">
        {/* Search skeleton */}
        <div className="h-10 rounded-xl bg-muted" />

        {/* Filter pills */}
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-20 rounded-full bg-muted" />
          ))}
        </div>

        {/* Client cards */}
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-2xl border border-border bg-surface-light p-3 dark:bg-surface-dark"
            >
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-3 w-24 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
