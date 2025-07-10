import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DatabaseSetupStatus,
  DatabaseHealthStatus,
  RootAccountStatus,
} from "@/entities/setup/model";

interface SetupStore {
  // 실제 API 상태
  databaseSetupStatus: DatabaseSetupStatus | null;
  rootAccountStatus: RootAccountStatus | null;
  databaseHealthStatus: DatabaseHealthStatus | null;
  
  // UI 상태
  isLoading: boolean;
  error: string | null;

  // Actions
  setDatabaseSetupStatus: (status: DatabaseSetupStatus) => void;
  setRootAccountStatus: (status: RootAccountStatus) => void;
  setDatabaseHealthStatus: (health: DatabaseHealthStatus) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Reset
  reset: () => void;
}

export const useSetupStore = create<SetupStore>()(
  persist(
    (set) => ({
      // 실제 API 상태
      databaseSetupStatus: null,
      rootAccountStatus: null,
      databaseHealthStatus: null,
      
      // UI 상태
      isLoading: false,
      error: null,

      // Actions
      setDatabaseSetupStatus: (status) => set({ databaseSetupStatus: status }),
      setRootAccountStatus: (status) => set({ rootAccountStatus: status }),
      setDatabaseHealthStatus: (health) => set({ databaseHealthStatus: health }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      reset: () =>
        set({
          databaseSetupStatus: null,
          rootAccountStatus: null,
          databaseHealthStatus: null,
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: "setup",
      partialize: (state) => ({
        databaseSetupStatus: state.databaseSetupStatus,
        rootAccountStatus: state.rootAccountStatus,
      }),
    }
  )
);
