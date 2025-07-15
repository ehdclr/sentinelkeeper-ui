"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Database, Server, Wifi, HardDrive, Cpu, MemoryStick, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface SystemStatus {
  database: {
    status: "online" | "offline" | "error"
    connections: number
    maxConnections: number
    responseTime: number
  }
  server: {
    status: "running" | "stopped" | "error"
    uptime: number
    cpu: number
    memory: number
    disk: number
  }
  network: {
    status: "connected" | "disconnected" | "error"
    latency: number
    bandwidth: number
  }
}

const fetchSystemStatus = async (): Promise<SystemStatus> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1200))

  return {
    database: {
      status: Math.random() > 0.1 ? "online" : "error",
      connections: Math.floor(Math.random() * 50) + 10,
      maxConnections: 100,
      responseTime: Math.floor(Math.random() * 50) + 5,
    },
    server: {
      status: Math.random() > 0.05 ? "running" : "error",
      uptime: Math.floor(Math.random() * 720) + 24, // 24-744 hours
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      disk: Math.random() * 100,
    },
    network: {
      status: Math.random() > 0.1 ? "connected" : "error",
      latency: Math.floor(Math.random() * 100) + 10,
      bandwidth: Math.random() * 1000,
    },
  }
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "online":
    case "running":
    case "connected":
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case "offline":
    case "stopped":
    case "disconnected":
      return <AlertCircle className="h-5 w-5 text-yellow-500" />
    case "error":
      return <XCircle className="h-5 w-5 text-red-500" />
    default:
      return <AlertCircle className="h-5 w-5 text-gray-500" />
  }
}

function StatusBadge({ status }: { status: string }) {
  const getVariant = (status: string) => {
    switch (status) {
      case "online":
      case "running":
      case "connected":
        return "default"
      case "offline":
      case "stopped":
      case "disconnected":
        return "secondary"
      case "error":
        return "destructive"
      default:
        return "outline"
    }
  }

  return <Badge variant={getVariant(status)}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
}

export function StatusContainer() {
  const {
    data: systemStatus,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["system-status"],
    queryFn: fetchSystemStatus,
    refetchInterval: 15000, // Refetch every 15 seconds
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Loading system information...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Error loading system information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-sm text-gray-600">Failed to load system status</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!systemStatus) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
        <CardDescription>Real-time system health monitoring</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Database Status */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Database</span>
            </div>
            <div className="flex items-center space-x-2">
              <StatusIcon status={systemStatus.database.status} />
              <StatusBadge status={systemStatus.database.status} />
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Connections</span>
              <span>
                {systemStatus.database.connections}/{systemStatus.database.maxConnections}
              </span>
            </div>
            <Progress
              value={(systemStatus.database.connections / systemStatus.database.maxConnections) * 100}
              className="h-2"
            />
            <div className="flex justify-between">
              <span className="text-gray-600">Response Time</span>
              <span>{systemStatus.database.responseTime}ms</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Server Status */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Server className="h-5 w-5 text-green-500" />
              <span className="font-medium">Server</span>
            </div>
            <div className="flex items-center space-x-2">
              <StatusIcon status={systemStatus.server.status} />
              <StatusBadge status={systemStatus.server.status} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="flex items-center space-x-1 mb-1">
                <Cpu className="h-4 w-4 text-orange-500" />
                <span className="text-gray-600">CPU</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>{systemStatus.server.cpu.toFixed(1)}%</span>
              </div>
              <Progress value={systemStatus.server.cpu} className="h-2" />
            </div>
            <div>
              <div className="flex items-center space-x-1 mb-1">
                <MemoryStick className="h-4 w-4 text-purple-500" />
                <span className="text-gray-600">Memory</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>{systemStatus.server.memory.toFixed(1)}%</span>
              </div>
              <Progress value={systemStatus.server.memory} className="h-2" />
            </div>
            <div>
              <div className="flex items-center space-x-1 mb-1">
                <HardDrive className="h-4 w-4 text-indigo-500" />
                <span className="text-gray-600">Disk</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>{systemStatus.server.disk.toFixed(1)}%</span>
              </div>
              <Progress value={systemStatus.server.disk} className="h-2" />
            </div>
            <div>
              <span className="text-gray-600">Uptime</span>
              <p className="font-medium">
                {Math.floor(systemStatus.server.uptime / 24)}d {systemStatus.server.uptime % 24}h
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Network Status */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Wifi className="h-5 w-5 text-cyan-500" />
              <span className="font-medium">Network</span>
            </div>
            <div className="flex items-center space-x-2">
              <StatusIcon status={systemStatus.network.status} />
              <StatusBadge status={systemStatus.network.status} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Latency</span>
              <p className="font-medium">{systemStatus.network.latency}ms</p>
            </div>
            <div>
              <span className="text-gray-600">Bandwidth</span>
              <p className="font-medium">{systemStatus.network.bandwidth.toFixed(1)} Mbps</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
