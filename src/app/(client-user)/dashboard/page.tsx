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

// ─── Meta (solid colours only) ─────────────────────────────────────────────────

const PLAN_META: Record<string, { icon: React.ElementType; tile: string; bar: string }> = {
    starter: { icon: Shield, tile: "bg-emerald-500/10 text-emerald-400", bar: "bg-emerald-400" },
    growth: { icon: TrendingUp, tile: "bg-blue-500/10 text-blue-400", bar: "bg-blue-400" },
    premium: { icon: Award, tile: "bg-purple-500/10 text-purple-400", bar: "bg-purple-400" },
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
    pending: { label: "Pending", className: "bg-yellow-500/10 text-yellow-400", icon: Clock },
    active: { label: "Active", className: "bg-green-500/10 text-green-400", icon: CheckCircle },
    completed: { label: "Completed", className: "bg-blue-500/10 text-blue-400", icon: CheckCircle },
    withdraw_requested: { label: "Withdrawing", className: "bg-orange-500/10 text-orange-400", icon: ArrowDownCircle },
};

// ─── Investment Row ────────────────────────────────────────────────────────────

function InvestmentRow({ inv, onClick }: { inv: Investment; onClick: () => void }) {
    const meta = PLAN_META[inv.planId] ?? PLAN_META.starter;
    const Icon = meta.icon;
    const earnings = calcEarnings(inv);
    const progress = calcProgress(inv);
    const pill = STATUS_PILL[inv.status] ?? STATUS_PILL.pending;
    const PillIcon = pill.icon;

    return (
        <button
            onClick={onClick}
            className="w-full text-left px-5 py-4 hover:bg-white/[0.03] transition-colors focus:outline-none focus-visible:bg-white/[0.05]"
        >
            <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${meta.tile}`}>
                    <Icon size={18} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="text-white text-sm font-semibold truncate">{inv.planName}</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${pill.className}`}>
                            <PillIcon size={10} /> {pill.label}
                        </span>
                    </div>
                    <p className="text-white/40 text-xs mt-0.5">
                        {inv.roi}% ROI · {inv.payoutFrequency} payout
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-white text-sm font-semibold">${inv.amount.toLocaleString()}</p>
                    <p className="text-green-400 text-xs mt-0.5">+${earnings.toFixed(2)}</p>
                </div>

                <ChevronRight size={16} className="text-white/20 flex-shrink-0 hidden sm:block" />
            </div>

            {(inv.status === "active" || inv.status === "completed") && (
                <div className="mt-3 pl-[60px]">
                    <div className="flex justify-between text-[11px] text-white/35 mb-1.5">
                        <span>{progress}% complete</span>
                        <span>{inv.duration}</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${meta.bar}`} style={{ width: `${progress}%` }} />
                    </div>
                </div>
            )}

            {inv.status === "pending" && (
                <div className="mt-2 pl-[60px] flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                    <p className="text-yellow-400 text-xs">Awaiting payment confirmation</p>
                </div>
            )}
        </button>
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
        { title: "Withdraw", icon: Download, path: "/dashboard/wallet" },
        { title: "Invest", icon: TrendingUp, path: "/dashboard/invest/my-investment" }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <div className="text-white/60 text-sm animate-pulse">Loading dashboard...</div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
                <div className="text-center">
                    <p className="text-red-400 text-xl font-semibold mb-2">Access denied</p>
                    <p className="text-white/50 text-sm">{error || "Please log in again."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] px-4 py-6 md:px-6 lg:px-8">
            <div className="max-w-3xl space-y-6">

                {/* Header */}
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-[#B4925B] text-black flex items-center justify-center font-semibold">
                            {user.firstName?.charAt(0)?.toUpperCase() ?? "U"}
                        </div>
                        <div>
                            <p className="text-white/40 text-xs">Welcome back</p>
                            <h1 className="text-white text-lg font-semibold leading-tight">{user.firstName}</h1>
                        </div>
                    </div>
                    <button
                        onClick={handleRefresh}
                        aria-label="Refresh"
                        className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 text-white/60 hover:text-[#B4925B] hover:border-[#B4925B]/40 flex items-center justify-center transition-colors"
                    >
                        <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                    </button>
                </header>

                {/* Balance card */}
                <section className="bg-[#B4925B] rounded-3xl p-6 md:p-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-black/70">
                            <Wallet size={18} />
                            <span className="text-sm font-medium">Total balance (USD)</span>
                        </div>
                        <button
                            onClick={() => setShowBalance(!showBalance)}
                            aria-label={showBalance ? "Hide balance" : "Show balance"}
                            className="p-2 -mr-2 rounded-full text-black/70 hover:bg-black/10 transition-colors"
                        >
                            {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                    </div>

                    <p className="text-black text-4xl md:text-5xl font-semibold tracking-tight mt-3">
                        {showBalance ? formatUSD(user.balance) : "••••••"}
                    </p>

                    {/* Quick actions */}
                    <div className="grid grid-cols-4 gap-3 mt-8">
                        {quickActions.map((action) => (
                            <button
                                key={action.title}
                                onClick={() => router.push(action.path)}
                                className="group flex flex-col items-center gap-2"
                            >
                                <span className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-transform">
                                    <action.icon size={20} />
                                </span>
                                <span className="text-black text-xs font-semibold">{action.title}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Summary */}
                {(totalInvested > 0 || totalEarnings > 0) && (
                    <section className="grid grid-cols-3 gap-3">
                        {[
                            { label: "Invested", value: `$${totalInvested.toLocaleString()}`, icon: Wallet, tone: "text-[#B4925B]", tile: "bg-[#B4925B]/10" },
                            { label: "Earnings", value: `+$${totalEarnings.toFixed(2)}`, icon: TrendingUp, tone: "text-green-400", tile: "bg-green-500/10" },
                            { label: "Portfolio", value: `$${(totalInvested + totalEarnings).toFixed(2)}`, icon: BarChart2, tone: "text-blue-400", tile: "bg-blue-500/10" },
                        ].map((s) => (
                            <div key={s.label} className="bg-[#111111] border border-white/[0.08] rounded-2xl p-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 ${s.tile}`}>
                                    <s.icon size={15} className={s.tone} />
                                </div>
                                <p className="text-white/40 text-xs">{s.label}</p>
                                <p className={`${s.tone} font-semibold text-sm sm:text-base mt-0.5 truncate`}>{s.value}</p>
                            </div>
                        ))}
                    </section>
                )}

                {/* Investments */}
                <section>
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h2 className="text-white font-semibold">Investments</h2>
                        <button
                            onClick={() => router.push("/dashboard/invest/my-investment")}
                            className="flex items-center gap-1 text-[#B4925B] text-sm font-medium hover:text-[#D4B98A] transition-colors"
                        >
                            View all <ChevronRight size={14} />
                        </button>
                    </div>

                    {/* Loading */}
                    {invLoading && (
                        <div className="bg-[#111111] border border-white/[0.08] rounded-3xl divide-y divide-white/[0.06]">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                                    <div className="w-11 h-11 rounded-full bg-white/10" />
                                    <div className="flex-1 space-y-2">
                                        <div className="w-28 h-3 bg-white/10 rounded" />
                                        <div className="w-20 h-2.5 bg-white/10 rounded" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="w-14 h-3 bg-white/10 rounded" />
                                        <div className="w-10 h-2.5 bg-white/10 rounded ml-auto" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* List */}
                    {!invLoading && investments.length > 0 && (
                        <div className="bg-[#111111] border border-white/[0.08] rounded-3xl overflow-hidden divide-y divide-white/[0.06]">
                            {investments.slice(0, 3).map((inv) => (
                                <InvestmentRow
                                    key={inv.id}
                                    inv={inv}
                                    onClick={() => router.push(`#`)}
                                />
                            ))}
                            {investments.length > 3 && (
                                <button
                                    onClick={() => router.push("/my-investments")}
                                    className="w-full py-4 text-sm font-medium text-white/50 hover:text-[#B4925B] hover:bg-white/[0.03] transition-colors"
                                >
                                    +{investments.length - 3} more investment{investments.length - 3 > 1 ? "s" : ""}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Empty */}
                    {!invLoading && investments.length === 0 && (
                        <div className="bg-[#111111] border border-white/[0.08] rounded-3xl p-10 flex flex-col items-center text-center gap-5">
                            <div className="w-14 h-14 rounded-full bg-white/[0.05] flex items-center justify-center">
                                <BarChart2 size={24} className="text-white/30" />
                            </div>
                            <div>
                                <p className="text-white font-semibold mb-1">No active investments</p>
                                <p className="text-white/40 text-sm max-w-xs">
                                    Choose a plan and start earning passive income every month.
                                </p>
                            </div>
                            <button
                                onClick={() => router.push("/invest")}
                                className="flex items-center gap-2 px-6 py-3 bg-[#B4925B] hover:bg-[#C1A578] text-black font-semibold rounded-full text-sm transition-colors"
                            >
                                <PlusCircle size={16} /> Start investing
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}