"use client";

import { StatusDisplay } from "./StatusDisplay";
import { LoadingFallback } from "@/shared/components/LoadingFallback";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useSetup } from "../../setup/hooks/useSetup";
import { getHealth } from "../api/getHealth";
import { useEffect, useState } from "react";
import { DatabaseHealthStatus } from "@/entities/setup/model";




export function StatusContainer() {
  const { databaseSetupStatus, isLoading, error, refresh } = useSetup();
  const [databaseHealthStatus, setDatabaseHealthStatus] = useState<DatabaseHealthStatus | null>(null);

  useEffect(() => {
    getHealth().then((data) => {
      setDatabaseHealthStatus(data);
    }).catch((error) => {
      console.error(error);
    });
  }, []);
  

  if (isLoading) {
    return <LoadingFallback message="Loading status..." type="status" />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-sm text-gray-500 mb-4">
            상태를 불러오는데 실패했습니다.
          </p>
          <Button onClick={refresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            다시 시도
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <StatusDisplay
      status={databaseSetupStatus}
      health={databaseHealthStatus}
      onRefresh={refresh}
    />
  );
}
