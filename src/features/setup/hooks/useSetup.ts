// src/features/status/hooks/useStatus.ts
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/shared/api/client";
import { useSetupStore } from "@/shared/store/setupStore";
import { DatabaseSetupStatus } from "@/entities/setup/model";
import { useEffect } from "react";

// Query Keys
export const setupKeys = {
  all: ["setup"] as const,
  database: () => [...setupKeys.all, "db"] as const,
  rootAccount: () => [...setupKeys.all, "root"] as const,
};

// API Functions
const fetchDatabaseStatus = async (): Promise<DatabaseSetupStatus> => {
  const response = await apiFetch("/setup/status/db");
  // 실제 데이터만 반환
  return (response as any)?.databaseSetupStatus ?? response;
};

const fetchRootAccountStatus = async (): Promise<boolean> => {
  try {
    const response = await apiFetch("/setup/status/root");
    // null이나 undefined 응답 처리
    if (!response) {
      console.warn("Root account status response is null/undefined, using default");
      return false;
    }

    return (response as any)?.rootAccountStatus ?? false;
  } catch (error) {
    console.warn("Failed to fetch root account status, using default:", error);
    return false;
  }
};

export function useSetup() {
  const {
    setDatabaseSetupStatus,
    setRootAccountStatus,
    databaseSetupStatus,
    rootAccountStatus,
  } = useSetupStore();

  const queryClient = useQueryClient();

  const {
    data: dbStatus,
    error: dbError,
    isLoading: setupLoading,
    refetch: refetchSetup,
  } = useQuery({
    queryKey: setupKeys.database(),
    queryFn: fetchDatabaseStatus,
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 2,
    retryDelay: 1000,
  });

  // Store 상태 변화 감지
  useEffect(() => {
    setDatabaseSetupStatus(dbStatus as DatabaseSetupStatus);
  }, [dbStatus, setDatabaseSetupStatus]);

  useEffect(() => {
    if (dbError) {
      console.error("Failed to fetch database status:", dbError);
      setDatabaseSetupStatus({
        configured: false,
        locked: false,
        type: null,
        createdAt: null,
        configExists: false,
        lockExists: false,
      });
    }
  }, [dbError, setDatabaseSetupStatus]);

  const {
    data: rootStatus,
    error: rootAccountError,
    isLoading: rootAccountLoading,
    refetch: refetchRootAccount,
  } = useQuery({
    queryKey: setupKeys.rootAccount(),
    queryFn: fetchRootAccountStatus,
    staleTime: 10000,
    refetchInterval: 30000,
    retry: 2,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (rootStatus) {
      setRootAccountStatus(rootStatus);
    }
  }, [rootStatus, setRootAccountStatus]);
  
  useEffect(() => {
    if (rootAccountError) {
      console.error("Failed to fetch root account status:", rootAccountError);
      setRootAccountStatus(false);
    }
  }, [rootAccountError, setRootAccountStatus]);

  const refresh = () => {
    refetchSetup();
    refetchRootAccount();
  };

  const invalidateStatus = () => {
    queryClient.invalidateQueries({ queryKey: setupKeys.database() });
    queryClient.invalidateQueries({ queryKey: setupKeys.rootAccount() });
  };
  

  return {
    // Store에서 가져온 상태 (실제 저장된 상태)
    databaseSetupStatus,
    rootAccountStatus,

    // Query 상태
    isLoading: setupLoading || rootAccountLoading,
    error: dbError || rootAccountError,

    // Actions
    refresh,
    invalidateStatus,
  };
}
