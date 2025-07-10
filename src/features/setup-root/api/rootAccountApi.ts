import type { RootAccountFormData } from "@/entities/setup/model";
import { apiFetch } from "@/shared/api/client";

export const rootAccountApi = async(data: RootAccountFormData) =>{
  return apiFetch("/users/root", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
