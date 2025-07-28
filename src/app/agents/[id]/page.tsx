"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricCard } from "@/shared/ui/MetricCard";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import {
  ArrowLeft,
  RefreshCw,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Activity,
  Clock,
} from "lucide-react";
import Link from "next/link";
import type { Agent, LogEntry } from "@/shared/types";

// Mock data generators
const generateAgentDetails = (id: string): Agent => ({
  id,
  name: "Web Server 01",
  hostname: "web-01.example.com",
  ipAddress: "192.168.1.10",
  status: "online",
  lastSeen: new Date().toISOString(),
  os: "Ubuntu 22.04",
  arch: "x86_64",
  ownerId: "root",
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
});

const generateAgentLogs = (agentId: string): LogEntry[] => [
  {
    id: "1",
    agentId,
    timestamp: new Date().toISOString(),
    level: "info",
    message: "Agent heartbeat successful",
    source: "sentinel-agent",
  },
  {
    id: "2",
    agentId,
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    level: "warn",
    message: "High CPU usage detected: 85%",
    source: "system-monitor",
  },
  {
    id: "3",
    agentId,
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    level: "error",
    message: "Failed to connect to database",
    source: "application",
  },
];

export default function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const {
    data: agent,
    isLoading: agentLoading,
    refetch: refetchAgent,
  } = useQuery({
    queryKey: ["agent", id],
    queryFn: () => generateAgentDetails(id),
    refetchInterval: 10000,
  });

  const { data: logs, isLoading: logsLoading } = useQuery({
    queryKey: ["agent-logs", id],
    queryFn: () => generateAgentLogs(id),
    refetchInterval: 30000,
  });

  if (agentLoading) {
    return (
      <div className="text-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Loading agent details...</p>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Agent not found</p>
        <Link href="/agents">
          <Button className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Agents
          </Button>
        </Link>
      </div>
    );
  }

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

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "text-red-600";
      case "warn":
        return "text-yellow-600";
      case "info":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/agents">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Agents
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{agent.name}</h1>
            <p className="text-gray-600">
              {agent.hostname} • {agent.ipAddress}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <StatusBadge status={getStatusVariant(agent.status)} />
          <Button onClick={() => refetchAgent()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Agent Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className="text-2xl font-bold capitalize">{agent.status}</p>
              </div>
              <Activity
                className={`h-8 w-8 ${
                  agent.status === "online" ? "text-green-500" : "text-red-500"
                }`}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-2xl font-bold">
                  {agent.metrics
                    ? Math.floor(agent.metrics.uptime / 3600) + "h"
                    : "N/A"}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Version</p>
                <p className="text-2xl font-bold">{agent.version}</p>
              </div>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {agent.os}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Seen</p>
                <p className="text-sm font-bold">
                  {new Date(agent.lastSeen).toLocaleString()}
                </p>
              </div>
              <RefreshCw className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metrics */}
      {agent.metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="CPU Usage"
            value={agent.metrics.cpu}
            icon={<Cpu className="h-4 w-4 text-muted-foreground" />}
            status={
              agent.metrics.cpu > 80
                ? "error"
                : agent.metrics.cpu > 60
                ? "warning"
                : "healthy"
            }
          />
          <MetricCard
            title="Memory Usage"
            value={agent.metrics.memory}
            icon={<MemoryStick className="h-4 w-4 text-muted-foreground" />}
            status={
              agent.metrics.memory > 80
                ? "error"
                : agent.metrics.memory > 60
                ? "warning"
                : "healthy"
            }
          />
          <MetricCard
            title="Disk Usage"
            value={agent.metrics.disk}
            icon={<HardDrive className="h-4 w-4 text-muted-foreground" />}
            status={
              agent.metrics.disk > 80
                ? "error"
                : agent.metrics.disk > 60
                ? "warning"
                : "healthy"
            }
          />
          <MetricCard
            title="Network Usage"
            value={agent.metrics.network}
            icon={<Network className="h-4 w-4 text-muted-foreground" />}
            status={
              agent.metrics.network > 80
                ? "error"
                : agent.metrics.network > 60
                ? "warning"
                : "healthy"
            }
          />
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">Recent Logs</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Recent Logs</CardTitle>
              <CardDescription>
                Latest log entries from this agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <div className="text-center py-4">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Loading logs...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {logs?.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start space-x-3 p-3 rounded-lg border"
                    >
                      <Badge
                        variant="outline"
                        className={getLevelColor(log.level)}
                      >
                        {log.level.toUpperCase()}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {log.message}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {log.source}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Agent Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Agent ID
                  </label>
                  <p className="text-sm text-gray-900">{agent.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    PEM Key ID
                  </label>
                  <p className="text-sm text-gray-900">{agent.pemKeyId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Architecture
                  </label>
                  <p className="text-sm text-gray-900">{agent.arch}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Owner
                  </label>
                  <p className="text-sm text-gray-900">{agent.ownerId}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {agent.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>
                Agent configuration and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium mb-2">
                    Agent Configuration:
                  </p>
                  <pre className="text-xs bg-black text-green-400 p-3 rounded overflow-x-auto">
                    {`{
  "agentId": "${agent.id}",
  "serverUrl": "https://sentinel.example.com",
  "metricsInterval": 30,
  "logLevel": "info",
  "tags": ${JSON.stringify(agent.tags, null, 2)}
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
