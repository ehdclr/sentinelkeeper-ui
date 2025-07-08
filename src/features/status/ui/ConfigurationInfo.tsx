import { SetupStatus } from "@/entities/database/model";
import { CheckCircle, XCircle, Settings, Lock } from "lucide-react";

interface ConfigurationInfoProps {
  status: SetupStatus;
}

export function ConfigurationInfo({ status }: ConfigurationInfoProps) {
  return (
    <div className="grid grid-cols-2 gap-4 text-center">
      <div>
        <p className="text-xs text-muted-foreground mb-1">Configuration</p>
        <div className="flex items-center space-x-2">
          {status.configured ? (
            <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500 mx-auto" />
          )}
        </div>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1">Lock Status</p>
        <div className="flex items-center space-x-2">
          {status.locked ? (
            <Lock className="h-5 w-5 text-yellow-500 mx-auto" />
          ) : (
            <Settings className="h-5 w-5 text-gray-500 mx-auto" />
          )}
        <span className="block text-xs mt-1">
          {status.locked ? "Locked" : "Unlocked"}
        </span>
        </div>
      </div>
    </div>
  );
}
