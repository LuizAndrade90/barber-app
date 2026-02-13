import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarAberta: boolean;
  darkMode: boolean;
  menuMobileAberto: boolean;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  toggleMenuMobile: () => void;
  fecharMenuMobile: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarAberta: true,
      darkMode: false,
      menuMobileAberto: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarAberta: !state.sidebarAberta })),
      toggleDarkMode: () =>
        set((state) => {
          const novo = !state.darkMode;
          if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("dark", novo);
          }
          return { darkMode: novo };
        }),
      toggleMenuMobile: () =>
        set((state) => ({ menuMobileAberto: !state.menuMobileAberto })),
      fecharMenuMobile: () => set({ menuMobileAberto: false }),
    }),
    {
      name: "agendabarber-ui",
      partialize: (state) => ({
        sidebarAberta: state.sidebarAberta,
        darkMode: state.darkMode,
      }),
    }
  )
);
