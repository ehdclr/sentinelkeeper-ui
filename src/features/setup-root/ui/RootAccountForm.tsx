"use client";
// src/features/setup-root/ui/RootAccountForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RootFormSchema, RootAccountFormData } from "@/entities/setup/model";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Key, Download, User } from "lucide-react";

interface RootAccountFormProps {
  onSubmit: (data: RootAccountFormData) => void;
  isLoading?: boolean;
  error?: Error | null;
  accountExists?: boolean;
}

export function RootAccountForm({
  onSubmit,
  isLoading,
  error,
  accountExists,
}: RootAccountFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RootAccountFormData>({
    resolver: zodResolver(RootFormSchema),
    mode: "onChange",
    defaultValues: { username: "root", password: "", email: "" },
  });


  if (accountExists) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-green-600" />
            Root Account Status
          </CardTitle>
          <CardDescription>
            Root administrator account configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Download className="h-4 w-4" />
            <AlertDescription>
              Root administrator account already exists and is configured.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Create Root Account
        </CardTitle>
        <CardDescription>
          Create the primary administrator account for Sentinel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* username은 고정, disabled */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value="root"
              disabled
              readOnly
            />
            <input type="hidden" value="root" {...register("username")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter secure password"
              {...register("password")}
              className={errors.password ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-500">
                8자 이상의 대문자, 소문자, 숫자를 포함해야 합니다.
              </p>
            )}
            <p className="text-xs text-gray-500">
              8자 이상의 대문자, 소문자, 숫자를 포함해야 합니다.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-500">
                이메일 형식이 올바르지 않습니다.
              </p>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription>
              PEM 파일이 자동으로 다운로드됩니다. 이 파일은 인증에 필요하므로
              안전하게 보관하세요.
            </AlertDescription>
          </Alert>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !isValid}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                계정 생성 중...
              </>
            ) : (
              <>
                <Key className="mr-2 h-4 w-4" />
                계정 생성 & PEM 다운로드
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
