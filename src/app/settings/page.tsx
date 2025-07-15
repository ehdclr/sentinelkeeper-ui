"use client";

import { useSetupStore } from "@/shared/store/setupStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, User, Lock } from "lucide-react";

export default function SettingsPage() {
  const { databaseSetupStatus, rootAccountStatus } =   useSetupStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">View your system configuration</p>
        </div>

        <div className="space-y-6">
          {/* Database Configuration */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <CardTitle>Database Configuration</CardTitle>
                </div>
                <Badge variant={databaseSetupStatus?.configured ? "default" : "secondary"}>
                  {databaseSetupStatus?.configured ? "Configured" : "Not Configured"}
                </Badge>
              </div>
              <CardDescription>
                Database connection settings are read-only after initial setup
              </CardDescription>
            </CardHeader>
            <CardContent>
              {databaseSetupStatus?.configured ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Host
                    </label>
                    <p className="text-sm text-gray-900">
                      {databaseSetupStatus?.configured?.host || "127.0.0.1"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Port
                    </label>
                    <p className="text-sm text-gray-900">
                      {databaseSetupStatus?.configured?.port || 5432}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Database
                    </label>
                    <p className="text-sm text-gray-900">
                      {databaseSetupStatus?.configured?.database || "sentinel"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Username
                    </label>
                    <p className="text-sm text-gray-900">
                      {databaseSetupStatus?.configured?.username || "root"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      SSL
                    </label>
                    <p className="text-sm text-gray-900">
                      {databaseSetupStatus?.configured?.ssl ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-gray-500">
                  <Lock className="h-4 w-4" />
                  <span>Database not configured</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Root Account */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <CardTitle>Root Account</CardTitle>
                </div>
                <Badge variant={rootAccountStatus ? "default" : "secondary"}>
                  {rootAccountStatus ? "Created" : "Not Created"}
                </Badge>
              </div>
              <CardDescription>
                Administrator account information is read-only
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rootAccountStatus ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Username
                    </label>
                    <p className="text-sm text-gray-900">
                      {rootAccountStatus?.username || "root"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="text-sm text-gray-900">{rootAccountStatus?.email || "root@example.com"}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-gray-500">
                  <Lock className="h-4 w-4" />
                  <span>Root account not created</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
