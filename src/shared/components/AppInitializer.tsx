"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSetup } from "@/features/setup/hooks/useSetup";
import { useAuthStore } from "@/shared/store/authStore";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface AppInitializerProps {
  children: React.ReactNode;
}

interface RouteCondition {
  path: string | RegExp;
  condition: (context: RouteContext) => boolean;
  redirect: string;
}

interface RouteContext {
  isSetupComplete: boolean;
  isAuthenticated: boolean;
  pathname: string;
}

// 🔥 상수화
const PATHS = {
  SETUP: "/setup",
  LOGIN: "/login",
  RECOVERY: "/recovery",
  DASHBOARD: "/dashboard",
  ROOT: "/",
  NOT_FOUND: "/404",
} as const;

const EXCLUDED_PAGES = [PATHS.LOGIN, PATHS.RECOVERY, PATHS.NOT_FOUND, "/not-found"];

const NO_SIDEBAR_PAGES = [
  PATHS.LOGIN,
  PATHS.RECOVERY,
  PATHS.NOT_FOUND,
  "/not-found",
  PATHS.SETUP,
];

// 🔥 간단한 우선순위 기반 라우팅 규칙
const ROUTING_RULES: RouteCondition[] = [
  // 1. 설정 미완료 시 setup으로 (제외 페이지 제외)
  {
    path: /^(?!\/setup|\/login|\/recovery|\/404|\/not-found)/,
    condition: ({ isSetupComplete }) => !isSetupComplete,
    redirect: PATHS.SETUP,
  },
  // 2. 설정 완료 시 setup 페이지 접근하면 dashboard로
  {
    path: /^\/setup/,
    condition: ({ isSetupComplete }) => isSetupComplete,
    redirect: PATHS.DASHBOARD,
  },
  // 3. 설정 완료 + 미인증 시 login으로
  {
    path: /^(?!\/login|\/recovery)/,
    condition: ({ isSetupComplete, isAuthenticated }) =>
      isSetupComplete && !isAuthenticated,
    redirect: PATHS.LOGIN,
  },
  // 4. 루트 경로 처리
  {
    path: PATHS.ROOT,
    condition: ({ isSetupComplete, isAuthenticated }) =>
      isSetupComplete && isAuthenticated,
    redirect: PATHS.DASHBOARD,
  },
];

const findMatchingRule = (context: RouteContext): string | null => {
  // 제외할 페이지들은 라우팅 규칙 적용 안 함
  if (EXCLUDED_PAGES.includes(context.pathname)) {
    return null;
  }

  for (const rule of ROUTING_RULES) {
    const pathMatches =
      typeof rule.path === "string"
        ? rule.path === context.pathname
        : rule.path.test(context.pathname);

    if (pathMatches && rule.condition(context)) {
      return rule.redirect;
    }
  }
  return null;
};

export function AppInitializer({ children }: AppInitializerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { databaseSetupStatus, rootAccountStatus, isLoading } = useSetup();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    const context: RouteContext = {
      isSetupComplete:
        (databaseSetupStatus?.configured || false) &&
        (rootAccountStatus || false),
      isAuthenticated,
      pathname,
    };

    const redirectPath = findMatchingRule(context);

    if (redirectPath) {
      router.push(redirectPath);
    }
  }, [
    isLoading,
    databaseSetupStatus,
    rootAccountStatus,
    pathname,
    router,
    isAuthenticated,
  ]);

  // 레이아웃 결정 로직
  const shouldShowSidebar = !NO_SIDEBAR_PAGES.some(
    (page) => pathname === page
  );

  if (!shouldShowSidebar) {
    // 사이드바 없는 레이아웃
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="h-screen">{children}</main>
      </div>
    );
  }

  // 사이드바 있는 레이아웃
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}