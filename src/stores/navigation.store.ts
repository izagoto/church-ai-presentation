import { create } from "zustand";

export type AppPage =
  | "presentation"
  | "songs"
  | "bible"
  | "history"
  | "settings";

type NavigationStore = {
  activePage: AppPage;
  setActivePage: (page: AppPage) => void;
};

export const useNavigationStore = create<NavigationStore>((set) => ({
  activePage: "presentation",
  setActivePage: (page) => set({ activePage: page }),
}));
