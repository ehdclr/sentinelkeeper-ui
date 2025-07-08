"use client";

import { useAsyncData } from "@/shared/hooks/useAsyncData";
import { safeApiFetch } from "@/shared/api/client";
import { useSetupStore } from "@/shared/store/setupStore";
import { HealthStatus, SetupStatus } from "@/entities/database/model";

export function useStatus() {
  const { setStatus, setHealth } = useSetupStore();

  const {
    data: statusResult,
    error: statusError,
    isLoading: statusLoading,
    refetch: refetchStatus,
  } = useAsyncData(() => safeApiFetch("/setup/status", {}, false), [], {
    showToast: false,
    onSuccess: (result) => {
      if (result.success) {
        setStatus(result.data as SetupStatus);
      }
    },
  });

  const {
    data: healthResult,
    isLoading: healthLoading,
    refetch: refetchHealth,
  } = useAsyncData(() => safeApiFetch("/health", {}, false), [], {
    showToast: false,
    onSuccess: (result) => {
      if (result.success) {
        setHealth(result.data as HealthStatus);
      }
    },
  });

  const refresh = () => {
    refetchStatus();
    refetchHealth();
  };

  return {
    status: statusResult?.success ? (statusResult.data as SetupStatus) : null,
    health: healthResult?.success ? (healthResult.data as HealthStatus) : null,
    isLoading: statusLoading || healthLoading,
    error: statusError,
    refresh,
  };
}
