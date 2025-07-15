"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Settings,
  Play,
  Pause,
  Trash2,
  RefreshCw,
  FileText,
  BarChart3,
  Layers,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Rule, Agent } from "@/shared/types";
import { useAuthStore } from "@/shared/store/authStore";

const ruleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["log", "metric", "kubernetes"]),
  isActive: z.boolean(),
  agentIds: z.array(z.string()),
  // Log conditions
  logLevel: z
    .array(z.enum(["debug", "info", "warn", "error", "fatal"]))
    .optional(),
  logMessage: z.string().optional(),
  logSource: z.array(z.string()).optional(),
  // Metric conditions
  metric: z.string().optional(),
  operator: z.enum([">", "<", "=", ">=", "<="]).optional(),
  threshold: z.number().optional(),
  duration: z.number().optional(),
  // Actions
  actionType: z.enum(["email", "slack", "webhook", "create_event"]),
  actionConfig: z.string(), // JSON string
});

type RuleFormData = z.infer<typeof ruleSchema>;

// Mock data generators
const generateAgents = (): Agent[] => [
  {
    id: "agent-1",
    name: "Web Server 01",
    hostname: "web-01.example.com",
    ipAddress: "192.168.1.10",
    status: "online",
    lastSeen: new Date().toISOString(),
    version: "1.2.3",
    os: "Ubuntu 22.04",
    arch: "x86_64",
    ownerId: "root",
    pemKeyId: "key-1",
    tags: ["production", "web"],
    protocols: ["http", "websocket"],
    config: {
      metricsInterval: 30,
      logLevel: "info",
      bufferSize: 100,
      retryAttempts: 3,
      enableKubernetes: false,
      customFields: {},
    },
  },
  {
    id: "agent-2",
    name: "Database Server",
    hostname: "db-01.example.com",
    ipAddress: "192.168.1.20",
    status: "online",
    lastSeen: new Date().toISOString(),
    version: "1.2.3",
    os: "CentOS 8",
    arch: "x86_64",
    ownerId: "root",
    pemKeyId: "key-1",
    tags: ["production", "database"],
    protocols: ["grpc"],
    config: {
      metricsInterval: 30,
      logLevel: "info",
      bufferSize: 100,
      retryAttempts: 3,
      enableKubernetes: false,
      customFields: {},
    },
  },
];

const generateRules = (): Rule[] => [
  {
    id: "1",
    name: "High CPU Alert",
    description: "Alert when CPU usage exceeds 80% for 5 minutes",
    type: "metric",
    isActive: true,
    agentIds: ["agent-1", "agent-2"],
    condition: {
      metric: "cpu",
      operator: ">",
      threshold: 80,
      duration: 5,
    },
    actions: [
      {
        type: "email",
        config: {
          to: ["admin@example.com"],
          subject: "High CPU Alert",
          template: "CPU usage is above 80%",
        },
      },
      {
        type: "create_event",
        config: {
          severity: "high",
          title: "High CPU Usage",
          description: "CPU usage exceeded threshold",
        },
      },
    ],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    userId: "root",
    lastTriggered: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    triggerCount: 5,
  },
  {
    id: "2",
    name: "Error Log Detection",
    description: "Alert on ERROR level logs from application",
    type: "log",
    isActive: true,
    agentIds: [],
    condition: {
      logLevel: ["error", "fatal"],
      logSource: ["application"],
      timeWindow: 10,
      frequency: 5,
    },
    actions: [
      {
        type: "slack",
        config: {
          channel: "#alerts",
          webhook: "https://hooks.slack.com/services/...",
          username: "Sentinel Bot",
        },
      },
    ],
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    userId: "root",
    triggerCount: 12,
  },
  {
    id: "3",
    name: "Kubernetes Pod Failure",
    description: "Alert on Kubernetes pod failures",
    type: "kubernetes",
    isActive: false,
    agentIds: ["agent-1"],
    condition: {
      kubernetesType: ["Pod"],
      kubernetesSeverity: ["error"],
      kubernetesNamespace: ["production"],
    },
    actions: [
      {
        type: "webhook",
        config: {
          url: "https://api.example.com/alerts",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          payload: '{"alert": "kubernetes_failure", "severity": "high"}',
        },
      },
    ],
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    userId: "root",
    triggerCount: 0,
  },
];

export default function RulesPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const { user } = useAuthStore();

  const {
    data: rules,
    isLoading: rulesLoading,
    refetch: refetchRules,
  } = useQuery({
    queryKey: ["rules"],
    queryFn: () => generateRules(),
    refetchInterval: 30000,
  });

  const { data: agents } = useQuery({
    queryKey: ["agents"],
    queryFn: () => generateAgents(),
  });

  const form = useForm<RuleFormData>({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "log",
      isActive: true,
      agentIds: [],
      actionType: "create_event",
      actionConfig: "{}",
    },
  });

  const filteredRules = rules?.filter((rule) => {
    if (selectedTab === "all") return true;
    return rule.type === selectedTab;
  });

  const onSubmit = (data: RuleFormData) => {
    console.log("Creating rule:", data);
    setShowCreateDialog(false);
    form.reset();
    refetchRules();
  };

  const toggleRuleStatus = (ruleId: string) => {
    console.log("Toggling rule status:", ruleId);
    refetchRules();
  };

  const getRuleTypeIcon = (type: string) => {
    switch (type) {
      case "log":
        return <FileText className="h-4 w-4" />;
      case "metric":
        return <BarChart3 className="h-4 w-4" />;
      case "kubernetes":
        return <Layers className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (count: number) => {
    if (count === 0) return "text-gray-500";
    if (count < 5) return "text-green-600";
    if (count < 20) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rules Management</h1>
          <p className="text-gray-600">
            Create and manage monitoring rules for logs, metrics, and Kubernetes
            events
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={() => refetchRules()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Rule</DialogTitle>
                <DialogDescription>
                  Set up a new monitoring rule with conditions and actions.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rule Name</FormLabel>
                          <FormControl>
                            <Input placeholder="High CPU Alert" {...field} />
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
                          <FormLabel>Rule Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="log">Log Rule</SelectItem>
                              <SelectItem value="metric">
                                Metric Rule
                              </SelectItem>
                              <SelectItem value="kubernetes">
                                Kubernetes Rule
                              </SelectItem>
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
                          <Textarea
                            placeholder="Describe what this rule monitors..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Agent Selection */}
                  <FormField
                    control={form.control}
                    name="agentIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Target Agents (empty = all agents)
                        </FormLabel>
                        <FormControl>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select agents" />
                            </SelectTrigger>
                            <SelectContent>
                              {agents?.map((agent) => (
                                <SelectItem key={agent.id} value={agent.id}>
                                  {agent.name} ({agent.hostname})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Conditions based on type */}
                  {form.watch("type") === "metric" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Metric Conditions</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="metric"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Metric</FormLabel>
                              <Select onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select metric" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="cpu">CPU Usage</SelectItem>
                                  <SelectItem value="memory">
                                    Memory Usage
                                  </SelectItem>
                                  <SelectItem value="disk">
                                    Disk Usage
                                  </SelectItem>
                                  <SelectItem value="network">
                                    Network Usage
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="operator"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Operator</FormLabel>
                              <Select onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select operator" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value=">">
                                    Greater than
                                  </SelectItem>
                                  <SelectItem value="<">Less than</SelectItem>
                                  <SelectItem value=">=">
                                    Greater or equal
                                  </SelectItem>
                                  <SelectItem value="<=">
                                    Less or equal
                                  </SelectItem>
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
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {form.watch("type") === "log" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Log Conditions</h3>
                      <FormField
                        control={form.control}
                        name="logMessage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Log Message Pattern</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="error|exception|failed"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="actionType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Action Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select action" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="slack">Slack</SelectItem>
                                <SelectItem value="webhook">Webhook</SelectItem>
                                <SelectItem value="create_event">
                                  Create Event
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Active
                              </FormLabel>
                              <div className="text-sm text-muted-foreground">
                                Enable this rule immediately
                              </div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="actionConfig"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Action Configuration (JSON)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='{"to": ["admin@example.com"], "subject": "Alert"}'
                              className="font-mono"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create Rule</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Rule Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">All Rules</TabsTrigger>
          <TabsTrigger value="log">Log Rules</TabsTrigger>
          <TabsTrigger value="metric">Metric Rules</TabsTrigger>
          <TabsTrigger value="kubernetes">Kubernetes Rules</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rules ({filteredRules?.length || 0})</CardTitle>
              <CardDescription>
                Monitor and manage your system rules
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rulesLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Loading rules...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rule</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Agents</TableHead>
                      <TableHead>Triggers</TableHead>
                      <TableHead>Last Triggered</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRules?.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {getRuleTypeIcon(rule.type)}
                            <div>
                              <div className="font-medium">{rule.name}</div>
                              <div className="text-sm text-gray-500">
                                {rule.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {rule.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={rule.isActive ? "default" : "secondary"}
                          >
                            {rule.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {rule.agentIds.length === 0
                              ? "All agents"
                              : `${rule.agentIds.length} agents`}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            className={`text-sm font-medium ${getSeverityColor(
                              rule.triggerCount
                            )}`}
                          >
                            {rule.triggerCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          {rule.lastTriggered ? (
                            <div className="text-sm">
                              {new Date(rule.lastTriggered).toLocaleString()}
                            </div>
                          ) : (
                            <span className="text-gray-400">Never</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleRuleStatus(rule.id)}
                              title={
                                rule.isActive ? "Pause Rule" : "Activate Rule"
                              }
                            >
                              {rule.isActive ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="ghost" size="sm" title="Edit Rule">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
