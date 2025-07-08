import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Settings } from "lucide-react";
import { HealthStatus, SetupStatus } from "@/entities/database/model";

interface StatusBadgeProps {
  status: SetupStatus | null;
  health: HealthStatus | null;
}

export function StatusBadge({ status, health }: StatusBadgeProps) {
  if (!status?.configured) {
    return (
      <Badge variant="secondary">
        <Settings className="h-3 w-3 mr-1" />
        Setup Required
      </Badge>
    );
  }

  if (health?.status === "healthy") {
    return (
      <Badge variant="default" className="bg-green-500">
        <CheckCircle className="h-3 w-3 mr-1" />
        Healthy
      </Badge>
    );
  }

  if (health?.status === "unhealthy") {
    return (
      <Badge variant="destructive">
        <XCircle className="h-3 w-3 mr-1" />
        Unhealthy
      </Badge>
    );
  }

  return <Badge variant="outline">알 수 없음</Badge>;
}
