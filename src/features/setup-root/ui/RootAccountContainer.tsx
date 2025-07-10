// src/features/setup-root/ui/RootAccountContainer.tsx
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
    onSuccess: (data) => {
      toast.success("Root account created successfully! PEM file downloaded.");

      // PEM 파일 다운로드
      const blob = new Blob([data.pemFile], { type: "application/x-pem-file" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sentinel-root-${data.user.username}.pem`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // 상태 새로고침
      refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create root account");
    },
  });

  const handleCreateAccount = (data: RootAccountFormData) => {
    console.log("ㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴ", data);
    createMutation.mutate(data);
  };

  return (
    <RootAccountForm
      handleCreateAccount={handleCreateAccount}
      isLoading={createMutation.isPending}
      error={createMutation.error}
      accountExists={rootAccountStatus?.exists}
    />
  );
}
