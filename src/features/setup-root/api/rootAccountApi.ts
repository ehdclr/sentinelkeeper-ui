// src/features/setup-root/api/rootAccountApi.ts
import type { RootAccountFormData } from "@/entities/setup/model";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const rootAccountApi = async (data: RootAccountFormData, signal?: AbortSignal) => {
  try {
    const response = await fetch(`${apiBase}/users/root`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      signal, // AbortController signal 추가
    });

    // 먼저 텍스트로 응답 확인
    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${responseText}`);
    }

    // PEM 파일인 경우 (Content-Type이 application/x-pem-file)
    if (response.headers.get("Content-Type")?.includes("pem")) {
      const contentDisposition = response.headers.get("Content-Disposition");
      const filenameMatch = contentDisposition?.match(/filename="([^"]+)"/);
      const filename = filenameMatch?.[1] || `sentinel-root-${data.username}.pem`;

      return {
        pemContent: responseText,
        filename,
        algorithm: response.headers.get("X-Algorithm") || "ed25519",
        mode: response.headers.get("X-Mode") || "Zero-Knowledge",
        message: "Account created successfully",
        user: {
          username: data.username,
          email: data.email,
        },
      };
    }

    // JSON 응답인 경우
    try {
      const jsonData = JSON.parse(responseText);
      return {
        pemContent: jsonData.pemContent || jsonData.pem || "",
        filename: jsonData.filename || `sentinel-root-${data.username}.pem`,
        algorithm: jsonData.algorithm || "ed25519",
        mode: jsonData.mode || "Zero-Knowledge",
        message: jsonData.message || "Account created successfully",
        user: {
          username: data.username,
          email: data.email,
        },
      };
    } catch (jsonError) {
      console.error("JSON parse error:", jsonError);
      console.error("Response was:", responseText);
      throw new Error("서버에서 잘못된 JSON 응답을 받았습니다.");
    }
  } catch (error) {
    // AbortError 처리
    if (error instanceof Error && error.name === 'AbortError') {
      console.log("Request was aborted");
      throw new Error("요청이 취소되었습니다.");
    }
    
    console.error("Root account API error:", error);
    throw error;
  }
};