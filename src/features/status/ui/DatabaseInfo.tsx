import { Database } from "lucide-react";
import { SetupStatus } from "@/entities/database/model";

interface DatabaseInfoProps {
  status: SetupStatus;
}

export function DatabaseInfo({ status }: DatabaseInfoProps) {
  return (
    <>
      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-2">
          <Database className="h-4 w-4" />
          <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
            {status.type}
          </span>
        </div>
        {status.createdAt && (
          <div className="text-xs text-muted-foreground">
            {new Date(status.createdAt).toLocaleString()}
          </div>
        )}
      </div>
    </>
  );
}
