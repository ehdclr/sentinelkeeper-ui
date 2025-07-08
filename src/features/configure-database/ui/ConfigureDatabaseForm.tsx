"use client";

import { useState } from "react";
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
} from "@/entities/database/model";
import { Database, TestTube, Save, Loader2, Info } from "lucide-react";

interface ConfigureDatabaseFormProps {
  examples: Record<string, DatabaseConfig> | null;
  onTestConnection: (config: DatabaseConfig) => void;
  onSaveConfiguration: (config: DatabaseConfig) => void;
  isTestLoading: boolean;
  isSaveLoading: boolean;
}

export function ConfigureDatabaseForm({
  examples,
  onTestConnection,
  onSaveConfiguration,
  isTestLoading,
  isSaveLoading,
}: ConfigureDatabaseFormProps) {
  const [selectedType, setSelectedType] = useState<string>("sqlite");

  const form = useForm<DatabaseConfig>({
    resolver: zodResolver(DatabaseConfigSchema),
    defaultValues: {
      type: "sqlite",
      database: "app.db",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const watchedType = watch("type");

  const loadExample = (type: string) => {
    if (!examples || !examples[type]) return;

    const example = examples[type];
    Object.entries(example).forEach(([key, value]) => {
      setValue(key as any, value as any);
    });
    setSelectedType(type);
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
                onValueChange={(value) => {
                  setValue("type", value as any);
                  setSelectedType(value as any);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select database type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sqlite">SQLite</SelectItem>
                  <SelectItem value="postgres">PostgreSQL</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            {/* Quick Examples */}
            {examples && (
              <div className="space-y-2">
                <Label>Quick Examples</Label>
                <div className="flex space-x-2">
                  {Object.keys(examples).map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => loadExample(type)}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* SQLite Fields */}
            {watchedType === "sqlite" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="database">Database File</Label>
                  <Input {...register("database")} placeholder="app.db" />
                  {errors.database && (
                    <p className="text-sm text-red-500">
                      {errors.database.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* PostgreSQL/MySQL Fields */}
            {(watchedType === "postgres" || watchedType === "mysql") && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="host">Host</Label>
                    <Input {...register("host")} placeholder="localhost" />
                    {errors.root?.host && (
                      <p className="text-sm text-red-500">
                        {errors.root.host.message}
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
                    {errors.root?.port && (
                      <p className="text-sm text-red-500">
                        {errors.root.port.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Input
                      {...register("username")}
                      placeholder={
                        watchedType === "postgres" ? "postgres" : "root"
                      }
                    />
                    {errors.root?.username && (
                      <p className="text-sm text-red-500">
                        {errors.root.username.message}
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
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="database">Database Name</Label>
                  <Input {...register("database")} placeholder="myapp" />
                  {errors.database && (
                    <p className="text-sm text-red-500">
                      {errors.database.message}
                    </p>
                  )}
                </div>
              </div>
            )}

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
