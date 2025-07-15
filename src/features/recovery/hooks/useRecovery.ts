import { useState, useCallback } from "react";
import type {
  RecoveryRequest,
  PEMKeyValidation,
  RecoverySession,
} from "../types";

interface UseRecoveryReturn {
  recoveryRequests: RecoveryRequest[];
  currentSession: RecoverySession | null;
  isValidatingPEM: boolean;
  validationError: string | null;

  validatePEMKey: (pemContent: string) => Promise<PEMKeyValidation>;
  createRecoveryRequest: (pemKeyId: string) => Promise<RecoveryRequest>;
  useRecoveryRequest: (requestId: string) => Promise<RecoverySession>;
  clearRecoverySession: () => void;
  setValidationError: (error: string | null) => void;
}

export function useRecovery(): UseRecoveryReturn {
  const [recoveryRequests, setRecoveryRequests] = useState<RecoveryRequest[]>(
    []
  );
  const [currentSession, setCurrentSession] = useState<RecoverySession | null>(
    null
  );
  const [isValidatingPEM, setIsValidatingPEM] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validatePEMKey = useCallback(
    async (pemContent: string): Promise<PEMKeyValidation> => {
      setIsValidatingPEM(true);
      setValidationError(null);

      try {
        // Simulate PEM validation
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock validation - in real app, this would verify the PEM signature
        const mockPEMKeys = [
          {
            id: "pem-1",
            userId: "1",
            content: "-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...",
          },
          {
            id: "pem-2",
            userId: "2",
            content: "-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...",
          },
        ];

        const matchedKey = mockPEMKeys.find(
          (key) =>
            pemContent.includes("BEGIN RSA PRIVATE KEY") &&
            pemContent.length > 100
        );

        if (matchedKey) {
          return {
            isValid: true,
            keyId: matchedKey.id,
            userId: matchedKey.userId,
          };
        } else {
          return {
            isValid: false,
            error: "Invalid PEM key format or key not found",
          };
        }
      } catch (error) {
        return {
          isValid: false,
          error: "Failed to validate PEM key",
        };
      } finally {
        setIsValidatingPEM(false);
      }
    },
    []
  );

  const createRecoveryRequest = useCallback(
    async (pemKeyId: string): Promise<RecoveryRequest> => {
      const request: RecoveryRequest = {
        id: `recovery-${Date.now()}`,
        pemKeyId,
        requestedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
        isUsed: false,
        ipAddress: "127.0.0.1", // Would be actual IP
        userAgent: navigator.userAgent,
      };

      setRecoveryRequests((prev) => [...prev, request]);
      return request;
    },
    []
  );

  const useRecoveryRequest = useCallback(
    async (requestId: string): Promise<RecoverySession> => {
      const request = recoveryRequests.find((r) => r.id === requestId);
      if (
        !request ||
        request.isUsed ||
        new Date() > new Date(request.expiresAt)
      ) {
        throw new Error("Invalid or expired recovery request");
      }

      // Mark as used
      setRecoveryRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, isUsed: true } : r))
      );

      const session: RecoverySession = {
        token: `recovery-${Date.now()}-${Math.random()}`,
        userId: "1", // Would be from PEM key lookup
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
        canChangePassword: true,
        canAccessAdmin: true,
      };

      setCurrentSession(session);
      return session;
    },
    [recoveryRequests]
  );

  const clearRecoverySession = useCallback(() => {
    setCurrentSession(null);
  }, []);

  return {
    recoveryRequests,
    currentSession,
    isValidatingPEM,
    validationError,
    validatePEMKey,
    createRecoveryRequest,
    useRecoveryRequest,
    clearRecoverySession,
    setValidationError,
  };
}
