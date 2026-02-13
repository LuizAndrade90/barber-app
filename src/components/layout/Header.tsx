"use client";

interface HeaderProps {
  titulo: string;
  subtitulo?: string;
  children?: React.ReactNode;
}

export function Header({ titulo, subtitulo, children }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface-light/80 backdrop-blur-md dark:bg-surface-dark/80">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div>
          <h1 className="text-lg font-semibold text-foreground">{titulo}</h1>
          {subtitulo && (
            <p className="text-sm text-muted-foreground">{subtitulo}</p>
          )}
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </header>
  );
}
