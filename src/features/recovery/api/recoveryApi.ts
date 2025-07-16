// src/features/recovery/api/recoveryApi.ts
import { apiFetch } from "@/shared/api/client";

export interface PEMValidationRequest {
  pemContent: string;
}

export interface PEMValidationResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    valid: boolean;
    username: string;
    email: string;
    createdAt: string;
    algorithm: string;
    publicKeyMatch: boolean;
    message: string;
  };
  timestamp: string;
  path: string;
}

export interface RecoveryRequest {
  id: string;
  pemKeyId: string;
  requestedAt: string;
  expiresAt: string;
  isUsed: boolean;
}

export const recoveryApi = {
  validatePEM: async (pemContent: string): Promise<PEMValidationResponse> => {
    return apiFetch("/users/root/validate-recovery-key", {
      method: "POST",
      body: JSON.stringify({ pemContent }),
    });
  },

  createRecoveryRequest: async (pemKeyId: string): Promise<RecoveryRequest> => {
    return apiFetch("/recovery/requests", {
      method: "POST",
      body: JSON.stringify({ pemKeyId }),
    });
  },

  resetPassword: async (pemContent: string, newPassword: string): Promise<void> => {
    return apiFetch("/users/root/password-reset", {
      method: "POST",
      body: JSON.stringify({ pemContent, newPassword }),
    });
  },
};
