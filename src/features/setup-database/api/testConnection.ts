import { apiFetch } from "@/shared/api/client";
import { DatabaseConfig } from "@/entities/database/model";

export async function testConnection(config: DatabaseConfig) {
  return apiFetch("/setup/test-connection", {
    method: "POST",
    body: JSON.stringify(config),
  });
  
}
