"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DatabaseConfig,
  DatabaseConfigSchema,
} from "@/entities/setup/model";
import { Database, TestTube, Save, Loader2, Info } from "lucide-react";
import { DATABASE_DEFAULTS, DATABASE_TYPES } from "@/common/constants/database";

interface ConfigureDatabaseFormProps {
  onTestConnection: (config: DatabaseConfig) => void;
  onSaveConfiguration: (config: DatabaseConfig) => void;
  isTestLoading: boolean;
  isSaveLoading: boolean;
}

const hasFieldError = (errors: unknown, field: string): boolean => {
  return Boolean(
    errors && typeof errors === "object" && errors !== null && field in errors
  );
};

export function ConfigureDatabaseForm({
  onTestConnection,
  onSaveConfiguration,
  isTestLoading,
  isSaveLoading,
}: ConfigureDatabaseFormProps) {
  const form = useForm<DatabaseConfig>({
    resolver: zodResolver(DatabaseConfigSchema),
    defaultValues: DATABASE_DEFAULTS.sqlite,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const watchedType = watch("type");

  const handleDatabaseTypeChange = (newType: string) => {
    const defaults =
      DATABASE_DEFAULTS[newType as keyof typeof DATABASE_DEFAULTS];
    if (defaults) {
      Object.entries(defaults).forEach(([key, value]) => {
        setValue(key as keyof DatabaseConfig, value as never);
      });
    }
  };

  const onSubmit = (data: DatabaseConfig) => {
    onSaveConfiguration(data);
  };

  const onTest = () => {
    const data = form.getValues();
    try {
      const validatedData = DatabaseConfigSchema.parse(data);
      onTestConnection(validatedData);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const renderSqliteFields = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="database">Database File</Label>
        <Input {...register("database")} placeholder="app.db" />
        {errors.database && (
          <p className="text-sm text-red-500">{errors.database.message}</p>
        )}
      </div>
    </div>
  );

  const renderPostgresMysqlFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="host">Host</Label>
          <Input {...register("host")} placeholder="localhost" />
          {hasFieldError(errors, "host") && (
            <p className="text-sm text-red-500">
              {(errors as Record<string, { message?: string }>).host?.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="port">Port</Label>
          <Input
            {...register("port", { valueAsNumber: true })}
            type="number"
            placeholder={watchedType === "postgres" ? "5432" : "3306"}
          />
          {hasFieldError(errors, "port") && (
            <p className="text-sm text-red-500">
              {(errors as Record<string, { message?: string }>).port?.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            {...register("username")}
            placeholder={watchedType === "postgres" ? "postgres" : "root"}
          />
          {hasFieldError(errors, "username") && (
            <p className="text-sm text-red-500">
              {
                (errors as Record<string, { message?: string }>).username
                  ?.message
              }
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            {...register("password")}
            type="password"
            placeholder="Optional"
          />
          {hasFieldError(errors, "password") && (
            <p className="text-sm text-red-500">
              {
                (errors as Record<string, { message?: string }>).password
                  ?.message
              }
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="database">Database Name</Label>
        <Input {...register("database")} placeholder="myapp" />
        {errors.database && (
          <p className="text-sm text-red-500">{errors.database.message}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Database Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              This configuration can only be set once and cannot be changed
              later.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Database Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="type">Database Type</Label>
              <Select
                value={watchedType}
                onValueChange={handleDatabaseTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select database type" />
                </SelectTrigger>
                <SelectContent>
                  {DATABASE_TYPES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <Separator />

            {/* Database-specific fields */}
            {watchedType === "sqlite" && renderSqliteFields()}
            {(watchedType === "postgres" || watchedType === "mysql") &&
              renderPostgresMysqlFields()}

            <Separator />

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={onTest}
                disabled={isTestLoading || isSaveLoading}
              >
                {isTestLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <TestTube className="h-4 w-4 mr-2" />
                )}
                Test Connection
              </Button>

              <Button
                type="submit"
                disabled={isTestLoading || isSaveLoading}
                className="flex-1"
              >
                {isSaveLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Configuration
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
