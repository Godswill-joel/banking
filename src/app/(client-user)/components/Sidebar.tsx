"use client";

import React, { useState, useEffect } from "react";
import { auth } from "@/firebase/config";
import { useRouter, usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Wallet,
  Bell,
  TrendingUp,
  LogOut,
  HelpCircle,
  User,
  Download,
  Bitcoin,
  Menu,
  X,
  MessageCircle,
} from "lucide-react";
import { useSidebar } from "../contex/SidebarContex";
import { signOut } from "firebase/auth";

export default function UserSidebar() {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Close mobile sidebar on route change
  useEffect(() => {
    setShowMobileMenu(false);
  }, [pathname]);

  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showMobileMenu]);

  const mainMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard", badge: null },
    { id: "wallet", label: "Wallet", icon: Wallet, path: "/dashboard/wallet", badge: null },
    { id: "receive", label: "Send/Receive", icon: Download, path: "/dashboard/receive", badge: null },
    { id: "invest", label: "Invest", icon: TrendingUp, path: "/dashboard/invest", badge: null },
    { id: "my-invest", label: "My Investments", icon: TrendingUp, path: "/dashboard/invest/my-investment", badge: null },
    { id: "prices", label: "Prices", icon: Bitcoin, path: "/dashboard/prices", badge: null },
    { id: "notifications", label: "Alerts", icon: Bell, path: "/dashboard/notifications", badge: "5" },
    { id: "chats", label: "Chats", icon: MessageCircle, path: "/dashboard/chat", badge: "5" },
  ];

  const settingsMenuItems = [
    { id: "profile", label: "Profile", icon: User, path: "/dashboard/profile" },
    { id: "help", label: "Help & Support", icon: HelpCircle, path: "/dashboard/help" },
  ];

  function navigate(path: string) {
    router.push(path);
    setShowMobileMenu(false);
  }

  function handleLogout() { setShowLogoutModal(true); }

  async function confirmLogout() {
    setIsLoggingOut(true);
    try {
      await signOut(auth);     
      router.push("/");   
    } catch (err) {
      console.error(err);
      alert("Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false); 
    }
  }

  function NavList({ collapsed }: { collapsed: boolean }) {
    return (
      <nav className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-8 custom-scrollbar">
        {/* Main */}
        <div>
          {!collapsed && (
            <h3 className="text-xs font-semibold text-[#B4925B]/70 uppercase tracking-wider mb-3 px-3">
              Main Menu
            </h3>
          )}
          <ul className="space-y-1">
            {mainMenuItems.map(({ id, label, icon: Icon, path, badge }) => {
              const isActive = pathname === path;
              return (
                <li key={id} className="relative">
                  <button
                    onClick={() => navigate(path)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${isActive
                      ? "bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black shadow-lg shadow-[#B4925B]/30"
                      : "text-gray-400 hover:bg-[#B4925B]/10 hover:text-[#B4925B]"
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={20} className={isActive ? "text-black" : "text-gray-500 group-hover:text-[#B4925B]"} />
                      {!collapsed && <span className="font-medium">{label}</span>}
                    </div>
                    {!collapsed && badge && (
                      <span className="bg-[#B4925B] text-black text-xs font-bold px-2 py-0.5 rounded-full">
                        {badge}
                      </span>
                    )}
                  </button>
                  {collapsed && badge && (
                    <span className="absolute -top-1 -right-1 bg-[#B4925B] text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-[#B4925B]/30">
                      {badge}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Settings */}
        <div>
          {!collapsed && (
            <h3 className="text-xs font-semibold text-[#B4925B]/70 uppercase tracking-wider mb-3 px-3">
              Settings & Support
            </h3>
          )}
          <ul className="space-y-1">
            {settingsMenuItems.map(({ id, label, icon: Icon, path }) => {
              const isActive = pathname === path;
              return (
                <li key={id}>
                  <button
                    onClick={() => navigate(path)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all group ${isActive
                      ? "bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black shadow-lg shadow-[#B4925B]/30"
                      : "text-gray-400 hover:bg-[#B4925B]/10 hover:text-[#B4925B]"
                      }`}
                  >
                    <Icon size={20} className={isActive ? "text-black" : "text-gray-500 group-hover:text-[#B4925B]"} />
                    {!collapsed && <span className="font-medium">{label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* ═══════════════════════════════════════════
          DESKTOP SIDEBAR — unchanged, fixed left
      ═══════════════════════════════════════════ */}
      <div
        className={`hidden lg:flex bg-gradient-to-b from-black via-gray-900 to-black shadow-2xl transition-all duration-300 ${isCollapsed ? "w-20" : "w-72"
          } h-screen fixed left-0 top-0 z-40 flex-col border-r border-[#B4925B]/20`}
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

        <NavList collapsed={isCollapsed} />

        {/* Logout */}
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


      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-black via-gray-900 to-black border-b border-[#B4925B]/20 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setShowMobileMenu(true)}
            className="p-2 hover:bg-[#B4925B]/10 rounded-xl transition-all text-[#B4925B]"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>


      {showMobileMenu && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowMobileMenu(false)}
        />
      )}


      <div
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-[80%] max-w-sm
          bg-gradient-to-b from-black via-gray-900 to-black
          border-r border-[#B4925B]/20 shadow-2xl flex flex-col
          transition-transform duration-300 ease-in-out
          ${showMobileMenu ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Mobile sidebar header */}
        <div className="p-4 border-b border-[#B4925B]/20 flex items-center justify-between bg-[#B4925B]/5 flex-shrink-0">
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
          <button
            onClick={() => setShowMobileMenu(false)}
            className="p-2 hover:bg-[#B4925B]/10 rounded-xl transition-all text-[#B4925B]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mobile nav list — always expanded (not collapsed) */}
        <NavList collapsed={false} />

        {/* Mobile logout */}
        <div className="p-4 border-t border-[#B4925B]/20 bg-[#B4925B]/5 flex-shrink-0">
          <button
            onClick={() => { setShowMobileMenu(false); handleLogout(); }}
            className="w-full flex items-center space-x-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all group"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          LOGOUT CONFIRMATION MODAL
      ═══════════════════════════════════════════ */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-[#B4925B]/30 rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-[#B4925B]/20">
              <LogOut className="text-[#B4925B]" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-2">Confirm Logout</h2>
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
                disabled={isLoggingOut}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black rounded-xl font-semibold hover:shadow-xl hover:shadow-[#B4925B]/30 transition-all"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}