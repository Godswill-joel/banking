'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { Bell, Wallet, User, ChevronDown, Bitcoin, TrendingUp, Settings, LogOut } from 'lucide-react';
import { useSidebar } from '../contex/SidebarContex';
import { useUserData } from '@/lib/hook/useUserData'; 

export default function UserHeader() {
  const { isCollapsed } = useSidebar();
  const { userData, loading } = useUserData(); 
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

 
  if (loading) {
    return (
      <header className={`z-50 bg-gradient-to-r from-black via-gray-900 to-black border-b border-[#B4925B]/20 backdrop-blur-xl ${isCollapsed ? 'ml-20' : 'ml-72'} transition-all`}>
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-800 rounded animate-pulse" />
          <div className="flex items-center gap-4">
            <div className="h-12 w-32 bg-gray-800 rounded-xl animate-pulse" />
            <div className="w-10 h-10 bg-gray-800 rounded-full animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  
  if (!userData) {
    return null; 
  }

  const displayName = `${userData.firstName} ${userData.lastName}`;
  const initials = `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase();
  const balance = userData.balance || 0;

  const notifications = [
    { id: 1, title: "Investment Update", message: "Your BTC position is up 5.2%", time: "5 min ago", unread: true },
    { id: 2, title: "Loan Approved", message: "$3,000 loan request approved", time: "1h ago", unread: true },
    { id: 3, title: "Deposit Received", message: "+$500 from John Doe", time: "3h ago", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header
      className={`z-1 fixed top-0 left-0 right-0 bg-gradient-to-r from-black via-gray-900 to-black border-b border-[#B4925B]/20 shadow-xl backdrop-blur-xl transition-all duration-300 ${
        isCollapsed ? 'ml-20' : 'ml-72'
      }`}
    >
      <div className="px-3 py-2">
        <div className="flex justify-between items-center">
          {/* Left: Greeting */}
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#B4925B] to-white bg-clip-text text-transparent">
              River Dashboard
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Welcome back, <span className="text-[#B4925B] font-medium">{userData.firstName}</span>
            </p>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-4">
            {/* Balance Card */}
            <div className="hidden md:flex items-center gap-3 px-5 py-3 bg-[#B4925B]/10 border border-[#B4925B]/30 rounded-xl backdrop-blur-sm">
              <Wallet className="w-6 h-6 text-[#B4925B]" />
              <div>
                <p className="text-xs text-gray-400">Total Balance</p>
                <p className="text-lg font-bold text-[#B4925B]">
                  ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* BTC Price Ticker */}
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <Bitcoin className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-xs text-gray-400">BTC/USD</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-emerald-400">+2.5%</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="p-3 hover:bg-[#B4925B]/10 rounded-xl transition-all relative group"
              >
                <Bell className="w-5 h-5 text-gray-400 group-hover:text-[#B4925B]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#B4925B] text-black text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-96 bg-gradient-to-br from-gray-900 to-black border border-[#B4925B]/30 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="p-5 border-b border-[#B4925B]/20">
                    <h3 className="font-bold text-white text-lg">Notifications</h3>
                    <p className="text-sm text-gray-400">{unreadCount} unread</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-4 hover:bg-[#B4925B]/5 transition-all border-b border-[#B4925B]/10 ${
                          n.unread ? 'bg-[#B4925B]/5' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          {n.unread && <div className="w-2 h-2 bg-[#B4925B] rounded-full mt-2" />}
                          <div>
                            <h4 className="font-medium text-white">{n.title}</h4>
                            <p className="text-sm text-gray-400 mt-1">{n.message}</p>
                            <p className="text-xs text-gray-500 mt-2">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 text-center border-t border-[#B4925B]/20">
                    <button className="text-[#B4925B] hover:text-white font-medium text-sm">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-3 p-2 hover:bg-[#B4925B]/10 rounded-xl transition-all group"
              >
                {userData.profileImage ? (
                  <Image
                    src={userData.profileImage}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-[#B4925B] object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B4925B] to-[#8B7355] flex items-center justify-center font-bold text-black shadow-lg">
                    {initials}
                  </div>
                )}

                <div className="hidden lg:block text-left">
                  <p className="font-medium text-white">{displayName}</p>
                  <p className="text-xs text-gray-400">{userData.email}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-72 bg-gradient-to-br from-gray-900 to-black border border-[#B4925B]/30 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="p-5 border-b border-[#B4925B]/20">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#B4925B] to-[#8B7355] flex items-center justify-center text-black font-bold text-xl shadow-xl">
                        {initials}
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg">{displayName}</p>
                        <p className="text-sm text-gray-400">{userData.email}</p>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-[#B4925B]/10 rounded-xl border border-[#B4925B]/30">
                      <p className="text-xs text-gray-400">Account Balance</p>
                      <p className="text-2xl font-bold text-[#B4925B] mt-1">
                        ${balance.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="p-3">
                    <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#B4925B]/10 rounded-lg transition-all text-left group">
                      <User className="w-5 h-5 text-gray-400 group-hover:text-[#B4925B]" />
                      <span className="text-gray-300 group-hover:text-white">My Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#B4925B]/10 rounded-lg transition-all text-left group">
                      <Wallet className="w-5 h-5 text-gray-400 group-hover:text-[#B4925B]" />
                      <span className="text-gray-300 group-hover:text-white">Wallet</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#B4925B]/10 rounded-lg transition-all text-left group">
                      <Settings className="w-5 h-5 text-gray-400 group-hover:text-[#B4925B]" />
                      <span className="text-gray-300 group-hover:text-white">Settings</span>
                    </button>
                  </div>

                  <div className="border-t border-[#B4925B]/20 p-3">
                    <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 rounded-lg transition-all text-left group">
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
    </header>
  );
}