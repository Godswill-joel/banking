"use client";

import React, { useState } from "react";
import {
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Home,
  Wallet,
  Settings,
  Bell,
  CreditCard,
  TrendingUp,
  LogOut,
  HelpCircle,
  User,
  Lock,
  Activity,
  Send,
  Download,
  History,
  Award,
  Bitcoin,
} from "lucide-react";
import { useSidebar } from "../contex/SidebarContex";
import { usePathname, useRouter } from "next/navigation";

export default function UserSidebar() {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const mainMenuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/dashboard",
      badge: null
    },
    {
      id: "wallet",
      label: "My Wallet",
      icon: Wallet,
      path: "/dashboard/wallet",
      badge: null
    },
    {
      id: "send",
      label: "Send Crypto",
      icon: Send,
      path: "/dashboard/send",
      badge: null
    },
    {
      id: "receive",
      label: "Receive",
      icon: Download,
      path: "/dashboard/receive",
      badge: null
    },
    {
      id: "invest",
      label: "Invest",
      icon: TrendingUp,
      path: "/dashboard/invest",
      badge: null
    },
    {
      id: "loans",
      label: "Loans",
      icon: DollarSign,
      path: "/dashboard/loans",
      badge: "2"
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: History,
      path: "/dashboard/transactions",
      badge: null
    },
    {
      id: "crypto-prices",
      label: "Market Prices",
      icon: Bitcoin,
      path: "/dashboard/prices",
      badge: null
    },
    {
      id: "rewards",
      label: "Rewards",
      icon: Award,
      path: "/dashboard/rewards",
      badge: "3"
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      path: "/dashboard/notifications",
      badge: "5"
    },
  ];

  const settingsMenuItems = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
      path: "/dashboard/settings/profile"
    },
    {
      id: "security",
      label: "Security",
      icon: Lock,
      path: "/dashboard/settings/security"
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: Settings,
      path: "/dashboard/settings/preferences"
    },
    {
      id: "payment-methods",
      label: "Payment Methods",
      icon: CreditCard,
      path: "/dashboard/settings/payment-methods"
    },
    {
      id: "activity",
      label: "Activity Log",
      icon: Activity,
      path: "/dashboard/settings/activity"
    },
    {
      id: "help",
      label: "Help & Support",
      icon: HelpCircle,
      path: "/dashboard/help"
    },
  ];

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    // Add your logout logic here
    router.push("/login");
  };

  return (
    <>
      <div
        className={`bg-gradient-to-b from-black via-gray-900 to-black shadow-2xl transition-all duration-300 ${isCollapsed ? "w-20" : "w-72"
          } h-screen fixed left-0 top-0 z-40 flex flex-col border-r border-[#B4925B]/20`}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#B4925B]/20 flex items-center justify-between backdrop-blur-xl bg-[#B4925B]/5">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B4925B] to-[#8B7355] flex items-center justify-center shadow-lg shadow-[#B4925B]/30">
                <Bitcoin className="w-6 h-6 text-black" />
              </div>
              <div>
                <span className="font-bold text-lg bg-gradient-to-r from-[#B4925B] to-white bg-clip-text text-transparent">
                  River
                </span>
                <p className="text-xs text-gray-400">Crypto Platform</p>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-[#B4925B]/10 rounded-lg transition-all text-[#B4925B]"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
          {/* Main Navigation */}
          <div>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-[#B4925B]/70 uppercase tracking-wider mb-3 px-3">
                Main Menu
              </h3>
            )}
            <ul className="space-y-2">
              {mainMenuItems.map(({ id, label, icon: Icon, path, badge }) => {
                const isActive = pathname === path;

                return (
                  <li key={id} className="relative">
                    <button
                      onClick={() => router.push(path)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${isActive
                          ? "bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black shadow-lg shadow-[#B4925B]/30"
                          : "text-gray-400 hover:bg-[#B4925B]/10 hover:text-[#B4925B]"
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon
                          size={20}
                          className={isActive ? "text-black" : "text-gray-500 group-hover:text-[#B4925B]"}
                        />
                        {!isCollapsed && <span className="font-medium">{label}</span>}
                      </div>
                      {!isCollapsed && badge && (
                        <span className="bg-[#B4925B] text-black text-xs font-bold px-2 py-0.5 rounded-full">
                          {badge}
                        </span>
                      )}
                    </button>
                    {isCollapsed && badge && (
                      <span className="absolute -top-1 -right-1 bg-[#B4925B] text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-[#B4925B]/30">
                        {badge}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Settings & Support */}
          <div>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-[#B4925B]/70 uppercase tracking-wider mb-3 px-3">
                Settings & Support
              </h3>
            )}
            <ul className="space-y-2">
              {settingsMenuItems.map(({ id, label, icon: Icon, path }) => {
                const isActive = pathname === path;

                return (
                  <li key={id}>
                    <button
                      onClick={() => router.push(path)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all group ${isActive
                          ? "bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black shadow-lg shadow-[#B4925B]/30"
                          : "text-gray-400 hover:bg-[#B4925B]/10 hover:text-[#B4925B]"
                        }`}
                    >
                      <Icon
                        size={20}
                        className={isActive ? "text-black" : "text-gray-500 group-hover:text-[#B4925B]"}
                      />
                      {!isCollapsed && <span className="font-medium">{label}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-[#B4925B]/20 backdrop-blur-xl bg-[#B4925B]/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all group"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-[#B4925B]/30 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-slideUp">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-[#B4925B]/20">
              <LogOut className="text-[#B4925B]" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              Confirm Logout
            </h2>
            <p className="text-gray-400 text-center mb-6">
              Are you sure you want to logout? You&apos;ll need to sign in again to access your account.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-6 py-3 border-2 border-[#B4925B]/30 text-gray-300 rounded-xl font-semibold hover:bg-[#B4925B]/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black rounded-xl font-semibold hover:shadow-xl hover:shadow-[#B4925B]/30 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(180, 146, 91, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(180, 146, 91, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(180, 146, 91, 0.5);
        }
      `}</style>
    </>
  );
}