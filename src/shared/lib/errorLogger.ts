class ErrorLogger {
  static log(error: Error, context?: string) {
    console.error(`[${context || "Error"}]:`, error);

    // 프로덕션에서는 에러 리포팅 서비스로 전송
    if (process.env.NODE_ENV === "production") {
      // 예: Sentry.captureException(error)
    }
  }

  static logWithContext(error: Error, context: string, extra?: any) {
    console.error(`[${context}]:`, error, extra);

    if (process.env.NODE_ENV === "production") {
      // 예: Sentry.captureException(error, { extra })
    }
  }
}

export { ErrorLogger };
