import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DatabaseSetupStatus,
  DatabaseHealthStatus,
} from "@/entities/database/model";

interface SetupStore {
  isSetupCompleted: boolean;
  rootAccountExists: boolean;
  databaseSetupStatus: DatabaseSetupStatus | null;
  databaseHealthStatus: DatabaseHealthStatus | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setIsSetupCompleted: (isSetupCompleted: boolean) => void;
  setRootAccountExists: (rootAccountExists: boolean) => void;
  setDatabaseSetupStatus: (status: DatabaseSetupStatus) => void;
  setDatabaseHealthStatus: (health: DatabaseHealthStatus) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Reset
  reset: () => void;
}

export const useSetupStore = create<SetupStore>()(
  persist(
    (set, get) => ({
      isSetupCompleted: false,
      rootAccountExists: false,
      databaseSetupStatus: null,
      databaseHealthStatus: null,
      isLoading: false,
      error: null,

      setIsSetupCompleted: (isSetupCompleted) => set({ isSetupCompleted }),
      setRootAccountExists: (rootAccountExists) => set({ rootAccountExists }),
      setDatabaseSetupStatus: (status) => set({ databaseSetupStatus: status }),
      setDatabaseHealthStatus: (health) =>
        set({ databaseHealthStatus: health }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      reset: () =>
        set({
          isSetupCompleted: false,
          rootAccountExists: false,
          databaseSetupStatus: null,
          databaseHealthStatus: null,
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: "setup",
      partialize: (state) => ({
        isSetupCompleted: state.isSetupCompleted,
        databaseSetupStatus: state.databaseSetupStatus,
        rootAccountExists: state.rootAccountExists,
      }),
    }
  )
);
