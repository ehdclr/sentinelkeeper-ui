"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Shield, CheckCircle, Key } from "lucide-react";
import { PemUploadContainer } from "@/features/recovery/ui/PemUploadContainer";
import PasswordReset from "@/features/recovery/ui/PasswordReset";
import { useRecovery } from "@/features/recovery/hooks/useRecovery";

type RecoveryStep = "upload" | "reset" | "success";

export default function RecoveryPage() {
  const [currentStep, setCurrentStep] = useState<RecoveryStep>("upload");
  const [validatedUserId, setValidatedUserId] = useState<string>("");
  const router = useRouter();

  const { createRecoveryRequest, clearRecoverySession } = useRecovery();

  const handleValidPEM = async (keyId: string, userId: string) => {
    try {
      console.log("keyId", keyId);
      await createRecoveryRequest(keyId);
      setValidatedUserId(userId);
      setCurrentStep("reset");
    } catch (error) {
      console.error("Failed to create recovery request:", error);
    }
  };

  const handlePasswordResetSuccess = () => {
    setCurrentStep("success");
    clearRecoverySession();
  };

  const handleBackToLogin = () => {
    router.push("/login");
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep === "upload"
              ? "bg-blue-600 text-white"
              : currentStep === "reset" || currentStep === "success"
              ? "bg-green-600 text-white"
              : "bg-gray-300 text-gray-600"
          }`}
        >
          <Key className="w-4 h-4" />
        </div>
        <div
          className={`w-12 h-0.5 ${
            currentStep === "reset" || currentStep === "success"
              ? "bg-green-600"
              : "bg-gray-300"
          }`}
        />
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep === "reset"
              ? "bg-blue-600 text-white"
              : currentStep === "success"
              ? "bg-green-600 text-white"
              : "bg-gray-300 text-gray-600"
          }`}
        >
          <Shield className="w-4 h-4" />
        </div>
        <div
          className={`w-12 h-0.5 ${
            currentStep === "success" ? "bg-green-600" : "bg-gray-300"
          }`}
        />
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep === "success"
              ? "bg-green-600 text-white"
              : "bg-gray-300 text-gray-600"
          }`}
        >
          <CheckCircle className="w-4 h-4" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-600 p-3 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Account Recovery</h1>
          <p className="text-gray-600 mt-2">
            Recover your root account using PEM key authentication
          </p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Back to Login */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToLogin}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        </div>

        {/* Step Content */}
        {currentStep === "upload" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Step 1: Verify PEM Key
              </CardTitle>
              <CardDescription>
                Upload or paste your private PEM key to verify your identity as
                the root user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PemUploadContainer onValidPEM={handleValidPEM} />
            </CardContent>
          </Card>
        )}

        {currentStep === "reset" && (
          <div className="space-y-6">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                PEM key verified successfully! You can now reset your password.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Step 2: Reset Password
                </CardTitle>
                <CardDescription>
                  Create a new secure password for your root account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PasswordReset
                  userId={validatedUserId}
                  onSuccess={handlePasswordResetSuccess}
                  onCancel={() => setCurrentStep("upload")}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === "success" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                Recovery Complete!
              </CardTitle>
              <CardDescription>
                Your root account password has been successfully reset
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Success!</strong> Your password has been reset. You
                  can now log in with your new credentials.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Next Steps:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Log in with your new password
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Consider updating your PEM keys
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Review security settings
                  </li>
                </ul>
              </div>

              <Button onClick={handleBackToLogin} className="w-full" size="lg">
                Continue to Login
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Security Notice */}
        <Alert className="mt-6">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Security Notice:</strong> This recovery process is logged
            for security purposes. If you did not initiate this recovery, please
            contact your system administrator immediately.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
