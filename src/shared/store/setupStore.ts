import { create } from "zustand";
import {
  SetupStatus,
  HealthStatus,
  DatabaseConfig,
} from "@/entities/database/model";

interface SetupStore {
  // State
  status: SetupStatus | null;
  health: HealthStatus | null;
  examples: Record<string, DatabaseConfig> | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setStatus: (status: SetupStatus) => void;
  setHealth: (health: HealthStatus) => void;
  setExamples: (examples: Record<string, DatabaseConfig>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Reset
  reset: () => void;
}

export const useSetupStore = create<SetupStore>((set) => ({
  // Initial state
  status: null,
  health: null,
  examples: null,
  isLoading: false,
  error: null,

  // Actions
  setStatus: (status) => set({ status }),
  setHealth: (health) => set({ health }),
  setExamples: (examples) => set({ examples }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Reset
  reset: () =>
    set({
      status: null,
      health: null,
      examples: null,
      isLoading: false,
      error: null,
    }),
}));
