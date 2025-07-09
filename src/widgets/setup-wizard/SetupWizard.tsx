"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SuspenseWrapper } from "@/shared/components/SuspenseWrapper";
import { SetupDatabaseForm } from "@/widgets/setup-wizard/SetupDatabaseForm";
import { RootAccountContainer } from "@/features/setup-root/ui/RootAccountContainer";
import { StatusContainer } from "@/features/status/ui/StatusContainer";
import { useSetupFlow } from "@/features/setup/hooks/useSetupFlow";
import {
  Settings,
  ArrowRight,
  CheckCircle,
  Database,
  User,
  AlertTriangle,
} from "lucide-react";

export function SetupWizard() {
  const router = useRouter();
  const {
    steps,
    currentStep,
    allStepsCompleted,
    canProceedToDashboard,
    completeSetup,
  } = useSetupFlow();

  useEffect(() => {
    if (allStepsCompleted && !canProceedToDashboard) {
      completeSetup();
    }
  }, [allStepsCompleted, canProceedToDashboard, completeSetup]);

  const completedSteps = steps.filter((step) => step.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

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

  const renderCurrentStepContent = () => {
    switch (currentStep) {
      case "database":
        return (
          <SuspenseWrapper
            loadingMessage="Loading database configuration..."
            loadingType="setup"
          >
            <SetupDatabaseForm />
          </SuspenseWrapper>
        );
      case "root-account":
        return (
          <SuspenseWrapper
            loadingMessage="Loading root account setup..."
            loadingType="setup"
          >
            <RootAccountContainer />
          </SuspenseWrapper>
        );
      default:
        return null;
    }
  };

  if (canProceedToDashboard) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Setup Complete!
              </h1>
              <p className="text-gray-600">
                SentinelKeeper has been successfully configured and is ready to
                use.
              </p>
            </div>

            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {steps.map((step) => (
                    <div
                      key={step.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {getStepIcon(step.id, step.completed)}
                        <div className="text-left">
                          <h3 className="font-medium">{step.title}</h3>
                          <p className="text-sm text-gray-600">
                            {step.description}
                          </p>
                        </div>
                      </div>
                      <Badge variant="default" className="bg-green-500">
                        Complete
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button size="lg" onClick={() => router.push("/dashboard")}>
              <ArrowRight className="mr-2 h-5 w-5" />
              Go to Dashboard
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
                      currentStep === step.id
                        ? "border-blue-200 bg-blue-50"
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
                      ) : currentStep === step.id ? (
                        <Badge variant="default">In Progress</Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Step Alert */}
          {currentStep && (
            <Alert className="mb-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Complete the{" "}
                {steps.find((s) => s.id === currentStep)?.title.toLowerCase()}{" "}
                to continue with the setup process.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Current Step Content */}
            <div className="lg:col-span-2">{renderCurrentStepContent()}</div>

            {/* Status Panel */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <SuspenseWrapper
                    loadingMessage="Loading status..."
                    loadingType="status"
                  >
                    <StatusContainer />
                  </SuspenseWrapper>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
