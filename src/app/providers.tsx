"use client";

import type React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppInitializer } from "@/shared/components/AppInitializer";
import { Toaster } from "sonner";
import { useState } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
            retry: (failureCount, error) => {
              if (error instanceof Error && error.message.includes("401")) {
                return false;
              }
              return failureCount < 3;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppInitializer>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={4000}
          theme="light"
        />
      </AppInitializer>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
