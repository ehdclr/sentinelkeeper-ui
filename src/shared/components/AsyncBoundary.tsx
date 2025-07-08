"use client";

import { ErrorBoundary } from "./ErrorBoundary";
import { SuspenseWrapper } from "./SuspenseWrapper";

interface AsyncBoundaryProps {
  children: React.ReactNode;
  loadingMessage?: string;
  loadingType?: "default" | "setup" | "dashboard" | "status";
  fallback?: React.ReactNode;
}

export function AsyncBoundary({
  children,
  loadingMessage,
  loadingType = "default",
  fallback,
}: AsyncBoundaryProps) {
  return (
    <ErrorBoundary>
      <SuspenseWrapper
        loadingMessage={loadingMessage}
        loadingType={loadingType}
        fallback={fallback}
      >
        {children}
      </SuspenseWrapper>
    </ErrorBoundary>
  );
}
