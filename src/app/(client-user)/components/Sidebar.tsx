"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { useSidebar } from "../contex/SidebarContex"; 

export default function UserSidebar() {
  const { isCollapsed, setIsCollapsed } = useSidebar(); // Use context instead of local state
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [pathname, setPathname] = useState("/dashboard");
  const router = useRouter();

  
  const mainMenuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/dashboard",
      badge: null,
      showInBottomNav: true,
    },
    {
      id: "wallet",
      label: "Wallet",
      icon: Wallet,
      path: "/dashboard/wallet",
      badge: null,
      showInBottomNav: true,
    },    
    {
      id: "receive",
      label: "Send/Receive",
      icon: Download,
      path: "/dashboard/receive",
      badge: null,
      showInBottomNav: false,
    },
    {
      id: "invest",
      label: "Invest",
      icon: TrendingUp,
      path: "/dashboard/invest",
      badge: null,
      showInBottomNav: true,
    },
    {
      id: "invest",
      label: "My Investments",
      icon: TrendingUp,
      path: "/dashboard/invest/my-investment",
      badge: null,
      showInBottomNav: true,
    },
    {
      id: "crypto-prices",
      label: "Prices",
      icon: Bitcoin,
      path: "/dashboard/prices",
      badge: null,
      showInBottomNav: true,
    },
    {
      id: "notifications",
      label: "Alerts",
      icon: Bell,
      path: "/dashboard/notifications",
      badge: "5",
      showInBottomNav: false,
    },
  ];

  const settingsMenuItems = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
      path: "/dashboard/profile",
    },
    {
      id: "help",
      label: "Help & Support",
      icon: HelpCircle,
      path: "/dashboard/help",
    },
  ];

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    alert("Logged out successfully!");
    setShowLogoutModal(false);
  };

  // Toggle function
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Get bottom nav items (for mobile)
  const bottomNavItems = mainMenuItems.filter((item) => item.showInBottomNav);

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <div
        className={`hidden lg:flex bg-gradient-to-b from-black via-gray-900 to-black shadow-2xl transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-72"
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
            onClick={toggleSidebar} // Use the toggle function
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
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${
                        isActive
                          ? "bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black shadow-lg shadow-[#B4925B]/30"
                          : "text-gray-400 hover:bg-[#B4925B]/10 hover:text-[#B4925B]"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon
                          size={20}
                          className={
                            isActive ? "text-black" : "text-gray-500 group-hover:text-[#B4925B]"
                          }
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
                      className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all group ${
                        isActive
                          ? "bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black shadow-lg shadow-[#B4925B]/30"
                          : "text-gray-400 hover:bg-[#B4925B]/10 hover:text-[#B4925B]"
                      }`}
                    >
                      <Icon
                        size={20}
                        className={
                          isActive ? "text-black" : "text-gray-500 group-hover:text-[#B4925B]"
                        }
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

      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-black via-gray-900 to-black border-b border-[#B4925B]/20 backdrop-blur-xl">
        <div className="flex items-center justify-between p-4">
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
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 hover:bg-[#B4925B]/10 rounded-lg transition-all text-[#B4925B]"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Full Menu Overlay */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-20">
          <div className="h-full overflow-y-auto p-6 pb-32">
            {/* Main Menu */}
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-[#B4925B]/70 uppercase tracking-wider mb-4 px-2">
                Main Menu
              </h3>
              <ul className="space-y-2">
                {mainMenuItems.map(({ id, label, icon: Icon, path, badge }) => {
                  const isActive = pathname === path;

                  return (
                    <li key={id}>
                      <button
                        onClick={() => {
                          router.push(path);
                          setShowMobileMenu(false); // Close mobile menu after navigation
                        }}
                        className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black shadow-lg"
                            : "text-gray-300 hover:bg-[#B4925B]/10 hover:text-[#B4925B]"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <Icon size={22} />
                          <span className="font-medium text-lg">{label}</span>
                        </div>
                        {badge && (
                          <span className="bg-[#B4925B] text-black text-xs font-bold px-2.5 py-1 rounded-full">
                            {badge}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Settings & Support */}
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-[#B4925B]/70 uppercase tracking-wider mb-4 px-2">
                Settings & Support
              </h3>
              <ul className="space-y-2">
                {settingsMenuItems.map(({ id, label, icon: Icon, path }) => {
                  const isActive = pathname === path;

                  return (
                    <li key={id}>
                      <button
                        onClick={() => {
                          router.push(path);
                          setShowMobileMenu(false); // Close mobile menu after navigation
                        }}
                        className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black shadow-lg"
                            : "text-gray-300 hover:bg-[#B4925B]/10 hover:text-[#B4925B]"
                        }`}
                      >
                        <Icon size={22} />
                        <span className="font-medium text-lg">{label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Logout */}
            <button
              onClick={() => {
                handleLogout();
                setShowMobileMenu(false);
              }}
              className="w-full flex items-center space-x-4 p-4 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut size={22} />
              <span className="font-medium text-lg">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black via-gray-900 to-black border-t border-[#B4925B]/20 backdrop-blur-xl pb-safe">
        <div className="flex items-center justify-around px-2 py-3">
          {bottomNavItems.map(({ id, label, icon: Icon, path, badge }) => {
            const isActive = pathname === path;

            return (
              <button
                key={id}
                onClick={() => router.push(path)}
                className="flex flex-col items-center justify-center flex-1 relative group"
              >
                <div
                  className={`p-3 rounded-2xl transition-all ${
                    isActive
                      ? "bg-gradient-to-br from-[#B4925B] to-[#8B7355] shadow-lg shadow-[#B4925B]/30"
                      : "hover:bg-[#B4925B]/10"
                  }`}
                >
                  <Icon
                    size={22}
                    className={isActive ? "text-black" : "text-gray-400 group-hover:text-[#B4925B]"}
                  />
                  {badge && (
                    <span className="absolute top-1 right-1 bg-[#B4925B] text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
                      {badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs mt-1 font-medium transition-colors ${
                    isActive ? "text-[#B4925B]" : "text-gray-500"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}

          {/* More Menu Button */}
          <button
            onClick={() => setShowMobileMenu(true)}
            className="flex flex-col items-center justify-center flex-1"
          >
            <div className="p-3 rounded-2xl hover:bg-[#B4925B]/10 transition-all">
              <Menu size={22} className="text-gray-400 group-hover:text-[#B4925B]" />
            </div>
            <span className="text-xs mt-1 font-medium text-gray-500">More</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-[#B4925B]/30 rounded-2xl shadow-2xl p-8 max-w-md w-full animate-slideUp">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-[#B4925B]/20">
              <LogOut className="text-[#B4925B]" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-2">Confirm Logout</h2>
            <p className="text-gray-400 text-center mb-6">
              Are you sure you want to logout? You&apos;ll need to sign in again to access your
              account.
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
    </>
  );
}