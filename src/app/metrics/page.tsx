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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  RefreshCw,
  TrendingUp,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
} from "lucide-react";
import type { MetricSeries, MetricDataPoint } from "@/shared/types";

// Mock data generator
const generateMetricData = (
  metricName: string,
  agentId: string
): MetricDataPoint[] => {
  const now = Date.now();
  const data: MetricDataPoint[] = [];

  for (let i = 59; i >= 0; i--) {
    const timestamp = new Date(now - i * 60 * 1000).toISOString();
    let value: number;

    switch (metricName) {
      case "cpu":
        value = Math.random() * 100;
        break;
      case "memory":
        value = 60 + Math.random() * 30;
        break;
      case "disk":
        value = 20 + Math.random() * 40;
        break;
      case "network":
        value = Math.random() * 50;
        break;
      default:
        value = Math.random() * 100;
    }

    data.push({
      timestamp,
      value: Number(value.toFixed(2)),
      labels: {
        agent: agentId,
        metric: metricName,
      },
    });
  }

  return data;
};

const generateMetricSeries = (): MetricSeries[] => [
  {
    id: "cpu-agent-1",
    name: "CPU Usage",
    agentId: "agent-1",
    type: "gauge",
    unit: "%",
    tags: { hostname: "web-01.example.com", environment: "production" },
    dataPoints: generateMetricData("cpu", "agent-1"),
  },
  {
    id: "memory-agent-1",
    name: "Memory Usage",
    agentId: "agent-1",
    type: "gauge",
    unit: "%",
    tags: { hostname: "web-01.example.com", environment: "production" },
    dataPoints: generateMetricData("memory", "agent-1"),
  },
  {
    id: "disk-agent-1",
    name: "Disk Usage",
    agentId: "agent-1",
    type: "gauge",
    unit: "%",
    tags: { hostname: "web-01.example.com", environment: "production" },
    dataPoints: generateMetricData("disk", "agent-1"),
  },
  {
    id: "network-agent-1",
    name: "Network Usage",
    agentId: "agent-1",
    type: "gauge",
    unit: "%",
    tags: { hostname: "web-01.example.com", environment: "production" },
    dataPoints: generateMetricData("network", "agent-1"),
  },
  {
    id: "cpu-agent-2",
    name: "CPU Usage",
    agentId: "agent-2",
    type: "gauge",
    unit: "%",
    tags: { hostname: "db-01.example.com", environment: "production" },
    dataPoints: generateMetricData("cpu", "agent-2"),
  },
  {
    id: "memory-agent-2",
    name: "Memory Usage",
    agentId: "agent-2",
    type: "gauge",
    unit: "%",
    tags: { hostname: "db-01.example.com", environment: "production" },
    dataPoints: generateMetricData("memory", "agent-2"),
  },
];

export default function MetricsPage() {
  const [selectedAgent, setSelectedAgent] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("1h");

  const {
    data: metricSeries,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["metrics", selectedAgent, timeRange],
    queryFn: () => generateMetricSeries(),
    refetchInterval: 30000,
  });

  const filteredMetrics =
    metricSeries?.filter(
      (metric) => selectedAgent === "all" || metric.agentId === selectedAgent
    ) || [];

  const groupedMetrics = filteredMetrics.reduce((acc, metric) => {
    const key = metric.name;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(metric);
    return acc;
  }, {} as Record<string, MetricSeries[]>);

  const formatChartData = (metrics: MetricSeries[]) => {
    if (metrics.length === 0) return [];

    const timestamps = metrics[0].dataPoints.map((dp) => dp.timestamp);

    return timestamps.map((timestamp) => {
      const dataPoint: any = {
        timestamp: new Date(timestamp).toLocaleTimeString(),
        fullTimestamp: timestamp,
      };

      metrics.forEach((metric) => {
        const point = metric.dataPoints.find(
          (dp) => dp.timestamp === timestamp
        );
        if (point) {
          dataPoint[`${metric.agentId}`] = point.value;
        }
      });

      return dataPoint;
    });
  };

  const getMetricIcon = (metricName: string) => {
    switch (metricName.toLowerCase()) {
      case "cpu usage":
        return <Cpu className="h-5 w-5 text-orange-500" />;
      case "memory usage":
        return <MemoryStick className="h-5 w-5 text-purple-500" />;
      case "disk usage":
        return <HardDrive className="h-5 w-5 text-indigo-500" />;
      case "network usage":
        return <Network className="h-5 w-5 text-cyan-500" />;
      default:
        return <TrendingUp className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAgentColor = (agentId: string) => {
    const colors = {
      "agent-1": "#3b82f6", // blue
      "agent-2": "#ef4444", // red
      "agent-3": "#10b981", // green
      "agent-4": "#f59e0b", // yellow
    };
    return colors[agentId as keyof typeof colors] || "#6b7280";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Metrics Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor system metrics with real-time charts
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              <SelectItem value="agent-1">web-01.example.com</SelectItem>
              <SelectItem value="agent-2">db-01.example.com</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="6h">Last 6 Hours</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.entries(groupedMetrics).map(([metricName, metrics]) => {
          const latestValues = metrics.map((metric) => {
            const latest = metric.dataPoints[metric.dataPoints.length - 1];
            return {
              agentId: metric.agentId,
              value: latest?.value || 0,
              hostname: metric.tags.hostname,
            };
          });

          const avgValue =
            latestValues.reduce((sum, item) => sum + item.value, 0) /
            latestValues.length;

          return (
            <Card key={metricName}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {metricName}
                    </p>
                    <p className="text-2xl font-bold">{avgValue.toFixed(1)}%</p>
                    <div className="text-xs text-gray-500 mt-1">
                      {latestValues.length} agent
                      {latestValues.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                  {getMetricIcon(metricName)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Metric Charts */}
      <Tabs defaultValue="cpu" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cpu">CPU Usage</TabsTrigger>
          <TabsTrigger value="memory">Memory Usage</TabsTrigger>
          <TabsTrigger value="disk">Disk Usage</TabsTrigger>
          <TabsTrigger value="network">Network Usage</TabsTrigger>
        </TabsList>

        {Object.entries(groupedMetrics).map(([metricName, metrics]) => {
          const tabValue = metricName.toLowerCase().replace(" usage", "");
          const chartData = formatChartData(metrics);

          return (
            <TabsContent key={tabValue} value={tabValue}>
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    {getMetricIcon(metricName)}
                    <CardTitle>{metricName} Over Time</CardTitle>
                  </div>
                  <CardDescription>
                    Real-time {metricName.toLowerCase()} metrics from{" "}
                    {metrics.length} agent
                    {metrics.length !== 1 ? "s" : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">Loading metrics...</p>
                    </div>
                  ) : (
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="timestamp"
                            tick={{ fontSize: 12 }}
                            interval="preserveStartEnd"
                          />
                          <YAxis
                            domain={[0, 100]}
                            tick={{ fontSize: 12 }}
                            label={{
                              value: "%",
                              angle: -90,
                              position: "insideLeft",
                            }}
                          />
                          <Tooltip
                            labelFormatter={(value) => `Time: ${value}`}
                            formatter={(value: number, name: string) => [
                              `${value.toFixed(2)}%`,
                              `Agent ${name}`,
                            ]}
                          />
                          <Legend />
                          {metrics.map((metric) => (
                            <Line
                              key={metric.id}
                              type="monotone"
                              dataKey={metric.agentId}
                              stroke={getAgentColor(metric.agentId)}
                              strokeWidth={2}
                              dot={false}
                              name={metric.tags.hostname}
                            />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Metric Details */}
      <Card>
        <CardHeader>
          <CardTitle>Metric Details</CardTitle>
          <CardDescription>
            Detailed information about current metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(groupedMetrics).map(([metricName, metrics]) => (
              <div key={metricName} className="border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  {getMetricIcon(metricName)}
                  <h3 className="font-medium">{metricName}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {metrics.map((metric) => {
                    const latest =
                      metric.dataPoints[metric.dataPoints.length - 1];
                    const previous =
                      metric.dataPoints[metric.dataPoints.length - 2];
                    const trend =
                      latest && previous ? latest.value - previous.value : 0;

                    return (
                      <div key={metric.id} className="bg-gray-50 rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {metric.tags.hostname}
                          </span>
                          <span
                            className={`text-xs ${
                              trend > 0
                                ? "text-red-600"
                                : trend < 0
                                ? "text-green-600"
                                : "text-gray-600"
                            }`}
                          >
                            {trend > 0 ? "↑" : trend < 0 ? "↓" : "→"}{" "}
                            {Math.abs(trend).toFixed(1)}%
                          </span>
                        </div>
                        <div className="text-lg font-bold">
                          {latest?.value.toFixed(2) || 0}%
                        </div>
                        <div className="text-xs text-gray-500">
                          Last updated:{" "}
                          {latest
                            ? new Date(latest.timestamp).toLocaleTimeString()
                            : "N/A"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
