import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { agentsApi } from "../api/agentsApi"
import type { CreateAgentRequest } from "./types"

export const AGENTS_QUERY_KEY = ["agents"] as const

// 에이전트 목록 조회 훅
export const useAgents = () => {
  return useQuery({
    queryKey: AGENTS_QUERY_KEY,
    queryFn: agentsApi.getAgents,
    refetchInterval: 30000, // 30초마다 자동 새로고침
    staleTime: 10000, // 10초간 캐시 유지
  })
}

// 에이전트 생성 훅
export const useCreateAgent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAgentRequest) => agentsApi.createAgent(data),
    onSuccess: () => {
      // 성공 시 에이전트 목록 다시 불러오기
      queryClient.invalidateQueries({ queryKey: AGENTS_QUERY_KEY })
    },
  })
}
