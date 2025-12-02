"use client";

import React, { useState, useEffect } from "react";
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    Bitcoin,
    DollarSign,
    Euro,
    Send,
    Download,
    History,
    PieChart,
    ShieldCheck,
    Bell,
    Eye,
    EyeOff,
    RefreshCw,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
    Award,
    Clock,
} from "lucide-react";

// Types
interface CryptoPrice {
    symbol: string;
    name: string;
    price: number;
    change24h: number;
    icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface Transaction {
    id: string;
    type: "deposit" | "withdraw" | "loan" | "investment";
    amount: number;
    currency: string;
    status: "completed" | "pending" | "failed";
    date: string;
    description: string;
}

interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    balance: number;
    bitcoinBalance?: number;
    totalInvested?: number;
    activeLoans?: number;
    profileImage?: string | null;
    username?: string;
    phone?: string;
    country?: string;
    city?: string;
    walletAddress?: string;
}


export default function RiverUserDashboard() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "BTC" | "EUR">("USD");
    const [showBalance, setShowBalance] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Mock user data - replace with actual Firebase data
    const [userData] = useState<UserData>({
        firstName: "Charles",
        lastName: "Doe",
        email: "charles@river.com",
        balance: 12450.50,
        bitcoinBalance: 0.2847,
        totalInvested: 8500,
        activeLoans: 2,
    });

    // Mock crypto prices - replace with actual API
    const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([
        {
            symbol: "BTC",
            name: "Bitcoin",
            price: 43750.25,
            change24h: 2.5,
            icon: Bitcoin,
        },
        {
            symbol: "ETH",
            name: "Ethereum",
            price: 2340.80,
            change24h: -1.2,
            icon: TrendingUp,
        },
        {
            symbol: "USDT",
            name: "Tether",
            price: 1.00,
            change24h: 0.0,
            icon: DollarSign,
        },
    ]);

    // Mock transactions
    const [transactions] = useState<Transaction[]>([
        {
            id: "1",
            type: "deposit",
            amount: 5000,
            currency: "USD",
            status: "completed",
            date: "2 hours ago",
            description: "Bank Transfer",
        },
        {
            id: "2",
            type: "investment",
            amount: 0.05,
            currency: "BTC",
            status: "completed",
            date: "1 day ago",
            description: "Bitcoin Investment",
        },
        {
            id: "3",
            type: "loan",
            amount: 3000,
            currency: "USD",
            status: "pending",
            date: "2 days ago",
            description: "Personal Loan Request",
        },
    ]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Simulate crypto price updates
        const priceUpdate = setInterval(() => {
            setCryptoPrices(prev => prev.map(crypto => ({
                ...crypto,
                price: crypto.price * (1 + (Math.random() - 0.5) * 0.001),
                change24h: crypto.change24h + (Math.random() - 0.5) * 0.1,
            })));
        }, 5000);

        return () => {
            clearInterval(timer);
            clearInterval(priceUpdate);
        };
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });
    };

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    const convertBalance = () => {
        if (selectedCurrency === "USD") return userData.balance;
        if (selectedCurrency === "BTC") return userData.bitcoinBalance;
        return userData.balance * 0.92; // EUR conversion (mock)
    };

    const formatBalance = () => {
        const balance = convertBalance();
        if (selectedCurrency === "USD") return `$${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (selectedCurrency === "BTC") return `₿${balance.toFixed(8)}`;
        return `€${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const quickActions = [
        {
            title: "Send Crypto",
            icon: Send,
            color: "from-[#B4925B] to-[#8B7355]",
            action: "/send",
        },
        {
            title: "Receive",
            icon: Download,
            color: "from-emerald-500 to-teal-600",
            action: "/receive",
        },
        {
            title: "Invest",
            icon: TrendingUp,
            color: "from-blue-500 to-cyan-600",
            action: "/invest",
        },
        {
            title: "Get Loan",
            icon: DollarSign,
            color: "from-purple-500 to-pink-600",
            action: "/loans",
        },
    ];

    const portfolioStats = [
        {
            label: "Total Invested",
            value: `$${userData.totalInvested.toLocaleString()}`,
            change: "+12.5%",
            icon: PieChart,
            positive: true,
        },
        {
            label: "Active Loans",
            value: userData.activeLoans.toString(),
            change: "2 ongoing",
            icon: ShieldCheck,
            positive: true,
        },
        {
            label: "Today's Profit",
            value: "$+247.50",
            change: "+5.2%",
            icon: TrendingUp,
            positive: true,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header with Greeting and Clock */}
                <div className="backdrop-blur-xl bg-gradient-to-r from-black/80 to-gray-900/80 border border-[#B4925B]/20 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#B4925B] to-[#8B7355] flex items-center justify-center shadow-lg shadow-[#B4925B]/30">
                                        <span className="text-2xl font-bold text-black">
                                            {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#B4925B] to-white bg-clip-text text-transparent">
                                            {getGreeting()}, {userData.firstName}!
                                        </h1>
                                        <p className="text-gray-400 text-sm md:text-base">
                                            Welcome back to River
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Digital Clock */}
                            <div className="backdrop-blur-xl bg-black/40 border border-[#B4925B]/30 rounded-xl p-4 md:p-6 shadow-xl">
                                <div className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-[#B4925B] font-mono tracking-wider mb-2">
                                        {formatTime(currentTime)}
                                    </div>
                                    <div className="text-gray-400 text-xs md:text-sm font-medium">
                                        {currentTime.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Balance Card */}
                <div className="backdrop-blur-xl bg-gradient-to-br from-[#B4925B] to-[#8B7355] rounded-2xl shadow-2xl overflow-hidden border border-[#B4925B]/30">
                    <div className="p-6 md:p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Wallet className="text-black" size={24} />
                                    <h2 className="text-black font-semibold text-lg">Total Balance</h2>
                                </div>
                                <div className="flex items-center gap-3">
                                    {showBalance ? (
                                        <h1 className="text-5xl md:text-6xl font-bold text-black">
                                            {formatBalance()}
                                        </h1>
                                    ) : (
                                        <h1 className="text-5xl md:text-6xl font-bold text-black">••••••</h1>
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

                        {/* Currency Selector */}
                        <div className="flex gap-2 mb-6">
                            {(["USD", "BTC", "EUR"] as const).map((currency) => (
                                <button
                                    key={currency}
                                    onClick={() => setSelectedCurrency(currency)}
                                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${selectedCurrency === currency
                                        ? "bg-black text-[#B4925B]"
                                        : "bg-black/20 text-black hover:bg-black/30"
                                        }`}
                                >
                                    {currency}
                                </button>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    className="bg-black/20 hover:bg-black/30 backdrop-blur-sm p-4 rounded-xl transition-all hover:scale-105 flex flex-col items-center gap-2"
                                >
                                    <div className={`p-3 rounded-lg bg-gradient-to-br ${action.color}`}>
                                        <action.icon className="text-white" size={20} />
                                    </div>
                                    <span className="text-black text-sm font-semibold">{action.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Live Crypto Prices */}
                    <div className="lg:col-span-2 backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-[#B4925B]/20">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">Live Market Prices</h2>
                                <Zap className="text-[#B4925B]" size={20} />
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            {cryptoPrices.map((crypto) => (
                                <div
                                    key={crypto.symbol}
                                    className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 hover:border-[#B4925B]/30"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#B4925B] to-[#8B7355] flex items-center justify-center">
                                            <crypto.icon className="text-black" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">{crypto.name}</h3>
                                            <p className="text-sm text-gray-400">{crypto.symbol}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-white text-lg">
                                            ${crypto.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                        <div
                                            className={`flex items-center gap-1 ${crypto.change24h >= 0 ? "text-green-500" : "text-red-500"
                                                }`}
                                        >
                                            {crypto.change24h >= 0 ? (
                                                <ArrowUpRight size={16} />
                                            ) : (
                                                <ArrowDownRight size={16} />
                                            )}
                                            <span className="text-sm font-semibold">
                                                {Math.abs(crypto.change24h).toFixed(2)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Portfolio Stats */}
                    <div className="space-y-4">
                        {portfolioStats.map((stat, index) => (
                            <div
                                key={index}
                                className="backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-105"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div
                                        className="p-3 rounded-xl bg-gradient-to-br from-[#B4925B] to-[#8B7355]"
                                    >
                                        <stat.icon className="text-black" size={24} />
                                    </div>
                                    <span
                                        className={`text-sm font-semibold ${stat.positive ? "text-green-500" : "text-red-500"
                                            }`}
                                    >
                                        {stat.change}
                                    </span>
                                </div>
                                <h3 className="text-gray-400 text-sm mb-1">{stat.label}</h3>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-[#B4925B]/20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <History className="text-[#B4925B]" size={20} />
                                <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
                            </div>
                            <button className="text-[#B4925B] hover:text-[#8B7355] text-sm font-semibold transition-colors">
                                View All
                            </button>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            {transactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`p-3 rounded-lg ${transaction.type === "deposit"
                                                ? "bg-green-500/20"
                                                : transaction.type === "withdraw"
                                                    ? "bg-red-500/20"
                                                    : transaction.type === "investment"
                                                        ? "bg-blue-500/20"
                                                        : "bg-purple-500/20"
                                                }`}
                                        >
                                            {transaction.type === "deposit" ? (
                                                <Download className="text-green-500" size={20} />
                                            ) : transaction.type === "withdraw" ? (
                                                <Send className="text-red-500" size={20} />
                                            ) : transaction.type === "investment" ? (
                                                <TrendingUp className="text-blue-500" size={20} />
                                            ) : (
                                                <DollarSign className="text-purple-500" size={20} />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white capitalize">
                                                {transaction.type}
                                            </h3>
                                            <p className="text-sm text-gray-400">{transaction.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-white">
                                            {transaction.currency === "BTC" ? "₿" : "$"}
                                            {transaction.amount.toLocaleString()}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${transaction.status === "completed"
                                                    ? "bg-green-500/20 text-green-500"
                                                    : transaction.status === "pending"
                                                        ? "bg-yellow-500/20 text-yellow-500"
                                                        : "bg-red-500/20 text-red-500"
                                                    }`}
                                            >
                                                {transaction.status}
                                            </span>
                                            <span className="text-xs text-gray-500">{transaction.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}