"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useAuthStore } from "@/shared/store/authStore"
import { useAgents, useCreateAgent } from "@/features/agents/model/queries"
import { AgentsPageHeader } from "@/features/agents/ui/agentsPageHeader"
import { AgentsList } from "@/features/agents/ui/agentList"
import { AgentRegistrationForm } from "@/features/agents/ui/agentRegistrationForm"
import type { CreateAgentResponse, CreateAgentRequest } from "@/features/agents/model/types"

export default function AgentsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [registrationResult, setRegistrationResult] = useState<CreateAgentResponse | null>(null)
  const { user } = useAuthStore()

  // React Query 훅들
  const { data: agentsData, isLoading, refetch } = useAgents()
  const createAgentMutation = useCreateAgent()

  // 계산된 값들
  const agents = agentsData?.agents || []
  const totalAgents = agents.length
  const onlineAgents = agents.filter((agent) => agent.status === "online").length

  // 이벤트 핸들러들
  const handleCreateAgent = async (data: CreateAgentRequest) => {
    try {
      const result = await createAgentMutation.mutateAsync(data)
      setRegistrationResult(result)
    } catch (error) {
      console.error("Failed to create agent:", error)
      throw error
    }
  }

  const handleViewAgent = (agentId: string) => {
    router.push(`/agents/${agentId}`)
  }

  const handleResetRegistration = () => {
    setRegistrationResult(null)
  }

  const handleRefresh = () => {
    refetch()
  }

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.ipAddress.includes(searchTerm) ||
      agent.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    // Filter by ownership for non-root users
    if (user?.role !== "root") {
      return matchesSearch && agent.ownerId === user?.id
    }

    return matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <AgentsPageHeader totalAgents={totalAgents} onlineAgents={onlineAgents} />

      {/* 에이전트 등록 폼 */}
      <AgentRegistrationForm
        onSubmit={handleCreateAgent}
        isLoading={createAgentMutation.isPending}
        error={createAgentMutation.error?.message || null}
        registrationResult={registrationResult}
        onReset={handleResetRegistration}
      />

      {/* 검색 */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search agents by name, hostname, IP, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* 에이전트 목록 */}
      <AgentsList
        agents={filteredAgents}
        isLoading={isLoading}
        onRefresh={handleRefresh}
        onViewAgent={handleViewAgent}
      />
    </div>
  )
}
