export default function RelatoriosLoading() {
  return (
    <div className="animate-pulse">
      <div className="sticky top-0 z-10 border-b border-border bg-surface-light/80 px-4 py-3 backdrop-blur-xl dark:bg-surface-dark/80">
        <div className="h-6 w-32 rounded bg-muted" />
        <div className="mt-1 h-4 w-44 rounded bg-muted" />
      </div>

      <div className="p-4 md:p-6 space-y-4">
        {/* Period selector */}
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 w-28 rounded-full bg-muted" />
          ))}
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl border border-border bg-surface-light dark:bg-surface-dark"
            />
          ))}
        </div>

        {/* Chart skeletons */}
        <div className="h-72 rounded-2xl border border-border bg-surface-light dark:bg-surface-dark" />
        <div className="h-72 rounded-2xl border border-border bg-surface-light dark:bg-surface-dark" />
      </div>
    </div>
  );
}
