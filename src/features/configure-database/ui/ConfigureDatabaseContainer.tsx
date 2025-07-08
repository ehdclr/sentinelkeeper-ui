"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useSetupStore } from "@/shared/store/setupStore";
import { useAsyncData } from "@/shared/hooks/useAsyncData";
import { safeApiFetch } from "@/shared/api/client";
import { ConfigureDatabaseForm } from "./ConfigureDatabaseForm";
import { DatabaseConfig } from "@/entities/database/model";
import { LoadingFallback } from "@/shared/components/LoadingFallback";
import { errorHandler } from "@/shared/lib/errorHandler";

export function ConfigureDatabaseContainer() {
  const { status } = useSetupStore();
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  const { data: examplesResult, isLoading: examplesLoading } = useAsyncData(
    () => safeApiFetch("/setup/examples", {}, false), // ✅ 조용히 처리
    [],
    {
      showToast: false, // ✅ 예시 로드 실패는 toast 표시하지 않음
      errorContext: "Load Examples",
    }
  );

  if (examplesLoading) {
    return <LoadingFallback message="Loading examples..." type="setup" />;
  }

  if (status?.configured) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl font-semibold mb-2">
          Database Already Configured
        </h2>
        <p className="text-muted-foreground">
          The database is already configured and locked. Configuration cannot be
          changed.
        </p>
      </div>
    );
  }

  const handleTestConnection = async (config: DatabaseConfig) => {
    setIsTestLoading(true);

    try {
      const result = await safeApiFetch(
        "/setup/test-connection",
        {
          method: "POST",
          body: JSON.stringify(config),
        },
        false
      ); // ✅ toast는 직접 처리

      if (result.success) {
        toast.success("Connection Test Passed", {
          description: "Database connection is working",
        });
      } else {
        errorHandler.api(
          new Error(result.error || "Unknown error"),
          "Connection Test"
        );
      }
    } catch (error) {
      errorHandler.general(error, "Connection Test");
    } finally {
      setIsTestLoading(false);
    }
  };

  const handleSaveConfiguration = async (config: DatabaseConfig) => {
    setIsSaveLoading(true);

    try {
      const result = await safeApiFetch(
        "/setup/database",
        {
          method: "POST",
          body: JSON.stringify(config),
        },
        false
      ); // ✅ toast는 직접 처리

      if (result.success) {
        toast.success("Configuration Saved", {
          description: "Database configured successfully. Reloading...",
        });

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        errorHandler.api(
          new Error(result.error || "Unknown error"),
          "Save Configuration"
        );
      }
    } catch (error) {
      errorHandler.general(error, "Save Configuration");
    } finally {
      setIsSaveLoading(false);
    }
  };

  return (
    <ConfigureDatabaseForm
      examples={examplesResult?.success ? (examplesResult.data as Record<string, DatabaseConfig>) : null}
      onTestConnection={handleTestConnection}
      onSaveConfiguration={handleSaveConfiguration}
      isTestLoading={isTestLoading}
      isSaveLoading={isSaveLoading}
    />
  );
}
