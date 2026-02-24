"use client";

import React from "react";
import {
  Users,
  DollarSign,
  Mail,
  ChevronLeft,
  ChevronRight,
  Home,
  Shield
} from "lucide-react";
import { useSidebar } from "../contex/SidebarContex";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/panel" },
    { id: "users", label: "Users", icon: Users, path: "/panel/users-page" },
    { id: "wallet", label: "Wallet", icon: Users, path: "/panel/wallet-page" },
    { id: "Investments", label: "Investments", icon: DollarSign, path: "/panel/loan" },
    { id: "communication", label: "Communication", icon: Mail, path: "/panel/communication" }
  ];

  return (
    <div
      className={`bg-white shadow-lg transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      } h-screen fixed left-0 top-0 z-40`}
    >
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-purple-500" />
            <span className="font-bold text-lg">Admin</span>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map(({ id, label, icon: Icon, path }) => {
            const isActive = pathname === path;

            return (
              <li key={id}>
                <button
                  onClick={() => router.push(path)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={20} />
                  {!isCollapsed && <span>{label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
