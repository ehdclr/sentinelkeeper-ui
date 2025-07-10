import { apiFetch } from '@/shared/api/client'
import { DatabaseHealthStatus } from '@/entities/setup/model'

export async function getHealth() {
  return apiFetch<DatabaseHealthStatus>('/health')
}