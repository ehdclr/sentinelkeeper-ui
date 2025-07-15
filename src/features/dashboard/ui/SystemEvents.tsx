import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MetricCardProps {
  title: string;
  value: number;
  unit?: string;
  icon?: React.ReactNode;
  status?: "healthy" | "warning" | "error";
}

export function MetricCard({
  title,
  value,
  unit = "%",
  icon,
  status = "healthy",
}: MetricCardProps) {
  const getStatusColor = (status: string, value: number) => {
    if (status === "error" || value >= 90) return "bg-red-500";
    if (status === "warning" || value >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value.toFixed(1)}
          {unit}
        </div>
        <Progress
          value={value}
          className="mt-2"
          indicatorClassName={getStatusColor(status, value)}
        />
      </CardContent>
    </Card>
  );
}
