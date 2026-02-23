"use client";

import React, { useState } from "react";
import { useUserData } from "@/lib/hook/useUserData";
import { useFormatPrice } from "@/lib/hook/useFormatPrice";
import {
    Wallet,
    TrendingUp,
    DollarSign,
    Send,
    Download,
    Eye,
    EyeOff,
    RefreshCw,
} from "lucide-react";
export default function RiverUserDashboard() {
    const { userData, loading, error } = useUserData();
    const [showBalance, setShowBalance] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { formatUSD } = useFormatPrice();
    const user = userData;
    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-xl animate-pulse">
                    Loading dashboard...
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-red-500 text-center">
                    <p className="text-2xl mb-2">Access Denied</p>
                    <p>{error || "Please log in again."}</p>
                </div>
            </div>
        );
    }


    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 800);
    };

    const quickActions = [
        { title: "Send", icon: Send },
        { title: "Receive", icon: Download },
        { title: "Invest", icon: TrendingUp },
        { title: "Loan", icon: DollarSign },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Welcome */}
                <div className="text-white">
                    <h1 className="text-2xl font-semibold">
                        Welcome back, {user.firstName} 👋
                    </h1>
                </div>

                {/* Balance Card */}
                <div className="bg-gradient-to-br from-[#B4925B] to-[#8B7355] rounded-2xl shadow-2xl border border-[#B4925B]/30">
                    <div className="p-6 md:p-8">

                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Wallet className="text-black" size={24} />
                                    <h2 className="text-black font-semibold text-lg">
                                        Total Balance (USD)
                                    </h2>
                                </div>

                                <div className="flex items-center gap-3">
                                    {showBalance ? (
                                        <h1 className="text-5xl md:text-6xl font-bold text-black">
                                            {formatUSD(user.balance)}
                                        </h1>
                                    ) : (
                                        <h1 className="text-5xl md:text-6xl font-bold text-black">
                                            ••••••
                                        </h1>
                                    )}

                                    <button
                                        onClick={() => setShowBalance(!showBalance)}
                                        className="p-2 hover:bg-black/10 rounded-lg transition-all"
                                    >
                                        {showBalance ? (
                                            <Eye className="text-black" size={20} />
                                        ) : (
                                            <EyeOff className="text-black" size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleRefresh}
                                className={`p-3 bg-black/20 hover:bg-black/30 rounded-xl transition-all ${isRefreshing ? "animate-spin" : ""
                                    }`}
                            >
                                <RefreshCw className="text-black" size={20} />
                            </button>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    className="bg-black/20 hover:bg-black/30 p-4 rounded-xl transition-all hover:scale-105 flex flex-col items-center gap-2"
                                >
                                    <div className="p-3 rounded-lg bg-black">
                                        <action.icon className="text-white" size={20} />
                                    </div>
                                    <span className="text-black text-sm font-semibold">
                                        {action.title}
                                    </span>
                                </button>
                            ))}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}