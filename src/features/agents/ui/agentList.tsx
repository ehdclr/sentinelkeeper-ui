"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/shared/ui/StatusBadge"
import { Server, Eye, Trash2, RefreshCw, Globe, Lock } from "lucide-react"
import type { Agent } from "../model/types"
import { getEnvironmentColor, formatUptime } from "../lib/utils"

interface AgentsListProps {
  agents: Agent[]
  isLoading: boolean
  onRefresh: () => void
  onViewAgent: (agentId: string) => void
}

export function AgentsList({ agents, isLoading, onRefresh, onViewAgent }: AgentsListProps) {
  const getStatusVariant = (status: Agent["status"]) => {
    switch (status) {
      case "online":
        return "healthy"
      case "offline":
        return "warning"
      case "error":
        return "error"
      default:
        return "warning"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Loading agents...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Registered Agents ({agents.length})</CardTitle>
          <CardDescription>Monitor and manage your infrastructure agents</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {agents.length === 0 ? (
          <div className="text-center py-8">
            <Server className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-2">No agents registered yet</p>
            <p className="text-sm text-gray-500">Register your first agent to start monitoring</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Metrics</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Server className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{agent.name}</span>
                          {agent.isPublic ? (
                            <Globe className="h-4 w-4 text-blue-600"/>
                          ) : (
                            <Lock className="h-4 w-4 text-gray-600"/>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {agent.hostname} • {agent.ipAddress}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getEnvironmentColor(agent?.environment || "production")}>{agent?.environment || "production"}</Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={getStatusVariant(agent.status)} />
                  </TableCell>
                  <TableCell>
                    {agent.metrics ? (
                      <div className="text-sm space-y-1">
                        <div>CPU: {agent.metrics.cpu.toFixed(1)}%</div>
                        <div>Memory: {agent.metrics.memory.toFixed(1)}%</div>
                        <div className="text-xs text-gray-500">Uptime: {formatUptime(agent.metrics.uptime)}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No data</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{new Date(agent.lastSeen || "").toLocaleString()}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {agent.tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {agent.tags?.length && agent.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{agent.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => onViewAgent(agent.id.toString())}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
