"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/shared/store/authStore";
import { LoadingFallback } from "./LoadingFallback";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (requiredRole && user && !requiredRole.includes(user.role)) {
      router.push("/dashboard"); // 권한 없으면 대시보드로
      return;
    }
  }, [isAuthenticated, user, requiredRole, router]);

  if (!isAuthenticated) {
    return <LoadingFallback />;
  }

  if (requiredRole && user && !requiredRole.includes(user.role)) {
    return <LoadingFallback />;
  }

  return <>{children}</>;
}
