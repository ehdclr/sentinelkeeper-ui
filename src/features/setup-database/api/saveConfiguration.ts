import { apiFetch } from "@/shared/api/client";
import { DatabaseConfig } from "@/entities/setup/model";

export async function saveConfiguration(config: DatabaseConfig) {
  return apiFetch("/setup/database", {
    method: "POST",
    body: JSON.stringify(config),
  });
}
