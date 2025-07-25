import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";
import { logoutApi } from "../api/logout";
import { errorHandler } from "../lib/errorHandler";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: async () => {
        try {
          await logoutApi();
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          errorHandler.general(error, "Logout");
        }
      },
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },
    }),
    {
      name: "sentinel-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
