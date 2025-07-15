"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useSetupStore } from "@/shared/store/setupStore";
import { ConfigureDatabaseForm } from "./ConfigureDatabaseForm";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { DatabaseConfig } from "@/entities/setup/model";
import { errorHandler } from "@/shared/lib/errorHandler";
import { testConnection } from "../api/testConnection";
import { saveConfiguration } from "../api/saveConfiguration";
import { useRouter } from "next/navigation";

export function ConfigureDatabaseContainer() {
  const { databaseSetupStatus } = useSetupStore();
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const router = useRouter();
  
  if (databaseSetupStatus?.configured) {
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
      const result = await testConnection(config);
      if (result.success) {
        toast.success("연결에 성공했습니다.", {
          description: "데이터베이스 연결이 성공했습니다.",
        });
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
      const result = await saveConfiguration(config);
      if (result.success) {
        toast.success("설정이 저장되었습니다.", {
          description: "데이터베이스 설정이 성공적으로 저장되었습니다.",
        });
      }
      router.push("/setup");
    } catch (error) {
      errorHandler.general(error, "Save Configuration");
    } finally {
      setIsSaveLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <ConfigureDatabaseForm
        onTestConnection={handleTestConnection}
        onSaveConfiguration={handleSaveConfiguration}
        isTestLoading={isTestLoading}
        isSaveLoading={isSaveLoading}
      />
    </ErrorBoundary>
  );
}
