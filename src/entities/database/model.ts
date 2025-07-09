import { z } from "zod";

export const DatabaseConfigSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("sqlite"),
    database: z.string().min(1, "Database name is required"),
  }),
  z.object({
    type: z.literal("postgres"),
    host: z.string().min(1, "Host is required"),
    port: z.number().min(1).max(65535, "Port must be between 1 and 65535"),
    username: z.string().min(1, "Username is required"),
    password: z.string().optional(),
    database: z.string().min(1, "Database name is required"),
    ssl: z.boolean().optional(),
  }),
  z.object({
    type: z.literal("mysql"),
    host: z.string().min(1, "Host is required"),
    port: z.number().min(1).max(65535, "Port must be between 1 and 65535"),
    username: z.string().min(1, "Username is required"),
    password: z.string().optional(),
    database: z.string().min(1, "Database name is required"),
    ssl: z.boolean().optional(),
  }),
]);

export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  details?: string[];
  statusCode: number;
  timestamp: string;
  path: string;
}

export interface DatabaseSetupStatus {
  configured: boolean;
  locked: boolean;
  type: "sqlite" | "postgres" | "mysql" | null;
  createdAt: string | null;
  configExists: boolean;
  lockExists: boolean;
}

export interface DatabaseHealthStatus {
  status: "healthy" | "unhealthy" | "setup_required";
  database: {
    type: string;
    configured: boolean;
    locked: boolean;
    configuredAt: string;
    connectionTest: {
      success: boolean;
      error: string | null;
    };
  } | null;
}
