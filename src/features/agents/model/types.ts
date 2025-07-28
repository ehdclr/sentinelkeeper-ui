import { z } from "zod";

const agentSchema = z.object({
  id: z.number(),
  name: z.string(),
  ipAddress: z.string(),
  isPublic: z.boolean(),
  hostname: z.string().optional(),
  os: z.string().optional(),
  arch: z.string().optional(),
  ownerId: z.string().optional(),
  protocols: z.enum(["http", "grpc", "websocket"]),
  tags: z.array(z.string()).optional(),
  metrics: z
    .object({
      cpu: z.number(),
      memory: z.number(),
      disk: z.number(),
      network: z.number(),
      processes: z.number(),
      uptime: z.number(),
      timestamp: z.string(),
      kubernetes: z.object({
        pods: z.number(),
        services: z.number(),
        deployments: z.number(),
        nodes: z.number(),
        events: z.array(z.object({
          id: z.string(),
          type: z.string(),
          reason: z.string(),
          message: z.string(),
          namespace: z.string(),
          object: z.string(),
          timestamp: z.string(),
          severity: z.enum(["normal", "warning", "error"]),
        })),
      }).optional(),
    })
    .optional(),
  status: z.enum(["online", "offline", "error"]),
  createdAt: z.string().optional(),
  lastSeen: z.string().optional(),
  token: z.string().optional(),
});

export type Agent = z.infer<typeof agentSchema>;

export const createAgentSchema = agentSchema.pick({
  name: true,
  ipAddress: true,
  isPublic: true,
  tags: true,
});

export const createAgentResponseSchema = z.object({
  success: z.boolean(),
  agent: agentSchema,
  token: z.string(),
  installScript: z.string(),
});

export const agentsResponseSchema = z.object({
  success: z.boolean(),
  agents: z.array(agentSchema),
  total: z.number(),
});

export type CreateAgentRequest = z.infer<typeof createAgentSchema>;
export type CreateAgentResponse = z.infer<typeof createAgentResponseSchema>;
export type AgentsResponse = z.infer<typeof agentsResponseSchema>;
