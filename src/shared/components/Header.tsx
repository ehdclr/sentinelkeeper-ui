"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Settings, User, LogOut, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/shared/store/authStore";

const getPageTitle = (pathname: string) => {
  const routes: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/agents": "Agents",
    "/logs": "Logs",
    "/alerts": "Alerts",
    "/settings": "Settings",
    "/settings/database": "Database Settings",
    "/settings/logs": "Log Storage Settings",
    "/settings/users": "User Management",
    "/settings/system": "System Settings",
  };

  return routes[pathname] || "Sentinel";
};

const Header = () => {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  // Don't show header on login/setup pages
  if (pathname === "/login" || pathname === "/setup" || pathname === "/") {
    return null;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {getPageTitle(pathname)}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {pathname === "/dashboard" &&
              "Monitor your system health and performance"}
            {pathname === "/agents" && "Manage and monitor your system agents"}
            {pathname === "/logs" && "Search and analyze system logs"}
            {pathname === "/alerts" &&
              "Configure system alerts and notifications"}
            {pathname.startsWith("/settings") &&
              "Configure system settings and preferences"}
          </p>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 px-3"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium">{user.username}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.username}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <Badge
                      variant={user.role === "root" ? "default" : "secondary"}
                      className="w-fit text-xs"
                    >
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
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;