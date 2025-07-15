export interface RecoveryRequest {
  id: string
  pemKeyId: string
  requestedAt: string
  expiresAt: string
  isUsed: boolean
  ipAddress: string
  userAgent: string
}

export interface PEMKeyValidation {
  isValid: boolean
  keyId?: string
  userId?: string
  error?: string
}

export interface RecoverySession {
  token: string
  userId: string
  expiresAt: string
  canChangePassword: boolean
  canAccessAdmin: boolean
}
