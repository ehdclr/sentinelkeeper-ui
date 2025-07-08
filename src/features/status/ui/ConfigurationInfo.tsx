import { SetupStatus } from "@/entities/database/model";
import { CheckCircle, XCircle, Settings, Lock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ConfigurationInfoProps {
  status: SetupStatus;
}

export function ConfigurationInfo({ status }: ConfigurationInfoProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Configuration</p>
        <div className="flex items-center space-x-2">
          {status.configured ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
        </div>
      </div>
      <Separator orientation="vertical" />
      <div className="space-y-2">
        <p className="text-sm font-medium">Lock Status</p>
        <div className="flex items-center space-x-2">
          {status.locked ? (
            <Lock className="h-4 w-4 text-yellow-500" />
          ) : (
            <Settings className="h-4 w-4 text-gray-500" />
          )}
          <span className="text-sm">
            {status.locked ? "Locked" : "Unlocked"}
          </span>
        </div>
      </div>
    </div>
  );
}
