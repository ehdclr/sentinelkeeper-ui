"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Database, Settings, Activity } from "lucide-react";

interface LoadingFallbackProps {
  message?: string;
  type?: "default" | "setup" | "dashboard" | "status";
}

export function LoadingFallback({
  message = "Loading...",
  type = "default",
}: LoadingFallbackProps) {
  const getIcon = () => {
    switch (type) {
      case "setup":
        return <Settings className="h-8 w-8 text-blue-500" />;
      case "dashboard":
        return <Activity className="h-8 w-8 text-green-500" />;
      case "status":
        return <Database className="h-8 w-8 text-purple-500" />;
      default:
        return <Loader2 className="h-8 w-8 animate-spin text-gray-500" />;
    }
  };

  return (
    <div className="min-h-[200px] flex items-center justify-center p-4">
      <Card className="max-w-sm w-full">
        <CardContent className="p-6 text-center">
          <div className="mb-4 flex justify-center">{getIcon()}</div>
          <h3 className="font-semibold mb-2">{message}</h3>
          <div className="flex justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
