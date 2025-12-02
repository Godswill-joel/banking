'use client';
import Image from 'next/image'
import React, { useState } from 'react';
import { Bell, Wallet, User, ChevronDown, Bitcoin, TrendingUp, Settings, LogOut } from 'lucide-react';
import { useSidebar } from '../contex/SidebarContex';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  balance: number;
  profileImage?: string;
}

export default function UserHeader() {
  const { isCollapsed } = useSidebar();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock user data - replace with actual data from auth context
  const userData: UserData = {
    firstName: "Charles",
    lastName: "Doe",
    email: "charles@river.com",
    balance: 12450.50,
    profileImage: undefined,
  };

  const notifications = [
    {
      id: 1,
      title: "Bitcoin Investment",
      message: "Your BTC investment gained 5.2% today",
      time: "5 min ago",
      type: "success",
      unread: true,
    },
    {
      id: 2,
      title: "Loan Approved",
      message: "Your loan request of $3,000 has been approved",
      time: "1 hour ago",
      type: "info",
      unread: true,
    },
    {
      id: 3,
      title: "Transaction Complete",
      message: "You received $500 from John Doe",
      time: "3 hours ago",
      type: "success",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header
      className={`z-50 bg-gradient-to-r from-black via-gray-900 to-black border-b border-[#B4925B]/20 shadow-xl backdrop-blur-xl transition-all duration-300 ${
        isCollapsed ? 'ml-20' : 'ml-72'
      }`}
    >
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Left Section - Greeting */}
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#B4925B] to-white bg-clip-text text-transparent">
              River Dashboard
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Welcome back, {userData.firstName}
            </p>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-4">
            {/* Balance Display */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#B4925B]/10 border border-[#B4925B]/30 rounded-xl">
              <Wallet className="w-5 h-5 text-[#B4925B]" />
              <div className="text-right">
                <p className="text-xs text-gray-400">Balance</p>
                <p className="text-sm font-bold text-[#B4925B]">
                  ${userData.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Market Trend Indicator */}
            <button className="hidden lg:flex items-center gap-2 p-2 hover:bg-[#B4925B]/10 rounded-xl transition-all group">
              <Bitcoin className="w-5 h-5 text-[#B4925B] group-hover:text-[#8B7355]" />
              <div className="text-left">
                <p className="text-xs text-gray-400">BTC</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-green-500">+2.5%</span>
                  <TrendingUp className="w-3 h-3 text-green-500" />
                </div>
              </div>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="p-2 hover:bg-[#B4925B]/10 rounded-xl transition-all relative group"
              >
                <Bell className="w-5 h-5 text-gray-400 group-hover:text-[#B4925B]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#B4925B] text-black text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-[#B4925B]/30">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-gradient-to-br from-gray-900 to-black border border-[#B4925B]/30 rounded-xl shadow-2xl z-50 animate-slideDown">
                  <div className="p-4 border-b border-[#B4925B]/20">
                    <h3 className="font-bold text-white">Notifications</h3>
                    <p className="text-xs text-gray-400 mt-1">{unreadCount} unread messages</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-[#B4925B]/10 hover:bg-[#B4925B]/5 transition-all cursor-pointer ${
                          notification.unread ? 'bg-[#B4925B]/5' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {notification.unread && (
                            <div className="w-2 h-2 bg-[#B4925B] rounded-full mt-2 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white text-sm">{notification.title}</h4>
                            <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-[#B4925B]/20">
                    <button className="text-sm text-[#B4925B] hover:text-[#8B7355] font-semibold transition-colors">
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center space-x-3 p-2 hover:bg-[#B4925B]/10 rounded-xl transition-all group"
              >
                {userData.profileImage ? (
                  <Image
                    src={userData.profileImage}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-[#B4925B] object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B4925B] to-[#8B7355] flex items-center justify-center shadow-lg">
                    <span className="text-black font-bold">
                      {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="hidden lg:block text-left">
                  <span className="font-medium text-white text-sm">
                    {userData.firstName} {userData.lastName}
                  </span>
                  <p className="text-xs text-gray-400">{userData.email}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#B4925B]" />
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-gradient-to-br from-gray-900 to-black border border-[#B4925B]/30 rounded-xl shadow-2xl z-50 animate-slideDown">
                  <div className="p-4 border-b border-[#B4925B]/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#B4925B] to-[#8B7355] flex items-center justify-center shadow-lg">
                        <span className="text-black font-bold text-lg">
                          {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-white">{userData.firstName} {userData.lastName}</p>
                        <p className="text-xs text-gray-400">{userData.email}</p>
                      </div>
                    </div>
                    <div className="bg-[#B4925B]/10 border border-[#B4925B]/30 rounded-lg p-3">
                      <p className="text-xs text-gray-400">Total Balance</p>
                      <p className="text-xl font-bold text-[#B4925B]">
                        ${userData.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 p-3 hover:bg-[#B4925B]/10 rounded-lg transition-all text-left group">
                      <User className="w-5 h-5 text-gray-400 group-hover:text-[#B4925B]" />
                      <span className="text-gray-300 group-hover:text-white">My Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 hover:bg-[#B4925B]/10 rounded-lg transition-all text-left group">
                      <Wallet className="w-5 h-5 text-gray-400 group-hover:text-[#B4925B]" />
                      <span className="text-gray-300 group-hover:text-white">My Wallet</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 hover:bg-[#B4925B]/10 rounded-lg transition-all text-left group">
                      <Settings className="w-5 h-5 text-gray-400 group-hover:text-[#B4925B]" />
                      <span className="text-gray-300 group-hover:text-white">Settings</span>
                    </button>
                  </div>
                  <div className="p-2 border-t border-[#B4925B]/20">
                    <button className="w-full flex items-center gap-3 p-3 hover:bg-red-500/10 rounded-lg transition-all text-left group">
                      <LogOut className="w-5 h-5 text-red-400" />
                      <span className="text-red-400 group-hover:text-red-300">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
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
    </header>
  );
}