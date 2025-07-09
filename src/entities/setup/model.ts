import { z } from "zod";

export const SetupSchema = z.object({
  isSetupCompleted: z.boolean().optional(),
  rootAccountExists: z.boolean().optional(),
  databaseSetupStatus: z
    .object({
      configured: z.boolean(),
      locked: z.boolean(),
      type: z.enum(["sqlite", "postgres", "mysql"]),
      createdAt: z.string(),
      configExists: z.boolean(),
      lockExists: z.boolean(),
    })
    .optional(),
  databaseHealthStatus: z
    .object({
      status: z.enum(["healthy", "unhealthy", "setup_required"]),
      database: z.object({
        type: z.string(),
        configured: z.boolean(),
        locked: z.boolean(),
        configuredAt: z.string(),
        connectionTest: z.object({
          success: z.boolean(),
          error: z.string().nullable(),
        }),
      }),
    })
    .optional(),
});

export type Setup = z.infer<typeof SetupSchema>;

export interface RootAccountSetupStatus {
  exists: boolean;
  username?: string;
  createdAt?: string;
}

export interface RootAccountCreateRequest {
  username: string;
  password: string;
  email: string;
}

export interface RootAccountCreateResponse {
  success: boolean;
  pemFile: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface SetupStep {
  id: "database" | "root-account";
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}
