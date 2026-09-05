import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  isDarkMode: boolean;
  searchTerm: string;
  toggleDarkMode: () => void;
  setSearchTerm: (term: string) => void;
}

const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      searchTerm: "",
      toggleDarkMode: () =>
        set((state) => ({ isDarkMode: !state.isDarkMode })),
      setSearchTerm: (term) => set({ searchTerm: term }),
    }),
    {
      name: "itelect4-ui",
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    },
  ),
);

export default useUiStore;
