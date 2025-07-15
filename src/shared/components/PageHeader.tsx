"use client"
import { Separator } from "@/components/ui/separator"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import type { PageHeaderProps } from "@/shared/types/ui"

export function PageHeader({ title, description, breadcrumb, actions }: PageHeaderProps) {
  return (
    <div className="space-y-4 pb-4">
      {/* Breadcrumb */}
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Link href="/dashboard" className="flex items-center hover:text-foreground">
            <Home className="h-4 w-4" />
          </Link>
          {breadcrumb.map((item, index) => (
            <div key={index} className="flex items-center space-x-1">
              <ChevronRight className="h-4 w-4" />
              <span
                className={index === breadcrumb.length - 1 ? "text-foreground font-medium" : "hover:text-foreground"}
              >
                {item}
              </span>
            </div>
          ))}
        </nav>
      )}

      {/* Header Content */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>

      <Separator />
    </div>
  )
}
