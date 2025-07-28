import { z } from "zod";

const agentSchema = z.object({
  id: z.string(),
  name: z.string(),
  ipAddress: z.string(),
  isPublic: z.boolean(),
  hostname: z.string().optional(),
  os: z.string().optional(),
  arch: z.string().optional(),
  ownerId: z.string().optional(),
  pemKeyId: z.string().optional(),
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
});

export const createAgentResponseSchema = agentSchema.extend({
  token: z.string(),
  install_script: z.string(),
});

export const agentsResponseSchema = z.object({
  agents: z.array(agentSchema),
  total: z.number(),
});

export type CreateAgentRequest = z.infer<typeof createAgentSchema>;
export type CreateAgentResponse = z.infer<typeof createAgentResponseSchema>;
export type AgentsResponse = z.infer<typeof agentsResponseSchema>;
