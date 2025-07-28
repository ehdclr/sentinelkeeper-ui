import { Server } from "lucide-react"

interface AgentsPageHeaderProps {
  totalAgents: number
  onlineAgents: number
}

export const AgentsPageHeader = ({ totalAgents, onlineAgents }: AgentsPageHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center space-x-2">
          <Server className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Agents</h1>
        </div>
        <p className="text-gray-600 mt-1">Manage and monitor your system agents</p>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-gray-900">{totalAgents}</div>
        <div className="text-sm text-gray-600">Total Agents</div>
        <div className="text-sm text-green-600 mt-1">{onlineAgents} online</div>
      </div>
    </div>
  )
}
