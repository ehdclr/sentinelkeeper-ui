import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "healthy" | "warning" | "error"
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    healthy: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
  }

  const labels = {
    healthy: "Healthy",
    warning: "Warning",
    error: "Error",
  }

  return (
    <Badge className={cn(variants[status], className)} variant="outline">
      {labels[status]}
    </Badge>
  )
}
