"use client";

import Image from "next/image";
import {
  BarChart3,
  Server,
  FileText,
  AlertTriangle,
  Database,
  HardDrive,
  Users,
  Shield,
  Home,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Agents", href: "/agents", icon: Server },
  { name: "Logs", href: "/logs", icon: FileText },
  { name: "Alerts", href: "/alerts", icon: AlertTriangle },
];

const settingsNavigation = [
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
  { name: "Users", href: "/settings/users", icon: Users, rootOnly: true },
  { name: "System", href: "/settings/system", icon: Shield, rootOnly: true },
];

const Sidebar = () => {
  const pathname = usePathname();
  // const {}

  if (pathname === "/setup" || pathname === "/" || pathname === "login") {
    return null;
  }

  // const handleLogout = () => {
  //   logout()
  // }

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r">
      {/* Header */}
      <div className="flex items-center px-6 py-4">
        <Image
          src="/sentinel-logo1.webp"
          alt="SentinelKeeper Logo"
          width={60}
          height={60}
          className="h-10 w-10 text-blue-600 rounded-full"
        />
        <span className="ml-2 text-xl font-bold text-gray-900">
          SentinelKeeper
        </span>
      </div>

      {/* UserInfo */}
      <Separator />
      {/* {!!users && (
        <div className= "px-">


        </div>
      )} */}

      <Separator />

      {/* Main Nav */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navigation.map(({ icon, name, href }) => {
          const Icon = icon;
          const isActive = pathname == href || pathname.startsWith(href + "/");

          return (
            <Link key={name} href={href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <Icon
                  className={cn("h-4 w-4 mr-3", isActive && "text-blue-900")}
                />
                <span className="text-sm font-medium text-gray-900">
                  {name}
                </span>
              </Button>
            </Link>
          );
        })}

        <div className="pt-4">
          <p className="px-3 text-xs font-smibold text-gray-500 uppercase tracking-wider">
            Settings
          </p>
          <div>
            {settingsNavigation.map(({ icon, name, href, rootOnly }) => {
              //TODO auth 이후 추가
              // if (rootOnly && user?.role !== "root") return null;

              const Icon = icon;
              const isActive =
                pathname == href || pathname.startsWith(href + "/");

              return (
                <Link key={name} href={href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 mr-3",
                        isActive && "text-blue-900"
                      )}
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {name}
                    </span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
