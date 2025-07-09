"use client";

import type React from "react";

import { useState } from "react";
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
import type { RootAccountCreateRequest } from "@/entities/setup/model";

interface RootAccountFormProps {
  onSubmit: (data: RootAccountCreateRequest) => void;
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
  const [formData, setFormData] = useState<RootAccountCreateRequest>({
    username: "",
    password: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange =
    (field: keyof RootAccountCreateRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="admin"
              value={formData.username}
              onChange={handleInputChange("username")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter secure password"
              value={formData.password}
              onChange={handleInputChange("password")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={handleInputChange("email")}
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription>
              A PEM file will be automatically downloaded after account
              creation. Keep this file secure as it&apos;s required for
              authentication.
            </AlertDescription>
          </Alert>

          <Button
            type="submit"
            className="w-full"
            disabled={
              isLoading ||
              !formData.username ||
              !formData.password ||
              !formData.email
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <Key className="mr-2 h-4 w-4" />
                Create Account & Download PEM
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
