"use client"

import type React from "react"
import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface SuspenseWrapperProps {
  children: React.ReactNode
  loadingMessage?: string
  loadingType?: "dashboard" | "status" | "default"
}

function LoadingFallback({ message, type }: { message: string; type: string }) {
  return (
    <Card className="w-full">
      <CardContent className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-sm text-gray-600">{message}</p>
          {type === "dashboard" && <p className="text-xs text-gray-400 mt-2">Initializing dashboard components...</p>}
        </div>
      </CardContent>
    </Card>
  )
}

export function SuspenseWrapper({
  children,
  loadingMessage = "Loading...",
  loadingType = "default",
}: SuspenseWrapperProps) {
  return <Suspense fallback={<LoadingFallback message={loadingMessage} type={loadingType} />}>{children}</Suspense>
}
