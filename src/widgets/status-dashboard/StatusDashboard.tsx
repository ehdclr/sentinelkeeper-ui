"use client";

import { SuspenseWrapper } from "@/shared/components/SuspenseWrapper";
import { StatusContainer } from "@/features/status/ui/StatusContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  RefreshCw,
  Settings,
  Database,
  Activity,
  Clock,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useSetup } from "@/features/setup/hooks/useSetup";

function StatusDashboardContent() {
  const {
    databaseSetupStatus,
    isLoading,
    error,
    refresh,
    databaseHealthStatus,
  } = useSetup();

  // Redirect to setup if not configured
  if (databaseSetupStatus && !databaseSetupStatus.configured) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Setup Required</h2>
            <p className="text-gray-600 mb-4">
              Database is not configured yet. Please complete the setup first.
            </p>
            <Link href="/setup">
              <Button>
                <Settings className="h-4 w-4 mr-2" />
                Go to Setup
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleRefresh = () => {
    refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/setup">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Setup
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Database Dashboard
                </h1>
                <p className="text-gray-600">
                  Monitor your database status and health
                </p>
              </div>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={isLoading}
              variant="outline"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <p className="text-2xl font-bold">
                      {databaseHealthStatus?.status === "healthy"
                        ? "Healthy"
                        : databaseHealthStatus?.status === "unhealthy"
                        ? "Unhealthy"
                        : "Unknown"}
                    </p>
                  </div>
                  <Activity
                    className={`h-8 w-8 ${
                      databaseHealthStatus?.status === "healthy"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Database
                    </p>
                    <p className="text-2xl font-bold capitalize">
                      {databaseSetupStatus?.type || "N/A"}
                    </p>
                  </div>
                  <Database className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Configuration
                    </p>
                    <p className="text-2xl font-bold">
                      {databaseSetupStatus?.locked ? "Locked" : "Unlocked"}
                    </p>
                  </div>
                  <Settings
                    className={`h-8 w-8 ${
                      databaseSetupStatus?.locked
                        ? "text-yellow-500"
                        : "text-gray-500"
                    }`}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Uptime</p>
                    <p className="text-2xl font-bold">
                      {databaseSetupStatus?.createdAt
                        ? Math.floor(
                            (Date.now() -
                              new Date(
                                databaseSetupStatus.createdAt
                              ).getTime()) /
                              (1000 * 60 * 60)
                          ) + "h"
                        : "N/A"}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Status */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Status Panel */}
            <div>
              <SuspenseWrapper
                loadingMessage="Loading status details..."
                loadingType="status"
              >
                <StatusContainer />
              </SuspenseWrapper>
            </div>

            {/* Configuration Details */}
            <Card>
              <CardHeader>
                <CardTitle>Configuration Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {databaseSetupStatus && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Database Type</span>
                      <Badge variant="outline">
                        {databaseSetupStatus.type}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Configuration Status
                      </span>
                      <Badge
                        variant={
                          databaseSetupStatus.configured
                            ? "default"
                            : "secondary"
                        }
                      >
                        {databaseSetupStatus.configured
                          ? "Configured"
                          : "Not Configured"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Lock Status</span>
                      <Badge
                        variant={
                          databaseSetupStatus.locked
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {databaseSetupStatus.locked ? "Locked" : "Unlocked"}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Config File</span>
                      <Badge
                        variant={
                          databaseSetupStatus.configExists
                            ? "default"
                            : "secondary"
                        }
                      >
                        {databaseSetupStatus.configExists
                          ? "Exists"
                          : "Missing"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Lock File</span>
                      <Badge
                        variant={
                          databaseSetupStatus.lockExists
                            ? "default"
                            : "secondary"
                        }
                      >
                        {databaseSetupStatus.lockExists ? "Exists" : "Missing"}
                      </Badge>
                    </div>
                    {databaseSetupStatus.createdAt && (
                      <>
                        <Separator />
                        <div className="space-y-1">
                          <span className="text-sm font-medium">
                            Configured At
                          </span>
                          <p className="text-sm text-gray-600">
                            {new Date(
                              databaseSetupStatus.createdAt
                            ).toLocaleString()}
                          </p>
                        </div>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  variant="outline"
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${
                      isLoading ? "animate-spin" : ""
                    }`}
                  />
                  Refresh Status
                </Button>
                <Link href="/setup">
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    View Setup
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function StatusDashboard() {
  return (
    <SuspenseWrapper
      loadingMessage="Loading dashboard..."
      loadingType="dashboard"
    >
      <StatusDashboardContent />
    </SuspenseWrapper>
  );
}
