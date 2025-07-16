"use client";

import { Key, Shield, CheckCircle } from "lucide-react";

type RecoveryStep = "upload" | "reset" | "success";

interface StepIndicatorProps {
  currentStep: RecoveryStep;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
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
} 