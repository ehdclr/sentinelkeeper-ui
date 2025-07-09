export interface User {
  id: string
  username: string
  email: string
  role: "root" | "admin" | "user"
  isActive: boolean
  isSystemAdmin: boolean
  // image?: string
  // active?: boolean
  // createdAt?: string
  // lastLogin?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  token?: string
}

export interface LoginCredentials {
  username: string
  password: string
}
