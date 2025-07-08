"use client";

import { useState, useEffect, useCallback } from "react";
import { errorHandler } from "@/shared/lib/errorHandler";

interface UseAsyncDataState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  isRefetching: boolean;
}

interface UseAsyncDataOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  showToast?: boolean; // toast 표시 여부
  errorContext?: string; // 에러 컨텍스트
}

export function useAsyncData<T>(
  asyncFn: () => Promise<T>,
  deps: React.DependencyList = [],
  options: UseAsyncDataOptions<T> = {}
) {
  const [state, setState] = useState<UseAsyncDataState<T>>({
    data: options.initialData || null,
    error: null,
    isLoading: true,
    isRefetching: false,
  });

  const execute = useCallback(async (isRefetch = false) => {
    setState((prev) => ({
      ...prev,
      isLoading: !isRefetch,
      isRefetching: isRefetch,
      error: null,
    }));

    try {
      const result = await asyncFn();
      setState({
        data: result,
        error: null,
        isLoading: false,
        isRefetching: false,
      });
      options.onSuccess?.(result);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setState({
        data: null,
        error: errorMessage,
        isLoading: false,
        isRefetching: false,
      });

      // ✅ toast로 에러 표시 (throw하지 않음)
      if (options.showToast !== false) {
        errorHandler.general(error, options.errorContext);
      }

      throw error;
    }
  }, deps);

  const refetch = useCallback(() => execute(true), [execute]);

  useEffect(() => {
    execute();
  }, [execute]);

  return {
    ...state,
    refetch,
  };
}
