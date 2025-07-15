export const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export interface SafeApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data;
}
