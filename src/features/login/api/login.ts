import { z } from "zod";
import { apiFetch } from "@/shared/api/client";

export const LoginRequestSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export interface LoginResponse {
  success: boolean;
  user: {
    id: number;
    username: string;
    email: string;
    isSystemRoot: boolean;
  };
  expiresAt: string;
}

export const loginApi = async (data: LoginRequest) => {
  return await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
    credentials: "include",
  });
};
