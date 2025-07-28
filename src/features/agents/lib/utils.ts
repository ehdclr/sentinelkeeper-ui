import type { Agent } from "../model/types"

export const getStatusColor = (status: Agent["status"]) => {
  switch (status) {
    case "online":
      return "text-green-600 bg-green-50"
    case "offline":
      return "text-yellow-600 bg-yellow-50"
    case "error":
      return "text-red-600 bg-red-50"
    default:
      return "text-gray-600 bg-gray-50"
  }
}

export const getEnvironmentColor = (environment: Agent["environment"]) => {
  switch (environment) {
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

export const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}

export const generateInstallCommand = (token: string, name: string, environment: string, tags: string[]) => {
  return `curl -sSL https://sentinel.example.com/install.sh | bash -s -- --token=${token} --name="${name}" --env=${environment} --tags="${tags.join(",")}"`
}
