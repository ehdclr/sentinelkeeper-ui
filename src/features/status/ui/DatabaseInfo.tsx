import { Database } from "lucide-react";
import { SetupStatus } from "@/entities/database/model";

interface DatabaseInfoProps {
  status: SetupStatus;
}

export function DatabaseInfo({ status }: DatabaseInfoProps) {
  return (
    <>
      <div className="space-y-2">
        <p className="text-sm font-medium">Database Type</p>
        <div className="flex items-center space-x-2">
          <Database className="h-4 w-4" />
          <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
            {status.type}
          </span>
        </div>
      </div>

      {status.createdAt && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Configured At</p>
          <p className="text-sm text-muted-foreground">
            {new Date(status.createdAt).toLocaleString()}
          </p>
        </div>
      )}
    </>
  );
}
