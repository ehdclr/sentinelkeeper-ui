import { safeApiFetch } from "@/shared/api/client";
import { SetupStatus } from "@/entities/database/model";

export async function getSetupStatus() {
  return safeApiFetch<SetupStatus>("/setup/status");
}
