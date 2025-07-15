import { create } from "zustand"
import type { Agent } from "../types"

interface AgentsState {
  agents: Agent[]
  selectedAgent: Agent | null
  setAgents: (agents: Agent[]) => void
  addAgent: (agent: Agent) => void
  updateAgent: (agentId: string, updates: Partial<Agent>) => void
  removeAgent: (agentId: string) => void
  selectAgent: (agent: Agent | null) => void
}

export const useAgentsStore = create<AgentsState>((set) => ({
  agents: [],
  selectedAgent: null,
  setAgents: (agents) => set({ agents }),
  addAgent: (agent) => set((state) => ({ agents: [...state.agents, agent] })),
  updateAgent: (agentId, updates) =>
    set((state) => ({
      agents: state.agents.map((agent) => (agent.id === agentId ? { ...agent, ...updates } : agent)),
    })),
  removeAgent: (agentId) =>
    set((state) => ({
      agents: state.agents.filter((agent) => agent.id !== agentId),
    })),
  selectAgent: (agent) => set({ selectedAgent: agent }),
}))
