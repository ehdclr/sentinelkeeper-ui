"use client";

import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { Toaster } from "sonner";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={4000}
        theme="light"
      />
    </ErrorBoundary>
  );
}
