"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSetup } from "@/features/setup/hooks/useSetup";
import { useAuthStore } from "@/shared/store/authStore";
import { LoadingFallback } from "./LoadingFallback";
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

const ROUTING_RULES: RouteCondition[] = [
  {
    path: /^(?!\/setup)/,
    condition: ({ isSetupComplete }) => !isSetupComplete,
    redirect: "/setup",
  },
  {
    path: /^\/setup/,
    condition: ({ isSetupComplete }) => isSetupComplete,
    redirect: "/dashboard",
  },
  {
    path: "/",
    condition: ({ isSetupComplete, isAuthenticated }) =>
      isSetupComplete && !isAuthenticated,
    redirect: "/login",
  },
  {
    path: "/",
    condition: ({ isSetupComplete, isAuthenticated }) =>
      isSetupComplete && isAuthenticated,
    redirect: "/dashboard",
  },
  {
    path: /^\/dashboard/,
    condition: ({ isAuthenticated }) => !isAuthenticated,
    redirect: "/login",
  },
];

const findMatchingRule = (context: RouteContext): string | null => {
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

// 사이드바가 없어야 하는 페이지들
const NO_SIDEBAR_PAGES = [
  "/login",
  "/404",
  "/not-found"
];

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

  if (isLoading) {
    return <LoadingFallback message="Checking setup status..." />;
  }

  // 🔥 레이아웃 결정 로직 추가
  const shouldShowSidebar = !NO_SIDEBAR_PAGES.some(page => 
    pathname === page || pathname.startsWith("/setup")
  );

  if (!shouldShowSidebar) {
    // 사이드바 없는 레이아웃
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="h-screen">
          {children}
        </main>
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
