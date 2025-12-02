// components/Header.jsx
'use client';

import React from 'react';
import { Activity, Shield, Bell } from 'lucide-react';
import { useSidebar } from '../contex/SidebarContex';

export default function Header() {
    const { isCollapsed } = useSidebar();

    return (
        <header
            className={`bg-white shadow transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'
                }`}
        >
            <div className="px-6 py-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 hover:bg-gray-100 rounded-full relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <Activity className="w-5 h-5" />
                        </button>
                        <div className="flex items-center space-x-2">
                            <Shield className="w-5 h-5 text-purple-500" />
                            <span className="font-medium">Admin User</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
