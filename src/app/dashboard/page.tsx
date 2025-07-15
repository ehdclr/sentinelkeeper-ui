"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/shared/components/PageHeader"
import { Activity, Server, AlertTriangle, FileText, RefreshCw, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import Link from "next/link"
import { useAuthStore } from "@/shared/store/authStore"

// Mock data generators
const generateQuickStats = () => ({
  totalAgents: 12,
  activeAgents: 10,
  totalEvents: 45,
  criticalEvents: 3,
  todayLogs: 15420,
  systemHealth: "healthy" as const,
  trends: {
    agents: 2,
    events: -5,
    logs: 1250,
  },
})

const generateRecentEvents = () => [
  {
    id: "1",
    title: "High CPU Usage",
    severity: "high" as const,
    agent: "web-01.example.com",
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    resolved: false,
  },
  {
    id: "2",
    title: "Memory Warning",
    severity: "medium" as const,
    agent: "db-01.example.com",
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    resolved: true,
  },
  {
    id: "3",
    title: "Disk Space Low",
    severity: "low" as const,
    agent: "api-01.example.com",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    resolved: false,
  },
]

const generateAgentHealth = () => [
  {
    id: "agent-1",
    name: "web-01.example.com",
    status: "online" as const,
    cpu: 45.2,
    memory: 67.8,
    disk: 23.1,
    lastSeen: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: "agent-2",
    name: "db-01.example.com",
    status: "online" as const,
    cpu: 78.9,
    memory: 89.2,
    disk: 45.6,
    lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "agent-3",
    name: "api-01.example.com",
    status: "warning" as const,
    cpu: 92.1,
    memory: 95.3,
    disk: 78.9,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
]

const generateChartData = () => {
  const data = []
  for (let i = 23; i >= 0; i--) {
    data.push({
      time: `${23 - i}:00`,
      logs: Math.floor(Math.random() * 1000) + 500,
      events: Math.floor(Math.random() * 50) + 10,
      agents: Math.floor(Math.random() * 3) + 8,
    })
  }
  return data
}

export default function DashboardPage() {
  const { user } = useAuthStore()

  const { data: quickStats, refetch: refetchStats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: generateQuickStats,
    refetchInterval: 30000,
  })

  const { data: recentEvents } = useQuery({
    queryKey: ["recent-events"],
    queryFn: generateRecentEvents,
    refetchInterval: 30000,
  })

  const { data: agentHealth } = useQuery({
    queryKey: ["agent-health"],
    queryFn: generateAgentHealth,
    refetchInterval: 15000,
  })

  const { data: chartData } = useQuery({
    queryKey: ["dashboard-charts"],
    queryFn: generateChartData,
    refetchInterval: 60000,
  })

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800 border-green-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "offline":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight className="h-4 w-4 text-green-600" />
    if (value < 0) return <ArrowDownRight className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-600" />
  }

  const headerActions = (
    <Button onClick={() => refetchStats()} variant="outline" size="sm">
      <RefreshCw className="h-4 w-4 mr-2" />
      Refresh
    </Button>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user?.username}! Here's what's happening with your system.`}
        breadcrumb={["Dashboard"]}
        actions={headerActions}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Agents</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold">{quickStats?.totalAgents || 0}</p>
                  {quickStats?.trends.agents && getTrendIcon(quickStats.trends.agents)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{quickStats?.activeAgents || 0} online</p>
              </div>
              <Server className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Events</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold">{quickStats?.totalEvents || 0}</p>
                  {quickStats?.trends.events && getTrendIcon(quickStats.trends.events)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{quickStats?.criticalEvents || 0} critical</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today&apos;s Logs</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold">{quickStats?.todayLogs?.toLocaleString() || 0}</p>
                  {quickStats?.trends.logs && getTrendIcon(quickStats.trends.logs)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  +{quickStats?.trends.logs?.toLocaleString() || 0} from yesterday
                </p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Health</p>
                <p className="text-2xl font-bold capitalize">{quickStats?.systemHealth || "Unknown"}</p>
                <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Overview</CardTitle>
              <CardDescription>System activity over the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="logs" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="logs">Logs</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                  <TabsTrigger value="agents">Agents</TabsTrigger>
                </TabsList>
                <TabsContent value="logs" className="space-y-4">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="logs" stroke="#3b82f6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                <TabsContent value="events" className="space-y-4">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="events" stroke="#f59e0b" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                <TabsContent value="agents" className="space-y-4">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="agents" stroke="#10b981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Events */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Recent Events</CardTitle>
              <Link href="/events">
                <Button variant="ghost" size="sm">
                  View all
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentEvents?.map((event) => (
                <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                  <Badge className={getSeverityColor(event.severity)} variant="outline">
                    {event.severity.toUpperCase()}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.agent}</p>
                    <p className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p>
                  </div>
                  {event.resolved && (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      Resolved
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Agent Health */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Agent Health</CardTitle>
              <Link href="/agents">
                <Button variant="ghost" size="sm">
                  View all
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {agentHealth?.map((agent) => (
                <div key={agent.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Last seen: {new Date(agent.lastSeen).toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(agent.status)} variant="outline">
                      {agent.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>CPU</span>
                      <span>{agent.cpu.toFixed(1)}%</span>
                    </div>
                    <Progress value={agent.cpu} className="h-1" />
                    <div className="flex items-center justify-between text-xs">
                      <span>Memory</span>
                      <span>{agent.memory.toFixed(1)}%</span>
                    </div>
                    <Progress value={agent.memory} className="h-1" />
                    <div className="flex items-center justify-between text-xs">
                      <span>Disk</span>
                      <span>{agent.disk.toFixed(1)}%</span>
                    </div>
                    <Progress value={agent.disk} className="h-1" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
