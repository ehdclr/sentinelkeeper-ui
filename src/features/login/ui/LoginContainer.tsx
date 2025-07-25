"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/store/authStore";
import {
  loginApi,
  type LoginRequest,
  type LoginResponse,
} from "@/features/login/api/login";

import { LoginForm } from "@/features/login/ui/LoginForm";
import { RecoverySection } from "@/features/login/ui/RecoverySection";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { errorHandler } from "@/shared/lib/errorHandler";

export function LoginContainer() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginApi(data);

      console.log(response);

      if (response.success) {
        // Store에 사용자 정보 저장
        login({
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          expiresAt: response.data.expiresAt,
        });

        // 성공 시 에러 상태 클리어
        setError(null);

        // 대시보드로 리디렉션
        router.push("/dashboard");
      }
    } catch (error) {
      // 에러를 state에 저장하여 UI에 표시
      errorHandler.general(error, "Login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
      <RecoverySection />
    </ErrorBoundary>
  );
}
