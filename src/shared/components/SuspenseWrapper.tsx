"use client";

import { Suspense } from "react";
import { LoadingFallback } from "./LoadingFallback";
import { ErrorBoundary } from "./ErrorBoundary";

interface SuspenseWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingMessage?: string;
  loadingType?: "default" | "setup" | "dashboard" | "status";
}

export function SuspenseWrapper({
  children,
  fallback,
  loadingMessage,
  loadingType = "default",
}: SuspenseWrapperProps) {
  const defaultFallback = fallback || (
    <LoadingFallback message={loadingMessage} type={loadingType} />
  );

  return (
    <ErrorBoundary>
      <Suspense fallback={defaultFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}
