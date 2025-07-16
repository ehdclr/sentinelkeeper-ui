"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { recoveryApi } from "../api/recoveryApi";
import PasswordResetForm from "./PasswordResetForm";

interface PasswordResetContainerProps {
  userId: string;
  pemContent: string; // recoveryToken 대신 pemContent
  onSuccess: () => void;
  onCancel: () => void;
}

export function PasswordResetContainer({
  userId,
  pemContent,
  onSuccess,
  onCancel,
}: PasswordResetContainerProps) {
  const resetPasswordMutation = useMutation({
    mutationFn: ({ newPassword }: { newPassword: string }) =>
      recoveryApi.resetPassword(pemContent, newPassword), // PEM 키 사용
  });

  const handleSubmit = (newPassword: string) => {
    resetPasswordMutation.mutate(
      { newPassword },
      {
        onSuccess: () => {
          toast.success("Password reset successfully!");
          onSuccess();
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to reset password");
        },
      }
    );
  };

  return (
    <PasswordResetForm
      onSubmit={handleSubmit}
      isLoading={resetPasswordMutation.isPending}
      error={resetPasswordMutation.error?.message || null}
      onCancel={onCancel}
    />
  );
}
