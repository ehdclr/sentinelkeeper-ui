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
import { PasswordResetContainer } from "@/features/recovery/ui/PasswordResetContainer";
import { StepIndicator } from "@/features/recovery/ui/StepIndicator";
import { useRecovery } from "@/features/recovery/hooks/useRecovery";

type RecoveryStep = "upload" | "reset" | "success";

export default function RecoveryPage() {
  const [currentStep, setCurrentStep] = useState<RecoveryStep>("upload");
  const [validatedUserId, setValidatedUserId] = useState<string>("");
  const [pemContent, setPemContent] = useState<string>(""); // 토큰 대신 PEM 키 저장
  const router = useRouter();

  // useRecovery 훅 제거 - 불필요

  const handleValidPEM = async (
    keyId: string,
    userId: string,
    pemKey: string
  ) => {
    // createRecoveryRequest 호출 제거
    setValidatedUserId(userId);
    setPemContent(pemKey);
    setCurrentStep("reset");
  };

  const handlePasswordResetSuccess = () => {
    setCurrentStep("success");
    // clearRecoverySession 호출 제거
  };

  const handleBackToLogin = () => {
    router.push("/login");
  };

  const renderPemUploadStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          Step 1: Verify PEM Key
        </CardTitle>
        <CardDescription>
          Upload or paste your private PEM key to verify your identity as the
          root user
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PemUploadContainer onValidPEM={handleValidPEM} />
      </CardContent>
    </Card>
  );

  const renderPasswordResetStep = () => (
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
          <PasswordResetContainer
            userId={validatedUserId}
            pemContent={pemContent} // 토큰 대신 PEM 키 전달
            onSuccess={handlePasswordResetSuccess}
            onCancel={() => setCurrentStep("upload")}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderSuccessStep = () => (
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
            <strong>Success!</strong> Your password has been reset. You can now
            log in with your new credentials.
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
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case "upload":
        return renderPemUploadStep();
      case "reset":
        return renderPasswordResetStep();
      case "success":
        return renderSuccessStep();
      default:
        return null;
    }
  };

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
        <StepIndicator currentStep={currentStep} />

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
        {renderStepContent()}

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
