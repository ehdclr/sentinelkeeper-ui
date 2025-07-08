import { safeApiFetch } from '@/shared/api/client'
import { DatabaseConfig } from '@/entities/database/model'

export async function getSetupExamples() {
  return safeApiFetch<Record<string, DatabaseConfig>>('/setup/examples')
}