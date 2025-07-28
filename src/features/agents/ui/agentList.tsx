"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Server, Eye, Trash2, RefreshCw } from "lucide-react";
import type { Agent } from "../model/types";
import { getStatusColor, getStatusText, formatLastSeen } from "../lib/utils";

interface AgentsListProps {
  agents: Agent[];
  isLoading: boolean;
  onRefresh: () => void;
  onViewAgent: (agentId: string) => void;
}

export const AgentsList = ({
  agents,
  isLoading,
  onRefresh,
  onViewAgent,
}: AgentsListProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading agents...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Registered Agents ({agents.length})</CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Monitor and manage your system agents
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {agents.length === 0 ? (
          <div className="text-center py-8">
            <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No agents registered
            </h3>
            <p className="text-gray-600">
              Register your first agent to start monitoring.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Server className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{agent.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {agent.ipAddress}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(agent.status)}>
                      {getStatusText(agent.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={agent.isPublic ? "default" : "secondary"}>
                      {agent.isPublic ? "Public" : "Private"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatLastSeen(agent.lastSeen)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewAgent(agent.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
