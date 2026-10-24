import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/index";

interface AuthState {
  token: string | null;
  user: User | null;
  setSession: (token: string, user: User) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      // The new key prevents old demo tokens from being restored as real sessions.
      name: "itelect4-auth-v2",
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);
export default useAuthStore;
