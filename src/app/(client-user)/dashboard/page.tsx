"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserData } from "@/lib/hook/useUserData";
import { useFormatPrice } from "@/lib/hook/useFormatPrice";
import { auth, db } from "@/firebase/config";
import {
    collection, query, where, orderBy, onSnapshot, Timestamp,
} from "firebase/firestore";
import {
    Wallet, TrendingUp, DollarSign, Send, Download,
    Eye, EyeOff, RefreshCw, Shield, Award, ChevronRight,
    Clock, CheckCircle, ArrowDownCircle, BarChart2, PlusCircle,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Investment {
    id: string;
    planId: string;
    planName: string;
    amount: number;
    roi: number;
    duration: string;
    durationDays: number;
    payoutFrequency: string;
    status: "pending" | "active" | "completed" | "cancelled" | "withdraw_requested";
    createdAt: Timestamp;
    confirmedAt?: Timestamp;
}

// ─── Meta ───────────────────────────────────────────────────────────────────────

const PLAN_META: Record<string, { icon: React.ElementType; gradient: string; light: string }> = {
    starter: { icon: Shield, gradient: "from-emerald-500 to-green-600", light: "from-emerald-500/10 to-green-600/5" },
    growth: { icon: TrendingUp, gradient: "from-blue-500 to-cyan-600", light: "from-blue-500/10 to-cyan-600/5" },
    premium: { icon: Award, gradient: "from-purple-500 to-pink-600", light: "from-purple-500/10 to-pink-600/5" },
};

const DURATION_DAYS: Record<string, number> = { starter: 30, growth: 60, premium: 90 };

// ─── Helpers ───────────────────────────────────────────────────────────────────

function calcEarnings(inv: Investment): number {
    if (inv.status === "pending" || inv.status === "cancelled") return 0;
    const start = inv.confirmedAt?.toDate() ?? inv.createdAt.toDate();
    const days = Math.min(
        (Date.now() - start.getTime()) / 86400000,
        inv.durationDays ?? DURATION_DAYS[inv.planId] ?? 30
    );
    return parseFloat((inv.amount * (inv.roi / 100 / 30) * days).toFixed(2));
}

function calcProgress(inv: Investment): number {
    if (inv.status === "pending" || inv.status === "cancelled") return 0;
    const start = inv.confirmedAt?.toDate() ?? inv.createdAt.toDate();
    const total = (inv.durationDays ?? DURATION_DAYS[inv.planId] ?? 30) * 86400000;
    return Math.min(100, Math.round(((Date.now() - start.getTime()) / total) * 100));
}

const STATUS_PILL: Record<string, { label: string; className: string; icon: React.ElementType }> = {
    pending: { label: "Pending", className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: Clock },
    active: { label: "Active", className: "bg-green-500/10 text-green-400 border-green-500/20", icon: CheckCircle },
    completed: { label: "Completed", className: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: CheckCircle },
    withdraw_requested: { label: "Withdrawing", className: "bg-orange-500/10 text-orange-400 border-orange-500/20", icon: ArrowDownCircle },
};

// ─── Investment Card ───────────────────────────────────────────────────────────

function InvestmentCard({ inv, onClick }: { inv: Investment; onClick: () => void }) {
    const meta = PLAN_META[inv.planId] ?? PLAN_META.starter;
    const Icon = meta.icon;
    const earnings = calcEarnings(inv);
    const progress = calcProgress(inv);
    const pill = STATUS_PILL[inv.status] ?? STATUS_PILL.pending;
    const PillIcon = pill.icon;

    return (
        <div
            onClick={onClick}
            className={`relative bg-gradient-to-br ${meta.light} border border-white/10 rounded-2xl p-4 cursor-pointer hover:border-[#B4925B]/40 hover:scale-[1.01] transition-all duration-200 group`}
        >
            {/* Top row */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        <Icon className="text-white" size={17} />
                    </div>
                    <div>
                        <p className="text-white text-sm font-semibold leading-tight">{inv.planName}</p>
                        <p className="text-gray-500 text-xs">{inv.payoutFrequency} payout</p>
                    </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${pill.className}`}>
                    <PillIcon size={10} /> {pill.label}
                </span>
            </div>

            {/* Amounts */}
            <div className="flex items-end justify-between mb-3">
                <div>
                    <p className="text-gray-500 text-xs">Invested</p>
                    <p className="text-white font-bold text-lg">${inv.amount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-gray-500 text-xs">Earnings</p>
                    <p className="text-green-400 font-bold text-lg">+${earnings.toFixed(2)}</p>
                </div>
                <div className="text-right">
                    <p className="text-gray-500 text-xs">ROI</p>
                    <p className="text-[#B4925B] font-bold text-lg">{inv.roi}%</p>
                </div>
            </div>

            {/* Progress bar */}
            {(inv.status === "active" || inv.status === "completed") && (
                <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{progress}% of {inv.duration}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full bg-gradient-to-r ${meta.gradient}`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {inv.status === "pending" && (
                <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                    <p className="text-yellow-400 text-xs">Awaiting payment confirmation</p>
                </div>
            )}

            {/* Arrow */}
            <ChevronRight size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 group-hover:text-[#B4925B] transition-colors" />
        </div>
    );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────

export default function RiverUserDashboard() {
    const router = useRouter();
    const { userData, loading, error } = useUserData();
    const { formatUSD } = useFormatPrice();
    const [showBalance, setShowBalance] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [invLoading, setInvLoading] = useState(true);

    const user = userData;

    // ─── Fetch active investments ────────────────────────────────────────────────
    useEffect(() => {
        const uid = auth.currentUser?.uid;
        if (!uid) { setInvLoading(false); return; }

        const q = query(
            collection(db, "investments"),
            where("userId", "==", uid),
            where("status", "in", ["pending", "active", "withdraw_requested"]),
            orderBy("createdAt", "desc")
        );

        return onSnapshot(q, (snap) => {
            setInvestments(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Investment)));
            setInvLoading(false);
        });
    }, [user]);

    // ─── Summary stats from investments ─────────────────────────────────────────
    const activeInvestments = investments.filter((i) => i.status === "active");
    const totalInvested = activeInvestments.reduce((s, i) => s + i.amount, 0);
    const totalEarnings = activeInvestments.reduce((s, i) => s + calcEarnings(i), 0);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 800);
    };

    const quickActions = [
        { title: "Send", icon: Send, path: "/send" },
        { title: "Receive", icon: Download, path: "/receive" },
        { title: "Invest", icon: TrendingUp, path: "/invest" },
        { title: "Loan", icon: DollarSign, path: "/loans" },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-xl animate-pulse">Loading dashboard...</div>
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
                                    <h2 className="text-black font-semibold text-lg">Total Balance (USD)</h2>
                                </div>
                                <div className="flex items-center gap-3">
                                    {showBalance ? (
                                        <h1 className="text-5xl md:text-6xl font-bold text-black">{formatUSD(user.balance)}</h1>
                                    ) : (
                                        <h1 className="text-5xl md:text-6xl font-bold text-black">••••••</h1>
                                    )}
                                    <button onClick={() => setShowBalance(!showBalance)} className="p-2 hover:bg-black/10 rounded-lg transition-all">
                                        {showBalance ? <Eye className="text-black" size={20} /> : <EyeOff className="text-black" size={20} />}
                                    </button>
                                </div>
                            </div>
                            <button onClick={handleRefresh} className={`p-3 bg-black/20 hover:bg-black/30 rounded-xl transition-all ${isRefreshing ? "animate-spin" : ""}`}>
                                <RefreshCw className="text-black" size={20} />
                            </button>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {quickActions.map((action) => (
                                <button
                                    key={action.title}
                                    onClick={() => router.push(action.path)}
                                    className="bg-black/20 hover:bg-black/30 p-4 rounded-xl transition-all hover:scale-105 flex flex-col items-center gap-2"
                                >
                                    <div className="p-3 rounded-lg bg-black">
                                        <action.icon className="text-white" size={20} />
                                    </div>
                                    <span className="text-black text-sm font-semibold">{action.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Investment Summary Strip */}
                {(totalInvested > 0 || totalEarnings > 0) && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="bg-black/60 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#B4925B]/10 border border-[#B4925B]/20 flex items-center justify-center flex-shrink-0">
                                <Wallet size={18} className="text-[#B4925B]" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Total Invested</p>
                                <p className="text-[#B4925B] font-bold">${totalInvested.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="bg-black/60 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                                <TrendingUp size={18} className="text-green-400" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Earnings So Far</p>
                                <p className="text-green-400 font-bold">+${totalEarnings.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="hidden md:flex bg-black/60 border border-white/10 rounded-2xl p-4 items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                                <BarChart2 size={18} className="text-blue-400" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Portfolio Value</p>
                                <p className="text-blue-400 font-bold">${(totalInvested + totalEarnings).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Active Investments Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-white font-bold text-lg">Active Investments</h2>
                        <button
                            onClick={() => router.push("/dashboard/invest/my-investment")}
                            className="flex items-center gap-1.5 text-[#B4925B] text-sm font-semibold hover:underline transition-colors"
                        >
                            View All <ChevronRight size={15} />
                        </button>
                    </div>

                    {/* Loading skeleton */}
                    {invLoading && (
                        <div className="space-y-3">
                            {[1, 2].map((i) => (
                                <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 animate-pulse">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-9 h-9 rounded-xl bg-white/10" />
                                        <div className="space-y-1.5">
                                            <div className="w-24 h-3 bg-white/10 rounded" />
                                            <div className="w-16 h-2.5 bg-white/10 rounded" />
                                        </div>
                                    </div>
                                    <div className="flex justify-between mb-3">
                                        <div className="w-20 h-6 bg-white/10 rounded" />
                                        <div className="w-20 h-6 bg-white/10 rounded" />
                                        <div className="w-14 h-6 bg-white/10 rounded" />
                                    </div>
                                    <div className="h-1.5 bg-white/10 rounded-full" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Has investments */}
                    {!invLoading && investments.length > 0 && (
                        <div className="space-y-3">
                            {investments.slice(0, 3).map((inv) => (
                                <InvestmentCard
                                    key={inv.id}
                                    inv={inv}
                                    onClick={() => router.push(`/my-investments`)}
                                />
                            ))}
                            {investments.length > 3 && (
                                <button
                                    onClick={() => router.push("/my-investments")}
                                    className="w-full py-3 border border-white/10 rounded-2xl text-gray-400 text-sm font-semibold hover:border-[#B4925B]/40 hover:text-[#B4925B] transition-all"
                                >
                                    +{investments.length - 3} more investment{investments.length - 3 > 1 ? "s" : ""}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Empty state */}
                    {!invLoading && investments.length === 0 && (
                        <div className="bg-black/40 border border-white/5 rounded-2xl p-8 flex flex-col items-center text-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <BarChart2 size={26} className="text-gray-600" />
                            </div>
                            <div>
                                <p className="text-white font-semibold mb-1">No active investments</p>
                                <p className="text-gray-500 text-sm max-w-xs">Start growing your money today. Choose a plan and earn passive income every month.</p>
                            </div>
                            <button
                                onClick={() => router.push("/invest")}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black font-bold rounded-xl text-sm hover:opacity-90 transition-opacity"
                            >
                                <PlusCircle size={16} /> Start Investing
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}