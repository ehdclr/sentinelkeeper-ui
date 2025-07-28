"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Plus, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import type { CreateAgentResponse } from "../model/types";

interface AgentRegistrationFormProps {
  onSubmit: (name: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  registrationResult: CreateAgentResponse | null;
  onReset: () => void;
}

export const AgentRegistrationForm = ({
  onSubmit,
  isLoading,
  error,
  registrationResult,
  onReset,
}: AgentRegistrationFormProps) => {
  const [agentName, setAgentName] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agentName.trim()) {
      onSubmit(agentName.trim());
    }
  };

  const handleCopyScript = async () => {
    if (registrationResult?.installScript) {
      await navigator.clipboard.writeText(registrationResult.installScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setAgentName("");
    setCopied(false);
    onReset();
  };

  if (registrationResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-green-600">
            <CheckCircle className="h-5 w-5 mr-2" />
            Agent Registered Successfully
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Save the installation script below.
              The token will not be shown again for security reasons.
            </AlertDescription>
          </Alert>

          <div>
            <Label htmlFor="agent-info">Agent Information</Label>
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm">
                <div>
                  <strong>Name:</strong> {registrationResult.agent.name}
                </div>
                <div>
                  <strong>ID:</strong> {registrationResult.agent.id}
                </div>
                <div>
                  <strong>Token:</strong>{" "}
                  {registrationResult.token.substring(0, 20)}...
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="install-script">Installation Script</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyScript}
                disabled={copied}
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Script
                  </>
                )}
              </Button>
            </div>
            <Textarea
              id="install-script"
              value={registrationResult.installScript}
              readOnly
              className="font-mono text-sm"
              rows={8}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleReset}>Register Another Agent</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register New Agent</CardTitle>
        <p className="text-sm text-gray-600">
          Create a new agent and get the installation script
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="agent-name">Agent Name</Label>
            <Input
              id="agent-name"
              type="text"
              placeholder="e.g., web-server-01"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              disabled={isLoading}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Choose a descriptive name for your agent
            </p>
          </div>

          <Button type="submit" disabled={isLoading || !agentName.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Register Agent
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
