import type {
  CreateAgentRequest,
  CreateAgentResponse,
  AgentsResponse,
  Agent,
} from "../model/types";

// Mock 데이터 생성기
const generateMockAgents = (): Agent[] => [
  {
    id: 1,
    name: "Web Server 01",
    hostname: "web-01.example.com",
    ipAddress: "192.168.1.10",
    status: "online",
    lastSeen: new Date().toISOString(),
    os: "Ubuntu 22.04",
    arch: "x86_64",
    ownerId: "root",
    tags: ["production", "web", "nginx"],
    isPublic: true,
    protocols: "http",
    metrics: {
      cpu: 45.2,
      memory: 67.8,
      disk: 23.1,
      network: 12.5,
      processes: 156,
      uptime: 86400,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: 2,
    name: "Database Server",
    hostname: "db-01.example.com",
    ipAddress: "192.168.1.20",
    status: "online",
    lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    os: "CentOS 8",
    arch: "x86_64",
    ownerId: "root",
    tags: ["production", "database", "postgresql"],
    isPublic: false,
    protocols: "http",
    metrics: {
      cpu: 78.9,
      memory: 89.2,
      disk: 45.6,
      network: 34.7,
      processes: 89,
      uptime: 172800,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: 3,
    name: "API Gateway",
    hostname: "api-01.example.com",
    ipAddress: "192.168.1.30",
    status: "error",
    lastSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    os: "Ubuntu 20.04",
    arch: "x86_64",
    ownerId: "user1",
    tags: ["production", "api", "gateway"],
    isPublic: true,
    protocols: "grpc",
    metrics: {
      cpu: 95.1,
      memory: 92.3,
      disk: 78.9,
      network: 67.4,
      processes: 234,
      uptime: 43200,
      timestamp: new Date().toISOString(),
    },
  },
];

export const agentsApi = {
  // 에이전트 목록 조회 (Mock 데이터 사용)
  getAgents: async (): Promise<AgentsResponse> => {
    // 실제 API 호출 대신 Mock 데이터 반환
    await new Promise((resolve) => setTimeout(resolve, 500)); // 로딩 시뮬레이션

    const agents = generateMockAgents();
    return {
      success: true,
      agents,
      total: agents.length,
    };
  },

  // 새 에이전트 등록 (Mock 응답)
  createAgent: async (
    data: CreateAgentRequest
  ): Promise<CreateAgentResponse> => {
    // 실제 API 호출 대신 Mock 응답 반환
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 로딩 시뮬레이션

    const newAgent: Agent = {
      id: 3,
      name: "API Gateway",
      hostname: "api-01.example.com",
      ipAddress: "192.168.1.30",
      status: "error",
      lastSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      os: "Ubuntu 20.04",
      arch: "x86_64",
      ownerId: "user1",
      tags: ["production", "api", "gateway"],
      isPublic: true,
      protocols: "grpc",
      metrics: {
        cpu: 95.1,
        memory: 92.3,
        disk: 78.9,
        network: 67.4,
        processes: 234,
        uptime: 43200,
        timestamp: new Date().toISOString(),
      },
    };

    const token = `sentinel_${Math.random().toString(36).substring(2, 15)}`;
    const installScript = `#!/bin/bash
# Sentinel Agent Installation Script
# Generated on: ${new Date().toISOString()}

echo "Installing Sentinel Agent..."
curl -sSL https://sentinel.example.com/agent/install.sh | bash -s -- \\
  --token="${token}" \\
  --name="${data.name}" \\
  --environment="production" \\
  --tags="production,web,nginx"

echo "Agent registration complete!"
echo "Agent ID: ${newAgent.id}"
echo "Token: ${token}"
echo "Please keep this token secure - it will not be shown again."
`;

    return {
      success: true,
      agent: newAgent,
      token,
      installScript,
    };
  },
};
