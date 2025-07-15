"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, RefreshCw, CheckCircle, AlertTriangle, AlertCircle, XCircle, Filter } from "lucide-react"
import type { SystemEvent } from "@/shared/types"
import { useAuthStore } from "@/shared/store/authStore"

// Mock data generator
const generateEvents = (): SystemEvent[] => [
  {
    id: "1",
    title: "High CPU Usage Detected",
    description: "CPU usage exceeded 80% threshold on web-01.example.com",
    severity: "high",
    type: "metric",
    source: "agent-1",
    agentId: "agent-1",
    ruleId: "rule-1",
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    metadata: {
      metric: "cpu",
      value: 85.2,
      threshold: 80,
      hostname: "web-01.example.com",
    },
    isResolved: false,
  },
  {
    id: "2",
    title: "Application Error Detected",
    description: "Multiple ERROR level logs detected from application service",
    severity: "medium",
    type: "log",
    source: "agent-2",
    agentId: "agent-2",
    ruleId: "rule-2",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    metadata: {
      logCount: 15,
      timeWindow: "10 minutes",
      source: "application",
    },
    isResolved: true,
    resolvedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    resolvedBy: "admin",
  },
  {
    id: "3",
    title: "Kubernetes Pod Failure",
    description: "Pod 'api-deployment-xyz' failed to start in production namespace",
    severity: "critical",
    type: "kubernetes",
    source: "agent-1",
    agentId: "agent-1",
    ruleId: "rule-3",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    metadata: {
      namespace: "production",
      pod: "api-deployment-xyz",
      reason: "ImagePullBackOff",
      message: "Failed to pull image: registry.example.com/api:latest",
    },
    isResolved: false,
  },
  {
    id: "4",
    title: "Database Connection Lost",
    description: "Database connection pool exhausted on db-01.example.com",
    severity: "critical",
    type: "system",
    source: "agent-2",
    agentId: "agent-2",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    metadata: {
      connectionPool: "exhausted",
      maxConnections: 100,
      activeConnections: 100,
    },
    isResolved: true,
    resolvedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    resolvedBy: "admin",
  },
  {
    id: "5",
    title: "Memory Usage Warning",
    description: "Memory usage approaching 90% on web-02.example.com",
    severity: "medium",
    type: "metric",
    source: "agent-3",
    agentId: "agent-3",
    ruleId: "rule-4",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    metadata: {
      metric: "memory",
      value: 88.5,
      threshold: 90,
      hostname: "web-02.example.com",
    },
    isResolved: false,
  },
]

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const { user } = useAuthStore()

  const {
    data: events,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["events", searchTerm, severityFilter, statusFilter, typeFilter],
    queryFn: () => generateEvents(),
    refetchInterval: 30000,
  })

  const filteredEvents =
    events?.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSeverity = severityFilter === "all" || event.severity === severityFilter
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "resolved" && event.isResolved) ||
        (statusFilter === "unresolved" && !event.isResolved)
      const matchesType = typeFilter === "all" || event.type === typeFilter

      return matchesSearch && matchesSeverity && matchesStatus && matchesType
    }) || []

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "high":
        return <AlertCircle className="h-5 w-5 text-orange-500" />
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "low":
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "log":
        return "bg-green-100 text-green-800 border-green-200"
      case "metric":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "kubernetes":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "system":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const resolveEvent = (eventId: string) => {
    console.log("Resolving event:", eventId)
    refetch()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Events</h1>
          <p className="text-gray-600">Monitor and manage system events and alerts</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
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
                  placeholder="Search events by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unresolved">Unresolved</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="log">Log</SelectItem>
                  <SelectItem value="metric">Metric</SelectItem>
                  <SelectItem value="kubernetes">Kubernetes</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Events ({filteredEvents.length})</CardTitle>
          <CardDescription>System events and alerts from your monitoring rules</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Loading events...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div className="flex items-start space-x-3">
                        {getSeverityIcon(event.severity)}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900">{event.title}</div>
                          <div className="text-sm text-gray-500 mt-1">{event.description}</div>
                          {event.metadata && (
                            <div className="text-xs text-gray-400 mt-1">
                              {Object.entries(event.metadata)
                                .slice(0, 3)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(" • ")}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(event.severity)} variant="outline">
                        {event.severity.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(event.type)} variant="outline">
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{event.source}</div>
                        {event.agentId && <div className="text-gray-500">Agent: {event.agentId}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {event.isResolved ? (
                        <div className="text-sm">
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Resolved
                          </Badge>
                          {event.resolvedAt && (
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(event.resolvedAt).toLocaleString()}
                            </div>
                          )}
                          {event.resolvedBy && <div className="text-xs text-gray-500">by {event.resolvedBy}</div>}
                        </div>
                      ) : (
                        <Badge variant="destructive">Unresolved</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(event.timestamp).toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {!event.isResolved && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => resolveEvent(event.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Filter className="h-4 w-4" />
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
    </div>
  )
}
