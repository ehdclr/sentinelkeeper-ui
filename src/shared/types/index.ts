// Database Types
export interface DatabaseConfig {
  type: "sqlite" | "postgres" | "mysql"
  host?: string
  port?: number
  database: string
  username?: string
  password?: string
  ssl?: boolean
  filePath?: string // for sqlite
}

// Log Storage Types
export interface LogStorageConfig {
  type: "elasticsearch" | "mongodb" | "file"
  host?: string
  port?: number
  index?: string // for elasticsearch
  database?: string // for mongodb
  collection?: string // for mongodb
  filePath?: string // for file storage
  username?: string
  password?: string
}

// User & Auth Types
export interface User {
  id: string
  username: string
  email: string
  role: "root" | "user"
  createdAt: string
  lastLogin?: string
  isActive: boolean
  ownedAgents?: string[]
}


export interface PEMKey {
  id: string
  name: string
  publicKey: string
  privateKey: string
  createdAt: string
  expiresAt?: string
  isActive: boolean
  userId: string
  agentIds: string[]
}

// Agent Types
export interface Agent {
  id: string
  name: string
  hostname: string
  ipAddress: string
  status: "online" | "offline" | "error"
  lastSeen: string
  version: string
  os: string
  arch: string
  ownerId: string
  pemKeyId: string
  tags: string[]
  protocols: ("http" | "grpc" | "websocket")[]
  config: AgentConfig
  metrics?: AgentMetrics
}

export interface AgentConfig {
  metricsInterval: number // seconds
  logLevel: "debug" | "info" | "warn" | "error"
  bufferSize: number // MB
  retryAttempts: number
  enableKubernetes: boolean
  customFields: Record<string, any>
}

export interface AgentMetrics {
  cpu: number
  memory: number
  disk: number
  network: number
  processes: number
  uptime: number
  timestamp: string
  kubernetes?: KubernetesMetrics
}

export interface KubernetesMetrics {
  pods: number
  services: number
  deployments: number
  nodes: number
  events: KubernetesEvent[]
}

export interface KubernetesEvent {
  id: string
  type: string
  reason: string
  message: string
  namespace: string
  object: string
  timestamp: string
  severity: "normal" | "warning" | "error"
}

// Log Types
export interface LogEntry {
  id: string
  agentId: string
  timestamp: string
  level: "debug" | "info" | "warn" | "error" | "fatal"
  message: string
  source: string
  metadata?: Record<string, any>
  kubernetes?: {
    namespace?: string
    pod?: string
    container?: string
  }
  raw?: string
}

// Rule Types
export interface Rule {
  id: string
  name: string
  description: string
  type: "log" | "metric" | "kubernetes"
  isActive: boolean
  agentIds: string[] // empty means all agents
  condition: RuleCondition
  actions: RuleAction[]
  createdAt: string
  updatedAt: string
  userId: string
  lastTriggered?: string
  triggerCount: number
}

export interface RuleCondition {
  // Log conditions
  logLevel?: ("debug" | "info" | "warn" | "error" | "fatal")[]
  logMessage?: {
    contains?: string
    regex?: string
    equals?: string
  }
  logSource?: string[]

  // Metric conditions
  metric?: string
  operator?: ">" | "<" | "=" | ">=" | "<="
  threshold?: number
  duration?: number // minutes

  // Kubernetes conditions
  kubernetesType?: string[]
  kubernetesNamespace?: string[]
  kubernetesSeverity?: ("normal" | "warning" | "error")[]

  // Time conditions
  timeWindow?: number // minutes
  frequency?: number // max triggers per time window

  // Custom JSON condition
  customCondition?: string // JSON string for complex conditions
}

export interface RuleAction {
  type: "email" | "slack" | "webhook" | "create_event"
  config: {
    // Email action
    to?: string[]
    subject?: string
    template?: string

    // Slack action
    channel?: string
    webhook?: string
    username?: string

    // Webhook action
    url?: string
    method?: "POST" | "PUT" | "PATCH"
    headers?: Record<string, string>
    payload?: string

    // Event action
    severity?: "low" | "medium" | "high" | "critical"
    title?: string
    description?: string
  }
}

// Event Types
export interface SystemEvent {
  id: string
  title: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  type: "log" | "metric" | "kubernetes" | "system"
  source: string
  agentId?: string
  ruleId?: string
  timestamp: string
  metadata?: Record<string, any>
  isResolved: boolean
  resolvedAt?: string
  resolvedBy?: string
}

// Metric Types
export interface MetricSeries {
  id: string
  name: string
  agentId: string
  type: "gauge" | "counter" | "histogram"
  unit: string
  tags: Record<string, string>
  dataPoints: MetricDataPoint[]
}

export interface MetricDataPoint {
  timestamp: string
  value: number
  labels?: Record<string, string>
}

// Setup Types
export interface SetupState {
  isDatabaseConfigured: boolean
  isRootAccountCreated: boolean
  isLogStorageConfigured: boolean
  isSetupComplete: boolean
}

export interface SystemSettings {
  database: DatabaseConfig
  logStorage: LogStorageConfig
  security: {
    sessionTimeout: number
    pemKeyExpiration: number
    maxLoginAttempts: number
  }
  monitoring: {
    metricsRetention: number // days
    logsRetention: number // days
    alertRetention: number // days
  }
  notifications: {
    email: {
      enabled: boolean
      smtp: {
        host: string
        port: number
        username: string
        password: string
        tls: boolean
      }
      from: string
    }
    slack: {
      enabled: boolean
      defaultWebhook: string
    }
  }
}
