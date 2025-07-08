import { ApiResponse } from "@/entities/database/model";
import { errorHandler } from "@/shared/lib/errorHandler";

export const apiBase =  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export interface SafeApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export async function safeApiFetch<T>(
  path: string,
  options?: RequestInit,
  showToast: boolean = true // toast 표시 여부
): Promise<SafeApiResult<T>> {
  try {
    const response = await fetch(`${apiBase}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });
    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || "An error occurred";

      if (showToast) {
        errorHandler.api(new Error(errorMessage), "API Request");
      }

      return {
        success: false,
        error: errorMessage,
        statusCode: response.status,
      };
    }

    return {
      success: true,
      data: data.data,
      statusCode: response.status,
    };
  } catch (error) {
    if (showToast) {
      errorHandler.network(error);
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
      statusCode: 500,
    };
  }
}
