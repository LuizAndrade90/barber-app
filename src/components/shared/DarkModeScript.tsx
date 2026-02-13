"use client";

export function DarkModeScript() {
  const script = `
    try {
      const stored = JSON.parse(localStorage.getItem('agendabarber-ui') || '{}');
      if (stored.state && stored.state.darkMode) {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {}
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
