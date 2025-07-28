import { apiFetch } from "@/shared/api/client";
import type {
  CreateAgentRequest,
  CreateAgentResponse,
  AgentsResponse,
} from "../model/types";
import {
  agentsResponseSchema,
  createAgentResponseSchema,
} from "../model/types";

export const createAgentApi = async (data: CreateAgentRequest): Promise<CreateAgentResponse> => {
  const response = await apiFetch("/agents", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const { success, data: parsedData, error } = createAgentResponseSchema.safeParse(response);

  if (!success) {
    throw new Error(error?.message || "Failed to create agent");
  }

  return parsedData;
};


export const getAgentsApi = async (): Promise<AgentsResponse> => {
  const response = await apiFetch("/agents", {
    method: "GET",
  });

  const { success, data: parsedData, error } = agentsResponseSchema.safeParse(response);

  if (!success) {
    throw new Error(error?.message || "Failed to fetch agents");
  }

  return parsedData;
};  