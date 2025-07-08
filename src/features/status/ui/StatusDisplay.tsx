import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { ConfigurationInfo } from "./ConfigurationInfo";
import { ConnectionHealth } from "./ConnectionHealth";
import { DatabaseInfo } from "./DatabaseInfo";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { SetupStatus, HealthStatus } from "@/entities/database/model";
import { toast } from "sonner";

interface StatusDisplayProps {
  status: SetupStatus | null;
  health: HealthStatus | null;
  onRefresh?: () => void;
}

export function StatusDisplay({
  status,
  health,
  onRefresh,
}: StatusDisplayProps) {
  if (!status) {
    toast.error("Status data is not available");
    return null;
  }

  return (
    <div className="space-y-4 w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">데이터베이스 상태</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <StatusBadge status={status} health={health} />
            {onRefresh && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onRefresh}
                className="hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 hover:shadow-lg hover:scale-105 transition-all duration-300 hover:cursor-pointer ml-auto mr-4"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            )}
          </div>

          <ConfigurationInfo status={status} />

          {status.configured && (
            <>
              <Separator />
              <DatabaseInfo status={status} />
            </>
          )}
        </CardContent>
      </Card>

      {health && <ConnectionHealth health={health} />}
    </div>
  );
}
