"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bell, Settings, User, LogOut, ChevronDown, Moon, Sun, Monitor } from "lucide-react"
import { useAuthStore } from "@/shared/store/authStore"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import type { NotificationConfig } from "@/shared/types/ui"

const getPageInfo = (pathname: string) => {
  const routes: Record<string, { title: string; description: string }> = {
    "/dashboard": { title: "Dashboard", description: "Monitor your system health and performance" },
    "/agents": { title: "Agents", description: "Manage and monitor your system agents" },
    "/logs": { title: "Logs", description: "Search and analyze system logs" },
    "/metrics": { title: "Metrics", description: "View system metrics and performance charts" },
    "/events": { title: "Events", description: "Monitor system events and alerts" },
    "/rules": { title: "Rules", description: "Manage monitoring rules and conditions" },
    "/settings": { title: "Settings", description: "Configure system settings and preferences" },
    "/settings/database": { title: "Database Settings", description: "Configure database connection" },
    "/settings/logs": { title: "Log Storage Settings", description: "Configure log storage options" },
    "/settings/pem-keys": { title: "PEM Key Management", description: "Manage authentication keys" },
    "/settings/users": { title: "User Management", description: "Manage system users and permissions" },
    "/settings/system": { title: "System Settings", description: "Configure system-wide settings" },
  }

  return routes[pathname] || { title: "Sentinel", description: "" }
}

// Mock notifications
const mockNotifications: NotificationConfig[] = [
  {
    id: "1",
    type: "error",
    title: "High CPU Usage",
    message: "CPU usage exceeded 80% on web-01.example.com",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false,
    actions: [
      { label: "View Details", action: () => console.log("View details") },
      { label: "Acknowledge", action: () => console.log("Acknowledge") },
    ],
  },
  {
    id: "2",
    type: "warning",
    title: "Memory Warning",
    message: "Memory usage approaching 90% threshold",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "3",
    type: "success",
    title: "Agent Connected",
    message: "New agent db-02.example.com successfully registered",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: true,
  },
]

const Header = () => {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState<NotificationConfig[]>(mockNotifications)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't show header on login/setup pages
  if (pathname === "/login" || pathname === "/setup" || pathname === "/") {
    return null
  }

  const handleLogout = () => {
    logout()
  }

  const pageInfo = getPageInfo(pathname)
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const getNotificationIcon = (type: NotificationConfig["type"]) => {
    const colors = {
      error: "text-red-500",
      warning: "text-yellow-500",
      success: "text-green-500",
      info: "text-blue-500",
    }
    return colors[type]
  }

  const getThemeIcon = () => {
    if (!mounted) return <Monitor className="h-4 w-4" />

    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />
      case "dark":
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  return (
    <header className="bg-background border-b px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Info */}
        <div>
          <h1 className="text-2xl font-semibold">{pageInfo.title}</h1>
          {pageInfo.description && <p className="text-sm text-muted-foreground mt-1">{pageInfo.description}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                {getThemeIcon()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Notifications</h4>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                      Mark all read
                    </Button>
                  )}
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No notifications</p>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          notification.read ? "bg-muted/50" : "bg-background hover:bg-muted/50"
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${getNotificationIcon(notification.type)}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                            {notification.actions && (
                              <div className="flex space-x-2 mt-2">
                                {notification.actions.map((action, index) => (
                                  <Button
                                    key={index}
                                    variant={action.variant || "outline"}
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      action.action()
                                    }}
                                  >
                                    {action.label}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{user.username.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium">{user.username}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.username}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <Badge variant={user.role === "root" ? "default" : "secondary"} className="w-fit text-xs">
                      {user.role === "root" ? "Administrator" : "User"}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header;