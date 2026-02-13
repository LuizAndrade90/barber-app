export default function ClienteDetalheLoading() {
  return (
    <div className="animate-pulse">
      <div className="sticky top-0 z-10 border-b border-border bg-surface-light/80 px-4 py-3 backdrop-blur-xl dark:bg-surface-dark/80">
        <div className="h-6 w-40 rounded bg-muted" />
      </div>

      <div className="p-4 md:p-6 space-y-4">
        {/* Profile header */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-5 w-36 rounded bg-muted" />
            <div className="h-4 w-28 rounded bg-muted" />
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-2xl border border-border bg-surface-light dark:bg-surface-dark"
            />
          ))}
        </div>

        {/* History */}
        <div className="space-y-2">
          <div className="h-5 w-24 rounded bg-muted" />
          {Array.from({ length: 5 }).map((_, i) => (
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
