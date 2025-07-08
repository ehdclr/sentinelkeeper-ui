import { safeApiFetch } from '@/shared/api/client'
import { HealthStatus } from '@/entities/database/model'

export async function getHealth() {
  return safeApiFetch<HealthStatus>('/health')
}