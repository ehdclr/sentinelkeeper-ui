"use client";

import { useAsyncData } from "@/shared/hooks/useAsyncData";
import { safeApiFetch } from "@/shared/api/client";
import { useSetupStore } from "@/shared/store/setupStore";
import { DatabaseSetupStatus, DatabaseHealthStatus } from "@/entities/database/model";

export function useStatus() {
  const { setDatabaseSetupStatus, setDatabaseHealthStatus } = useSetupStore();

  const {
    data: statusResult,
    error: statusError,
    isLoading: statusLoading,
    refetch: refetchStatus,
  } = useAsyncData(() => safeApiFetch("/setup/status", {}, false), [], {
    showToast: false,
    onSuccess: (result) => {
      if (result.success) {
        setDatabaseSetupStatus(result.data as DatabaseSetupStatus);
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
        setDatabaseHealthStatus(result.data as DatabaseHealthStatus);
      }
    },
  });

  const refresh = () => {
    refetchStatus();
    refetchHealth();
  };

  return {
    status: statusResult?.success ? (statusResult.data as DatabaseSetupStatus) : null,
    health: healthResult?.success ? (healthResult.data as DatabaseHealthStatus) : null,
    isLoading: statusLoading || healthLoading,
    error: statusError,
    refresh,
  };
}
