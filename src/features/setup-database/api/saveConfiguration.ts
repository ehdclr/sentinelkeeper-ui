import { safeApiFetch } from "@/shared/api/client";
import { DatabaseConfig } from "@/entities/database/model";

export async function saveConfiguration(config: DatabaseConfig) {
  return safeApiFetch("/setup/database", {
    method: "POST",
    body: JSON.stringify(config),
  });
}
