"use client";

import { SuspenseWrapper } from "@/shared/components/SuspenseWrapper";
import { ConfigureDatabaseContainer } from "@/features/setup-database/ui/ConfigureDatabaseContainer";
import { StatusContainer } from "@/features/status/ui/StatusContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Settings, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSetup } from "@/features/setup/hooks/useSetup";

export const SetupDatabaseFormContent = () => {
  const { databaseSetupStatus, isLoading, error } = useSetup();

  if (error) {
    throw error; // Will be caught by ErrorBoundary
  }

  const status = databaseSetupStatus;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              SentinelKeeper Setup
            </h1>
            <p className="text-gray-600">
              메타데이터를 저장할 데이터베이스를 설정합니다.
            </p>
          </div>

          {/* Status Check */}
          {status?.configured ? (
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <div>
                      <h3 className="font-semibold text-green-700">
                        데이터베이스가 이미 설정되어 있습니다.
                      </h3>
                      <p className="text-sm text-gray-600">
                        데이터베이스가 설정되어 있으며 사용할 준비가 되었습니다.
                      </p>
                    </div>
                  </div>
                  <Link href="/dashboard">
                    <Button>
                      대시보드로 이동
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Alert className="mb-8">
              <Settings className="h-4 w-4" />
              <AlertDescription>
                데이터베이스 설정이 필요합니다. 아래에서 데이터베이스 설정을
                해주세요.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Configuration Form */}
            <div className="lg:col-span-2">
              <SuspenseWrapper
                loadingMessage="Loading configuration form..."
                loadingType="setup"
              >
                <ConfigureDatabaseContainer />
              </SuspenseWrapper>
            </div>

            {/* Status Panel */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Current Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <SuspenseWrapper
                    loadingMessage="Loading status..."
                    loadingType="status"
                  >
                    <StatusContainer />
                  </SuspenseWrapper>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SetupDatabaseForm = () => {
  return (
    <SuspenseWrapper
      loadingMessage="Loading Database setup page..."
      loadingType="setup"
    >
      <SetupDatabaseFormContent />
    </SuspenseWrapper>
  );
};
