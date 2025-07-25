"use client";

import { LoginContainer } from "@/features/login/ui/LoginContainer";
import { AuthHeader } from "@/features/login/ui/LoginHeader";
import { DemoCredentials } from "@/features/login/ui/DemoCredentials";
import { SecurityNotice } from "@/features/login/ui/SecurityNotice";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthHeader />
        <LoginContainer />
        <DemoCredentials />
        <SecurityNotice />
      </div>
    </div>
  );
}
