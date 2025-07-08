"use client";

import { toast } from "sonner";
import { useCallback } from "react";

export function useErrorHandler() {
  const handleError = useCallback(
    (error: unknown, context?: string) => {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      const title = context ? `${context} Failed` : "Error";

      console.error(`${title}:`, error);

      toast.error(message);
    },
    [toast]
  );

  return { handleError };
}
