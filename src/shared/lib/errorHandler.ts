import { toast } from "sonner";

export const errorHandler = {
  // API 에러 처리
  api: (error: unknown, context?: string) => {
    const message = error instanceof Error ? error.message : "Unknown error";
    const title = context ? `${context} Failed` : "API Error";

    console.warn(`${title}:`, message);

    toast.error(title, {
      description: message,
      duration: 4000,
    });
  },

  // 네트워크 에러 처리
  network: (error: unknown) => {
    console.warn("Network Error:", error);

    toast.error("Connection Error", {
      description: "Unable to connect to server",
      duration: 4000,
      action: {
        label: "Retry",
        onClick: () => window.location.reload(),
      },
    });
  },

  // 폼 검증 에러 처리
  validation: (error: unknown) => {
    const message =
      error instanceof Error ? error.message : "Validation failed";

    toast.error("Validation Error", {
      description: message,
      duration: 3000,
    });
  },

  // 일반 에러 처리
  general: (error: unknown, context?: string) => {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    console.warn("General Error:", message);

    toast.error(context || "Error", {
      description: message,
      duration: 4000,
    });
  },
};
