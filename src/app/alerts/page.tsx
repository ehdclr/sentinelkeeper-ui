"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, AlertTriangle, CheckCircle, Clock, RefreshCw, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { Alert } from "@/shared/types"
import { useAuthStore } from "@/shared/store/authStore"

const alertSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["metric", "log", "agent_status"]),
  metric: z.string().optional(),
  operator: z.enum([">", "<", "=", ">=", "<="]),
  threshold: z.number().min(0),
  duration: z.number().min(1),
  agentId: z.string().optional(),
})

type AlertFormData = z.infer<typeof alertSchema>

// Mock data generator
const generateAlerts = (): Alert[] => [
  {
    id: "1",
    name: "High CPU Usage",
    description: "Alert when CPU usage exceeds 80%",
    type: "metric",
    condition: {
      metric: "cpu",
      operator: ">",
      threshold: 80,
      duration: 5,
    },
    isActive: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    triggeredAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    agentId: "agent-1",
    userId: "root",
  },
  {
    id: "2",
    name: "Memory Warning",
    description: "Alert when memory usage exceeds 90%",
    type: "metric",
    condition: {
      metric: "memory",
      operator: ">",
      threshold: 90,
      duration: 3,
    },
    isActive: true,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    agentId: "agent-2",
    userId: "root",
  },
  {
    id: "3",
    name: "Agent Offline",
    description: "Alert when agent goes offline",
    type: "agent_status",
    condition: {
      operator: "=",
      threshold: 0,
      duration: 1,
    },
    isActive: false,
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    triggeredAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    agentId: "agent-3",
    userId: "user1",
  },
]

export default function AlertsPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { user } = useAuthStore()

  const {
    data: alerts,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["alerts"],
    queryFn: () => generateAlerts(),
    refetchInterval: 30000,
  })

  const form = useForm<AlertFormData>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "metric",
      operator: ">",
      threshold: 80,
      duration: 5,
    },
  })

  const filteredAlerts =
    alerts?.filter((alert) => {
      if (user?.role !== "root") {
        return alert.userId === user?.id
      }
      return true
    }) || []

  const onSubmit = (data: AlertFormData) => {
    console.log("Creating alert:", data)
    setShowCreateDialog(false)
    form.reset()
    refetch()
  }

  const getStatusIcon = (alert: Alert) => {
    if (alert.triggeredAt && !alert.resolvedAt) {
      return <AlertTriangle className="h-5 w-5 text-red-500" />
    }
    if (alert.resolvedAt) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    }
    return <Clock className="h-5 w-5 text-gray-400" />
  }

  const getStatusBadge = (alert: Alert) => {
    if (alert.triggeredAt && !alert.resolvedAt) {
      return <Badge variant="destructive">Triggered</Badge>
    }
    if (alert.resolvedAt) {
      return <Badge variant="outline">Resolved</Badge>
    }
    return <Badge variant="secondary">Waiting</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alerts</h1>
          <p className="text-gray-600">Manage system alerts and notifications</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Alert</DialogTitle>
                <DialogDescription>Set up a new alert rule to monitor your system.</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alert Name</FormLabel>
                          <FormControl>
                            <Input placeholder="High CPU Usage" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alert Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="metric">Metric</SelectItem>
                              <SelectItem value="log">Log</SelectItem>
                              <SelectItem value="agent_status">Agent Status</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Alert when CPU usage exceeds threshold" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="operator"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Operator</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value=">">Greater than</SelectItem>
                              <SelectItem value="<">Less than</SelectItem>
                              <SelectItem value=">=">Greater or equal</SelectItem>
                              <SelectItem value="<=">Less or equal</SelectItem>
                              <SelectItem value="=">Equal</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="threshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Threshold</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="80"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (min)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="5"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Alert</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Rules ({filteredAlerts.length})</CardTitle>
          <CardDescription>{user?.role === "root" ? "All system alerts" : "Your alerts"}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Loading alerts...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alert</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Triggered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(alert)}
                        <div>
                          <div className="font-medium">{alert.name}</div>
                          <div className="text-sm text-gray-500">{alert.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {alert.type.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {alert.condition.metric && <span className="capitalize">{alert.condition.metric} </span>}
                        {alert.condition.operator} {alert.condition.threshold}
                        {alert.condition.metric && "%"}
                        <div className="text-xs text-gray-500">for {alert.condition.duration} min</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(alert)}</TableCell>
                    <TableCell>
                      {alert.triggeredAt ? (
                        <div className="text-sm">{new Date(alert.triggeredAt).toLocaleString()}</div>
                      ) : (
                        <span className="text-gray-400">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {(user?.role === "root" || alert.userId === user?.id) && (
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
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
  )
}
