// Database Types
export interface DatabaseConfig {
  type: "sqlite" | "postgres" | "mysql";
  host?: string;
  port?: number;
  database: string;
  username?: string;
  password?: string;
  ssl?: boolean;
  filePath?: string; // for sqlite
}

// Log Storage Types
export interface LogStorageConfig {
  type: "elasticsearch" | "mongodb" | "file";
  host?: string;
  port?: number;
  index?: string; // for elasticsearch
  database?: string; // for mongodb
  collection?: string; // for mongodb
  filePath?: string; // for file storage
  username?: string;
  password?: string;
}

// User & Auth Types
export interface User {
  id: string;
  username: string;
  email: string;
  role: "root" | "user";
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
  ownedAgents?: string[];
}

export interface PEMKey {
  id: string;
  name: string;
  publicKey: string;
  privateKey: string;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
  userId: string;
}

// Agent Types
export interface Agent {
  id: string;
  name: string;
  hostname: string;
  ipAddress: string;
  status: "online" | "offline" | "error";
  lastSeen: string;
  version: string;
  os: string;
  arch: string;
  ownerId: string;
  pemKeyId: string;
  tags: string[];
  metrics?: AgentMetrics;
}

export interface AgentMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  processes: number;
  uptime: number;
  timestamp: string;
}

// Log Types
export interface LogEntry {
  id: string;
  agentId: string;
  timestamp: string;
  level: "debug" | "info" | "warn" | "error" | "fatal";
  message: string;
  source: string;
  metadata?: Record<string, any>;
}

// Alert Types
export interface Alert {
  id: string;
  name: string;
  description: string;
  type: "metric" | "log" | "agent_status";
  condition: AlertCondition;
  isActive: boolean;
  createdAt: string;
  triggeredAt?: string;
  resolvedAt?: string;
  agentId?: string;
  userId: string;
}

export interface AlertCondition {
  metric?: string;
  operator: ">" | "<" | "=" | ">=" | "<=";
  threshold: number;
  duration: number; // in minutes
}

// Setup Types
export interface SetupState {
  isDatabaseConfigured: boolean;
  isRootAccountCreated: boolean;
  isLogStorageConfigured: boolean;
  isSetupComplete: boolean;
}

export interface SystemSettings {
  database: DatabaseConfig;
  logStorage: LogStorageConfig;
  security: {
    sessionTimeout: number;
    pemKeyExpiration: number;
    maxLoginAttempts: number;
  };
  monitoring: {
    metricsRetention: number; // days
    logsRetention: number; // days
    alertRetention: number; // days
  };
}
