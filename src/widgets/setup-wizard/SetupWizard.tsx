"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SetupDatabaseForm } from "@/features/setup-database/ui/SetupDatabaseForm";
import { RootAccountContainer } from "@/features/setup-root/ui/RootAccountContainer";
import { useSetup } from "@/features/setup/hooks/useSetup";

import {
  Settings,
  ArrowRight,
  CheckCircle,
  Database,
  User,
} from "lucide-react";

interface Step {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export function SetupWizard() {
  const router = useRouter();
  const { databaseSetupStatus, rootAccountStatus, isLoading } = useSetup();

  // 설정 완료 여부 확인
  const isSetupComplete =
    (databaseSetupStatus?.configured || false) &&
    (rootAccountStatus?.exists || false);

  // 스텝 정의
  const steps: Step[] = [
    {
      id: "database",
      title: "Database Configuration",
      description: "Configure your database connection",
      completed: databaseSetupStatus?.configured || false,
    },
    {
      id: "root-account",
      title: "Root Account Setup",
      description: "Create your root administrator account",
      completed: rootAccountStatus?.exists || false,
    },
  ];

  const totalSteps = steps.length;
  const completedSteps = steps.filter((step) => step.completed).length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  useEffect(() => {
    if (isSetupComplete) {
      router.push("/dashboard");
    }
  }, [isSetupComplete, router]);

  const getStepIcon = (stepId: string, completed: boolean) => {
    if (completed) return <CheckCircle className="h-5 w-5 text-green-500" />;

    switch (stepId) {
      case "database":
        return <Database className="h-5 w-5 text-blue-500" />;
      case "root-account":
        return <User className="h-5 w-5 text-purple-500" />;
      default:
        return <Settings className="h-5 w-5 text-gray-500" />;
    }
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading setup status...</p>
        </div>
      </div>
    );
  }

  // 설정이 완료되었으면 대시보드로 이동
  if (isSetupComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Setup Complete!
            </h1>
            <p className="text-gray-600 mb-8">Redirecting to dashboard...</p>
            <Button onClick={() => router.push("/dashboard")}>
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              SentinelKeeper Setup
            </h1>
            <p className="text-gray-600 mb-4">
              Complete the following steps to configure your monitoring platform
            </p>

            {/* Progress */}
            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>
                  {completedSteps} of {totalSteps} completed
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>

          {/* Steps Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Setup Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      step.completed
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {getStepIcon(step.id, step.completed)}
                      <div>
                        <h3 className="font-medium">{step.title}</h3>
                        <p className="text-sm text-gray-600">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {step.completed ? (
                        <Badge variant="default" className="bg-green-500">
                          Complete
                        </Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Setup Forms */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Database Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                {databaseSetupStatus?.configured ? (
                  <div className="text-center p-4">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Database is configured
                    </p>
                  </div>
                ) : (
                  <SetupDatabaseForm />
                )}
              </CardContent>
            </Card>

            {/* Root Account Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Root Account Setup
                </CardTitle>
              </CardHeader>
              <CardContent>
                {rootAccountStatus?.exists ? (
                  <div className="text-center p-4">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Root account exists</p>
                  </div>
                ) : (
                  <RootAccountContainer />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
