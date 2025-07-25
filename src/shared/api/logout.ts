import { apiFetch } from "./client";

export const logoutApi = async () => {
  return await apiFetch("/auth/logout", {
    method: "POST",
    credentials: "include",
  });
};