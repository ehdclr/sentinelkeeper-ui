// src/features/recovery/ui/PemUploadContainer.tsx
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { recoveryApi } from "../api/recoveryApi";
import PemUploadForm from "./PemUploadForm";

interface PemUploadContainerProps {
  onValidPEM: (keyId: string, userId: string) => void;
}

export function PemUploadContainer({ onValidPEM }: PemUploadContainerProps) {
  const [pemContent, setPemContent] = useState("");

  const validateMutation = useMutation({
    mutationFn: recoveryApi.validatePEM,
  });

  const handleValidate = () => {
    if (!pemContent.trim()) {
      toast.error("Please provide a PEM key");
      return;
    }

    validateMutation.mutate(pemContent, {
      onSuccess: (response) => {
        if (response.success && response.data.valid) {
          toast.success(response.message);
          
          onValidPEM(
            response.data.username, // keyId 대신 username 사용
            response.data.username  // userId도 username 사용
          );
        } else {
          toast.error(response.data.message || "PEM key validation failed");
        }
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to validate PEM key");
      },
    });
  };

  return (
    <PemUploadForm
      pemContent={pemContent}
      onPemContentChange={setPemContent}
      onValidate={handleValidate}
      isValidating={validateMutation.isPending}
      error={validateMutation.error?.message || null}
    />
  );
}