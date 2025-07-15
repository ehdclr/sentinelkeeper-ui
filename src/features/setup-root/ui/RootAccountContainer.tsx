"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { rootAccountApi } from "../api/rootAccountApi";
import { useSetup } from "@/features/setup/hooks/useSetup";
import { RootAccountFormData } from "@/entities/setup/model";
import { RootAccountForm } from "./RootAccountForm";

export function RootAccountContainer() {
  const { rootAccountStatus, refresh } = useSetup();

  const createMutation = useMutation({
    mutationFn: rootAccountApi,
    // onSuccess, onError 제거
  });

  const handleCreateAccount = async (data: RootAccountFormData) => {
    try {
      const result = await createMutation.mutateAsync(data);
      console.log("Success response data:", result);
      
      // 성공 처리
      if (!result) {
        toast.error("서버 응답이 올바르지 않습니다.");
        return;
      }

      const algorithmText = result.algorithm === 'ed25519' ? 'Ed25519' : 'Symmetric';
      toast.success(
        `Root account created successfully! ${algorithmText} PEM file downloaded.`,
        {
          description: `Mode: ${result.mode || 'Unknown'}`,
          duration: 5000,
        }
      );

      // PEM 파일 다운로드
      if (result.pemContent && result.filename) {
        const blob = new Blob([result.pemContent], { 
          type: "application/x-pem-file" 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = result.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      // 보안 알림
      if (result.algorithm === 'ed25519') {
        toast.info("🔐 Zero-Knowledge Security", {
          description: "Your private key is not stored on the server. Keep the PEM file safe!",
          duration: 8000,
        });
      }

      refresh();
    } catch (error) {
      console.error("Account creation error:", error);
      toast.error((error as Error).message || "계정 생성에 실패했습니다.");
    }
  };

  return (
    <RootAccountForm
      onSubmit={handleCreateAccount}
      isLoading={createMutation.isPending}
      error={createMutation.error}
      accountExists={rootAccountStatus}
    />
  );
}