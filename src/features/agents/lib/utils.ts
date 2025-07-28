import type { Agent } from "../model/types";

export const getStatusColor = (status: Agent["status"]) => {
  switch (status) {
    case "online":
      return "text-green-600 bg-green-100";
    case "offline":
      return "text-gray-600 bg-gray-100";
    case "error":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export const getStatusText = (status: Agent["status"]) => {
  switch (status) {
    case "online":
      return "Online";
    case "offline":
      return "Offline";
    case "error":
      return "Error";
    default:
      return "Unknown";
  }
};

export const formatLastSeen = (lastSeen?: string) => {
  if (!lastSeen) return "Never";

  const date = new Date(lastSeen);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

export const generateInstallScript = (
  token: string,
  serverUrl = "https://sentinel.example.com"
) => {
  return `#!/bin/bash
# Sentinel Agent Installation Script
# Generated on: ${new Date().toISOString()}

set -e

echo "Installing Sentinel Agent..."

# Download and install agent
curl -sSL ${serverUrl}/install.sh | bash -s -- \\
  --token="${token}" \\
  --server="${serverUrl}"

echo "Agent installation completed!"
echo "The agent should appear in your dashboard within a few minutes."
`;
};
