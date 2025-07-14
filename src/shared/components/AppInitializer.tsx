"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSetup } from "@/features/setup/hooks/useSetup";
import { LoadingFallback } from "./LoadingFallback";

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { databaseSetupStatus, rootAccountStatus, isLoading } = useSetup();

  useEffect(() => {
    // 로딩 중이면 아무것도 하지 않음
    if (isLoading) return;

    const dbConfigured = databaseSetupStatus?.configured || false;
    const rootExists = rootAccountStatus || false;
    const isSetupComplete = dbConfigured && rootExists;
    console.log("rootExists", rootAccountStatus);
    console.log("isSetupComplete", isSetupComplete);
    // 설정이 완료되었으면 상태 업데이트
    if (isSetupComplete) {
      router.push("/dashboard");
    }

    // 현재 경로에 따른 라우팅 로직
    if (pathname === "/") {
      if (isSetupComplete) {
        router.push("/dashboard");
      } else {
        router.push("/setup");
      }
    } else if (pathname === "/setup" && isSetupComplete) {
      // 설정이 완료되었는데 setup 페이지에 있으면 대시보드로 이동
      router.push("/dashboard");
    } else if (pathname.startsWith("/dashboard") && !isSetupComplete) {
      // 설정이 완료되지 않았는데 대시보드에 접근하려 하면 setup으로 이동
      router.push("/setup");
    }
  }, [
    isLoading,
    databaseSetupStatus,
    rootAccountStatus,
    pathname,
    router,
  ]);

  // 로딩 중일 때는 로딩 화면 표시
  if (isLoading) {
    return <LoadingFallback message="Checking setup status..." />;
  }

  return <>{children}</>;
} 