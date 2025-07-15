"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface MetricData {
  time: string
  cpu: number
  memory: number
  disk: number
  network: number
}

interface AgentMetricsChartProps {
  data: MetricData[]
  title: string
}

export function AgentMetricsChart({ data, title }: AgentMetricsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Real-time system metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            cpu: {
              label: "CPU",
              color: "hsl(var(--chart-1))",
            },
            memory: {
              label: "Memory",
              color: "hsl(var(--chart-2))",
            },
            disk: {
              label: "Disk",
              color: "hsl(var(--chart-3))",
            },
            network: {
              label: "Network",
              color: "hsl(var(--chart-4))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="time" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="cpu" stroke="var(--color-cpu)" strokeWidth={2} name="CPU %" />
              <Line type="monotone" dataKey="memory" stroke="var(--color-memory)" strokeWidth={2} name="Memory %" />
              <Line type="monotone" dataKey="disk" stroke="var(--color-disk)" strokeWidth={2} name="Disk %" />
              <Line type="monotone" dataKey="network" stroke="var(--color-network)" strokeWidth={2} name="Network %" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
