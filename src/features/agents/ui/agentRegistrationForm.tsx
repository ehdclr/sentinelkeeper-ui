"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Plus, X, Server, Globe, Lock, CheckCircle } from "lucide-react"
import type { CreateAgentRequest, CreateAgentResponse } from "../model/types"

interface AgentRegistrationFormProps {
  onSubmit: (data: CreateAgentRequest) => Promise<void>
  isLoading: boolean
  error: string | null
  registrationResult: CreateAgentResponse | null
  onReset: () => void
}

const COMMON_TAGS = [
  "web-server",
  "database",
  "api",
  "cache",
  "load-balancer",
  "monitoring",
  "backup",
  "storage",
  "queue",
  "worker",
]

export function AgentRegistrationForm({
  onSubmit,
  isLoading,
  error,
  registrationResult,
  onReset,
}: AgentRegistrationFormProps) {
  const [formData, setFormData] = useState<CreateAgentRequest>({
    name: "",
    ipAddress: "",
    isPublic: true,
    tags: [],
  })
  const [customTag, setCustomTag] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    await onSubmit(formData)
  }

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const addCustomTag = () => {
    if (customTag.trim()) {
      addTag(customTag.trim())
      setCustomTag("")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case "production":
        return "text-red-600 bg-red-50 border-red-200"
      case "staging":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "development":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  if (registrationResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Agent Registered Successfully</span>
          </CardTitle>
          <CardDescription>
            Your agent has been registered. Use the installation script below to set it up.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Agent Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Agent Name</Label>
              <p className="text-sm text-gray-900">{registrationResult.agent.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Environment</Label>
              <Badge className={getEnvironmentColor(registrationResult.agent.environment)}>
                {registrationResult.agent.environment}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Visibility</Label>
              <div className="flex items-center space-x-2">
                {registrationResult.agent.isPublic ? (
                  <>
                    <Globe className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-900">Public</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-900">Private</span>
                  </>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Agent ID</Label>
              <p className="text-sm text-gray-900 font-mono">{registrationResult.agent.id}</p>
            </div>
          </div>

          {/* Tags */}
          {registrationResult.agent.tags?.length && registrationResult.agent.tags.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-700">Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">  
                {registrationResult.agent.tags?.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Installation Script */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Installation Script</Label>
            <div className="mt-2 relative">
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                {registrationResult.installScript}
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 bg-transparent"
                onClick={() => copyToClipboard(registrationResult.installScript)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Security Notice */}
          <Alert>
            <AlertDescription>
              <strong>Security Notice:</strong> The installation token is shown only once. Please save it securely
              before closing this dialog.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onReset}>
              Register Another Agent
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Server className="h-5 w-5" />
          <span>Register New Agent</span>
        </CardTitle>
        <CardDescription>Add a new monitoring agent to your infrastructure</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Agent Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Web Server 01"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="environment">Environment *</Label>
              <Select
                value={formData.environment || "production"}
                onValueChange={(value: "production" | "staging" | "development") =>
                  setFormData((prev) => ({ ...prev, environment: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ipAddress">Expected IP Address (Optional)</Label>
            <Input
              id="ipAddress"
              placeholder="e.g., 192.168.1.100"
              value={formData.ipAddress}
              onChange={(e) => setFormData((prev) => ({ ...prev, ipAddress: e.target.value }))}
            />
          </div>

          {/* Tags Section */}
          <div className="space-y-4">
            <Label>Tags</Label>

            {/* Common Tags */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Common Tags:</p>
              <div className="flex flex-wrap gap-2">
                {COMMON_TAGS.map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    variant={formData.tags?.includes(tag) ? "default" : "outline"}
                    size="sm"
                    onClick={() => (formData.tags?.includes(tag) ? removeTag(tag) : addTag(tag))}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Tag Input */}
            <div className="flex space-x-2">
              <Input
                placeholder="Add custom tag..."
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomTag())}
              />
              <Button type="button" variant="outline" onClick={addCustomTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Selected Tags */}
            {formData.tags?.length && formData.tags.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Selected Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                      <span>{tag}</span>
                      <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-red-600">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Visibility Setting */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Agent Visibility</Label>
              <p className="text-sm text-gray-600">
                Public agents are visible to all users, private agents only to you
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-gray-400" />
              <Switch
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPublic: checked }))}
              />
              <Globe className="h-4 w-4 text-blue-600" />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading || !formData.name.trim()}>
              {isLoading ? "Registering..." : "Register Agent"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
