'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Wallet, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useSidebar } from '../contex/SidebarContex';
import { useUserData } from '@/lib/hook/useUserData';
import { useFormatPrice } from "@/lib/hook/useFormatPrice";


export default function UserHeader() {
  const { isCollapsed } = useSidebar();
  const { userData, loading } = useUserData();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { formatUSD } = useFormatPrice();


  if (loading) {
    return (
      <header className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-black via-gray-900 to-black border-b border-[#B4925B]/20 backdrop-blur-xl ${isCollapsed ? 'ml-20' : 'ml-72'} transition-all`}>
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

  if (!userData) return null;

  const displayName = `${userData.firstName} ${userData.lastName}`;
  const initials = `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase();
  const balance = userData.balance || 0;


  const HeaderButton = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button onClick={onClick} className="p-3 hover:bg-[#B4925B]/10 rounded-xl transition-all relative flex items-center">
      {children}
    </button>
  );

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-black via-gray-900 to-black border-b border-[#B4925B]/20 shadow-xl backdrop-blur-xl transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-72'}`}>
        <div className="flex items-center justify-end ">       
          <div className="relative">
            <HeaderButton onClick={() => { setShowUserMenu(!showUserMenu)}}>
              {userData.profileImage ? (
                <Image src={userData.profileImage} alt="Profile" width={40} height={40} className="rounded-full border-2 border-[#B4925B] object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B4925B] to-[#8B7355] flex items-center justify-center font-bold text-black shadow-lg">
                  {initials}
                </div>
              )}
              <div className="hidden lg:block text-left ml-2">
                <p className="font-medium text-white">{displayName}</p>
                <p className="text-xs text-gray-400">{userData.email}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </HeaderButton>

            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-72 bg-gradient-to-br from-gray-900 to-black border border-[#B4925B]/30 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-5 border-b border-[#B4925B]/20">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#B4925B] to-[#8B7355] flex items-center justify-center text-black font-bold text-xl shadow-xl">{initials}</div>
                    <div>
                      <p className="font-bold text-white text-lg">{displayName}</p>
                      <p className="text-sm text-gray-400">{userData.email}</p>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-[#B4925B]/10 rounded-xl border border-[#B4925B]/30">
                    <p className="text-xs text-gray-400">Account Balance</p>
                    <p className="text-2xl font-bold text-[#B4925B] mt-1">{formatUSD(balance)}</p>
                  </div>
                </div>

                <div className="p-3">
                  {[
                    { icon: User, label: 'My Profile' },
                    { icon: Wallet, label: 'Wallet' },
                    { icon: Settings, label: 'Settings' },
                  ].map(item => (
                    <button key={item.label} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#B4925B]/10 rounded-lg transition-all text-left group">
                      <item.icon className="w-5 h-5 text-gray-400 group-hover:text-[#B4925B]" />
                      <span className="text-gray-300 group-hover:text-white">{item.label}</span>
                    </button>
                  ))}
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
    </header>
  );
}