"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChart3,
  Server,
  FileText,
  AlertTriangle,
  Users,
  Database,
  HardDrive,
  Shield,
  LogOut,
  Home,
  TrendingUp,
  Key,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/shared/store/authStore";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  rootOnly?: boolean;
}

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Agents", href: "/agents", icon: Server },
  { name: "Logs", href: "/logs", icon: FileText },
  { name: "Metrics", href: "/metrics", icon: TrendingUp },
  { name: "Events", href: "/events", icon: AlertTriangle, badge: "3" },
  { name: "Rules", href: "/rules", icon: Zap },
];

const settingsNavigation: NavigationItem[] = [
  {
    name: "Database",
    href: "/settings/database",
    icon: Database,
    rootOnly: false,
  },
  {
    name: "Log Storage",
    href: "/settings/logs",
    icon: HardDrive,
    rootOnly: false,
  },
  { name: "PEM Keys", href: "/settings/pem-keys", icon: Key, rootOnly: false },
  { name: "Users", href: "/settings/users", icon: Users, rootOnly: true },
  { name: "System", href: "/settings/system", icon: Shield, rootOnly: true },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  if (pathname === "/setup" || pathname === "/" || pathname === "/login") {
    return null;
  }

  const handleLogout = () => {
    logout();
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex h-screen flex-col bg-background border-r transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4">
          {!collapsed && (
            <div className="flex items-center hover:cursor-pointer">
              <Image
                src="/sentinel-logo1.webp"
                alt="Sentinel"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="ml-2 text-xl font-bold">Sentinel</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapsed}
            className={cn("h-8 w-8 p-0", collapsed && "mx-auto")}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <Separator />

        {/* User Info */}
        {user && (
          <div className={cn("px-4 py-4 border-b", collapsed && "px-2")}>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {user.username}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge
                      variant={user.role === "root" ? "default" : "secondary"}
                      className="text-xs px-2 py-0"
                    >
                      {user.role === "root" ? "Admin" : "User"}
                    </Badge>
                    <div className="h-1 w-1 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Online</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <Separator />

        {/* Main Navigation */}
        <ScrollArea className="flex-1 px-2 py-4">
          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");

              const navItem = (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start relative",
                      collapsed && "justify-center px-2"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                    {!collapsed && (
                      <>
                        <span>{item.name}</span>
                        {item.badge && (
                          <Badge
                            variant="destructive"
                            className="ml-auto h-5 w-5 p-0 text-xs"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                    {collapsed && item.badge && (
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full"></div>
                    )}
                  </Button>
                </Link>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.name}>
                    <TooltipTrigger asChild>{navItem}</TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return navItem;
            })}

            <div className="pt-4">
              {!collapsed && (
                <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Settings
                </p>
              )}
              <div className={cn("space-y-1", !collapsed && "mt-2")}>
                {settingsNavigation.map((item) => {
                  if (item.rootOnly && user?.role !== "root") {
                    return null;
                  }

                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  const navItem = (
                    <Link key={item.name} href={item.href}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          collapsed ? "justify-center px-2" : "justify-start",
                          !collapsed && "text-sm"
                        )}
                        size={collapsed ? "default" : "sm"}
                      >
                        <Icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                        {!collapsed && <span>{item.name}</span>}
                      </Button>
                    </Link>
                  );

                  if (collapsed) {
                    return (
                      <Tooltip key={item.name}>
                        <TooltipTrigger asChild>{navItem}</TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{item.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return navItem;
                })}
              </div>
            </div>
          </nav>
        </ScrollArea>

        {/* Logout */}
        <div className="p-4 border-t">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full text-destructive hover:text-destructive hover:bg-destructive/10",
                  collapsed ? "justify-center px-2" : "justify-start"
                )}
                onClick={handleLogout}
              >
                <LogOut className={cn("h-4 w-4", !collapsed && "mr-3")} />
                {!collapsed && <span>Sign Out</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">
                <p>Sign Out</p>
              </TooltipContent>
            )}
          </Tooltip>
          {user && !collapsed && (
            <div className="mt-2 text-xs text-muted-foreground text-center">
              Last login: {new Date(user.lastLogin || "").toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Sidebar;
