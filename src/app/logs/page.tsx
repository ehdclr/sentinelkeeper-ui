"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, RefreshCw } from "lucide-react"
import type { LogEntry } from "@/shared/types"
import { useAuthStore } from "@/shared/store/authStore"

// Mock data generator
const generateLogs = (): LogEntry[] => {
  const levels = ["debug", "info", "warn", "error", "fatal"] as const
  const sources = ["sentinel-agent", "system-monitor", "application", "database", "network"]
  const messages = [
    "Agent heartbeat successful",
    "High CPU usage detected",
    "Memory usage above threshold",
    "Disk space running low",
    "Network connectivity restored",
    "Database connection established",
    "Failed to connect to service",
    "Authentication successful",
    "Configuration updated",
    "Backup completed successfully",
  ]

  return Array.from({ length: 50 }, (_, i) => ({
    id: `log-${i + 1}`,
    agentId: `agent-${Math.floor(Math.random() * 3) + 1}`,
    timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    level: levels[Math.floor(Math.random() * levels.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    metadata: {
      pid: Math.floor(Math.random() * 10000),
      thread: `thread-${Math.floor(Math.random() * 10)}`,
    },
  }))
}

export default function LogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const { user } = useAuthStore()

  const {
    data: logs,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["logs", searchTerm, levelFilter, sourceFilter],
    queryFn: () => generateLogs(),
    refetchInterval: 30000,
  })

  const filteredLogs =
    logs?.filter((log) => {
      const matchesSearch =
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.source.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesLevel = levelFilter === "all" || log.level === levelFilter
      const matchesSource = sourceFilter === "all" || log.source === sourceFilter

      return matchesSearch && matchesLevel && matchesSource
    }) || []

  const getLevelColor = (level: string) => {
    switch (level) {
      case "fatal":
        return "bg-red-100 text-red-800 border-red-200"
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      case "warn":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "debug":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const exportLogs = () => {
    const csvContent = [
      ["Timestamp", "Level", "Source", "Message", "Agent ID"].join(","),
      ...filteredLogs.map((log) => [log.timestamp, log.level, log.source, `"${log.message}"`, log.agentId].join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `sentinel-logs-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Logs</h1>
          <p className="text-gray-600">Search and analyze system logs</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportLogs} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search logs by message or source..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="fatal">Fatal</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warn">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="sentinel-agent">Sentinel Agent</SelectItem>
                  <SelectItem value="system-monitor">System Monitor</SelectItem>
                  <SelectItem value="application">Application</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="network">Network</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Log Entries ({filteredLogs.length})</CardTitle>
          <CardDescription>{user?.role === "root" ? "All system logs" : "Logs from your agents"}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Loading logs...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Agent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">{new Date(log.timestamp).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getLevelColor(log.level)} variant="outline">
                        {log.level.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{log.source}</TableCell>
                    <TableCell className="max-w-md truncate">{log.message}</TableCell>
                    <TableCell className="font-mono text-sm">{log.agentId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
