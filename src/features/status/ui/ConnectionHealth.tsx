import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { HealthStatus } from "@/entities/database/model";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ConnectionHealthProps {
  health: HealthStatus;
}

export function ConnectionHealth({ health }: ConnectionHealthProps) {
  if (!health.database) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connection Health</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Connection Test</span>
          <div className="flex items-center space-x-2">
            {health.database.connectionTest.success ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm">
              {health.database.connectionTest.success ? "Success" : "Failed"}
            </span>
          </div>
        </div>

        {health.database.connectionTest.error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              {health.database.connectionTest.error}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
