"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { Search, Server, Eye, Trash2, RefreshCw } from "lucide-react";
import type { Agent } from "@/features/agents/model/types";
import { useAuthStore } from "@/shared/store/authStore";
import Link from "next/link";
// import { useAgents, useCreateAgent } from "@/features/agents/model/queries"
// import { AgentsPageHeader } from "@/components/AgentsPageHeader";
// import { AgentsList } from "@/components/AgentsList";
// import { AgentRegistrationForm } from "@/components/AgentRegistrationForm";
// import type {CreateAgentResponse} from "@/features/agents/model/types"

const generateAgents = (): Agent[] => [
  {
    id: "1",
    name: "Web Server 01",
    hostname: "web-01.example.com",
    ipAddress: "192.168.1.10",
    status: "online",
    lastSeen: new Date().toISOString(),
    os: "Ubuntu 22.04",
    arch: "x86_64",
    ownerId: "root",
    pemKeyId: "key-1",
    tags: ["production", "web"],
    metrics: {
      cpu: 45.2,
      memory: 67.8,
      disk: 23.1,
      network: 12.5,
      processes: 156,
      uptime: 86400,
      timestamp: new Date().toISOString(),
    },
    isPublic: true,
  },
  {
    id: "2",
    name: "Database Server",
    hostname: "db-01.example.com",
    ipAddress: "192.168.1.20",
    status: "online",
    lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    os: "CentOS 8",
    arch: "x86_64",
    ownerId: "root",
    pemKeyId: "key-1",
    tags: ["production", "database"],
    metrics: {
      cpu: 78.9,
      memory: 89.2,
      disk: 45.6,
      network: 34.7,
      processes: 89,
      uptime: 172800,
      timestamp: new Date().toISOString(),
    },
    isPublic: true,
  },
  {
    id: "3",
    name: "API Gateway",
    hostname: "api-01.example.com",
    ipAddress: "192.168.1.30",
    status: "error",
    lastSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    os: "CentOS 8",
    arch: "x86_64",
    ownerId: "root",
    pemKeyId: "key-1",
    tags: ["production", "api"],
    metrics: {
      cpu: 95.1,
      memory: 92.3,
      disk: 78.9,
      network: 67.4,
      processes: 234,
      uptime: 43200,
      timestamp: new Date().toISOString(),
    },
    isPublic: false,
  },
];

const AgentsPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<string | null>(
    null
  );
  const { user } = useAuthStore();

  //TODO react Query 훅

  //TODO 계산된 값들
  const agents = generateAgents() || []; //TODO 데이터 fetch 후 변경
  const totalAgents = agents.length || 0;
  const onlineAgents =
    agents.filter((agent) => agent.status === "online").length || 0;

  //TODO 이벤트 핸들러
  const handleCreateAgent = async (name: string) => {
    try {
      const result = await createAgentMutation.mutateAsync({ name });
      setRegistrationResult(result);
    } catch (err) {
      console.error("Failed to create agent:", err);
    }
  };

  const handleViewAgent = (agentId: string) => {
    router.push(`/agents/${agentId}`);
  };

  const handleResetRegistration = () => {
    setRegistrationResult(null);
  };

  const handleRefresh = () => {
    refetch();
  };

  const filteredAgents =
    agents?.filter((agent) => {
      const matchesSearch =
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.hostname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.ipAddress.includes(searchTerm);

      // Filter by ownership for non-root users
      if (!user?.isSystemRoot) {
        return matchesSearch && agent.ownerId === user?.id;
      }

      return matchesSearch;
    }) || [];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "online":
        return "healthy";
      case "offline":
        return "warning";
      case "error":
        return "error";
      default:
        return "warning";
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}

      {/* 에이전트 등록 폼 */}

      {/* 에이전트 목록 */}

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>
            Agents (TOTAL AGENTS : {totalAgents})
          </CardTitle>
          <CardDescription>
            {user?.isSystemRoot
              ? "All system agents are visible"
              : "Only your agents are visible"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {false ? (
            <div className="text-center py-6">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Refreshing agents...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Metrics</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Server className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-sm text-gray-500">
                            {agent.hostname} • {agent.ipAddress}
                          </div>
                          <div className="text-xs text-gray-400">
                            {agent.os} • {agent.arch}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={getStatusVariant(agent.status)} />
                    </TableCell>
                    <TableCell>
                      {agent.metrics ? (
                        <div className="text-sm">
                          <div>CPU: {agent.metrics.cpu.toFixed(1)}%</div>
                          <div>Memory: {agent.metrics.memory.toFixed(1)}%</div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No metrics available</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {agent.lastSeen ? new Date(agent.lastSeen).toLocaleString() : "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {agent.tags?.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Link href={`/agents/${agent.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {(user?.isSystemRoot ||
                          agent.ownerId === user?.id) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentsPage;
