import { safeApiFetch } from "@/shared/api/client";
import { DatabaseConfig } from "@/entities/database/model";

export async function testConnection(config: DatabaseConfig) {
  return safeApiFetch("/setup/test-connection", {
    method: "POST",
    body: JSON.stringify(config),
  });
  
}
