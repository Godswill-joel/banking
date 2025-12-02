"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
    Users,
    DollarSign,
    AlertCircle,
    CreditCard,
    ArrowUp,
    ArrowDown,
    Plus,
    UserPlus,
    FileText,
    Settings,
    TrendingUp,
    Wallet
} from "lucide-react";
import { BitcoinLoadingScreen } from '../components/ProtectedRoute'
import { auth, db } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, getCountFromServer, orderBy, limit } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface UserData {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    profileImage?: string;
}

interface DashboardStats {
    totalUsers: number;
    totalRevenue: number;
    activeLoans: number;
    pendingRequests: number;
    newUsersToday: number;
    transactionsToday: number;
    activeSessions: number;
    userGrowth: number;
    revenueGrowth: number;
    loanGrowth: number;
    requestChange: number;
}

const getMotivationalQuote = () => {
    const quotes = [
        "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "The only way to do great work is to love what you do.",
        "Don't watch the clock; do what it does. Keep going.",
        "The future depends on what you do today.",
        "Success usually comes to those who are too busy to be looking for it.",
        "Opportunities don't happen. You create them.",
        "Your limitation—it's only your imagination.",
        "Great things never come from comfort zones.",
        "Dream it. Wish it. Do it.",
        "Success doesn't just find you. You have to go out and get it.",
    ];
    const index = Math.floor(Math.random() * quotes.length);
    return quotes[index];
};

export default function DashboardPage() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [userData, setUserData] = useState<UserData | null>(null);
    const [quote, setQuote] = useState(getMotivationalQuote());
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalRevenue: 0,
        activeLoans: 0,
        pendingRequests: 0,
        newUsersToday: 0,
        transactionsToday: 0,
        activeSessions: 0,
        userGrowth: 0,
        revenueGrowth: 0,
        loanGrowth: 0,
        requestChange: 0,
    });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Check authentication
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Fetch user data from Firestore
                try {
                    const usersRef = collection(db, "users");
                    const q = query(usersRef, where("uid", "==", user.uid));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const userDoc = querySnapshot.docs[0].data() as UserData;
                        setUserData(userDoc);

                        // Now fetch dashboard statistics
                        await fetchDashboardStats();
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                // Redirect to login if not authenticated
                router.push("/login");
            }
            setLoading(false);
        });

        return () => {
            clearInterval(timer);
            unsubscribe();
        };
    }, [router]);

    useEffect(() => {
        const quoteInterval = setInterval(() => {
            setQuote(getMotivationalQuote());
        }, 15000);

        return () => clearInterval(quoteInterval);
    }, []);



    const fetchDashboardStats = async () => {
        try {
            // Get total users count
            const usersRef = collection(db, "users");
            const usersSnapshot = await getCountFromServer(usersRef);
            const totalUsers = usersSnapshot.data().count;

            // Get users created today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayQuery = query(
                usersRef,
                where("createdAt", ">=", today)
            );
            const todaySnapshot = await getCountFromServer(todayQuery);
            const newUsersToday = todaySnapshot.data().count;

            // Get total revenue (sum of all wallet balances)
            const usersQuery = query(usersRef, where("balance", ">=", 0));
            const usersData = await getDocs(usersQuery);
            let totalRevenue = 0;
            usersData.forEach((doc) => {
                const data = doc.data();
                totalRevenue += data.balance || 0;
            });

            try {

                // Get active sessions (users with recent activity in last 30 minutes)
                const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
                const activeSessionsQuery = query(
                    usersRef,
                    where("lastLogin", ">=", thirtyMinutesAgo)
                );
                const activeSessionsSnapshot = await getCountFromServer(activeSessionsQuery);
                const activeSessions = activeSessionsSnapshot.data().count;

                // Calculate growth percentages (simplified - in real app, compare with previous period)
                const userGrowth = newUsersToday > 0 ? Math.round((newUsersToday / totalUsers) * 100) : 0;
                const revenueGrowth = 8; // Placeholder - should calculate from previous period
                const loanGrowth = 5; // Placeholder
                const requestChange = -3; // Placeholder

                setStats(prev => ({
                    ...prev,
                    totalUsers,
                    totalRevenue,
                    newUsersToday,
                    activeSessions,
                    userGrowth,
                    revenueGrowth,
                    loanGrowth,
                    requestChange,
                }));
            } catch (error) {
                console.log("Transactions collection not available, using defaults");
            }

        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
        }
    };

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };


    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const dashboardStats = [
        {
            title: "Total Users",
            value: stats.totalUsers.toLocaleString(),
            change: `${stats.userGrowth >= 0 ? '+' : ''}${stats.userGrowth}%`,
            trend: stats.userGrowth >= 0 ? "up" : "down",
            icon: Users,
            color: "from-blue-500 to-cyan-500",
        },
        {
            title: "Total Revenue",
            value: formatCurrency(stats.totalRevenue),
            change: `${stats.revenueGrowth >= 0 ? '+' : ''}${stats.revenueGrowth}%`,
            trend: stats.revenueGrowth >= 0 ? "up" : "down",
            icon: DollarSign,
            color: "from-green-500 to-emerald-500",
        },
        {
            title: "Active Loans",
            value: stats.activeLoans.toLocaleString(),
            change: `${stats.loanGrowth >= 0 ? '+' : ''}${stats.loanGrowth}%`,
            trend: stats.loanGrowth >= 0 ? "up" : "down",
            icon: CreditCard,
            color: "from-purple-500 to-pink-500",
        },
        {
            title: "Pending Requests",
            value: stats.pendingRequests.toLocaleString(),
            change: `${stats.requestChange >= 0 ? '+' : ''}${stats.requestChange}%`,
            trend: stats.requestChange >= 0 ? "up" : "down",
            icon: AlertCircle,
            color: "from-orange-500 to-red-500",
        },
    ];

    const quickLinks = [
        {
            title: "Add New User",
            description: "Create a new user account",
            icon: UserPlus,
            color: "from-blue-500 to-cyan-500",
            action: "/panel/users/add",
        },
        {
            title: "Manage Users",
            description: "View and edit user accounts",
            icon: Users,
            color: "from-purple-500 to-pink-500",
            action: "/panel/users",
        },
        {
            title: "Fund Wallet",
            description: "Add funds to user wallet",
            icon: Wallet,
            color: "from-green-500 to-emerald-500",
            action: "/panel/wallets/fund",
        },
        {
            title: "View Reports",
            description: "Access analytics and reports",
            icon: FileText,
            color: "from-orange-500 to-red-500",
            action: "/panel/reports",
        },
        {
            title: "Loan Requests",
            description: "Review pending loan applications",
            icon: TrendingUp,
            color: "from-indigo-500 to-blue-500",
            action: "/panel/loans",
        },
        {
            title: "Settings",
            description: "Configure system settings",
            icon: Settings,
            color: "from-gray-500 to-slate-500",
            action: "/panel/settings",
        },
    ];

    if (loading) {
        return <BitcoinLoadingScreen />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Welcome Section with Digital Clock */}
                <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl shadow-lg overflow-hidden">
                    <div className="relative p-6 md:p-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    {userData?.profileImage ? (
                                        <Image
                                            src={userData.profileImage}
                                            alt="Profile"
                                            className="w-12 h-12 rounded-full border-2 border-white object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/40 flex items-center justify-center border-2 border-white">
                                            <Users className="text-white" size={24} />
                                        </div>
                                    )}
                                    <div>
                                        <h1 className="text-3xl md:text-4xl font-bold text-white">
                                            {getGreeting()}, {userData?.firstName || "Admin"}! 👋
                                        </h1>
                                        <p className="text-blue-100 text-sm md:text-base">
                                            {userData?.role === "admin" ? "Administrator Dashboard" : "Welcome back to your dashboard"}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-blue-100 text-sm md:text-base max-w-2xl mt-2">
                                    &apos;{quote}&apos;
                                </p>

                            </div>

                            {/* Digital Clock */}
                            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 md:p-6 shadow-xl">
                                <div className="text-center">
                                    <div className="text-4xl md:text-5xl font-bold text-white font-mono tracking-wider mb-2 animate-pulse-subtle">
                                        {formatTime(currentTime)}
                                    </div>
                                    <div className="text-white/80 text-xs md:text-sm font-medium">
                                        {formatDate(currentTime)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {dashboardStats.map((stat, index) => (
                        <div
                            key={index}
                            className="group backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div
                                    className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}
                                >
                                    <stat.icon className="text-white" size={24} />
                                </div>
                                <div
                                    className={`flex items-center gap-1 text-sm font-semibold ${stat.trend === "up" ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {stat.trend === "up" ? (
                                        <ArrowUp size={16} />
                                    ) : (
                                        <ArrowDown size={16} />
                                    )}
                                    <span>{stat.change}</span>
                                </div>
                            </div>
                            <h3 className="text-gray-600 text-sm font-medium mb-1">
                                {stat.title}
                            </h3>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-xs text-gray-500 mt-2">Updated in real-time</p>
                        </div>
                    ))}
                </div>

                {/* Quick Links Section */}
                <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
                                <p className="text-gray-600 text-sm mt-1">
                                    Access frequently used features
                                </p>
                            </div>
                            <Plus className="text-gray-400" size={24} />
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {quickLinks.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => router.push(link.action)}
                                    className="group relative overflow-hidden backdrop-blur-sm bg-white/60 hover:bg-white border-2 border-gray-200 hover:border-transparent rounded-xl p-6 transition-all hover:shadow-xl hover:scale-105 text-left"
                                >
                                    {/* Gradient overlay on hover */}
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                                    ></div>

                                    <div className="relative z-10">
                                        <div
                                            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                                        >
                                            <link.icon className="text-white" size={28} />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            {link.title}
                                        </h3>
                                        <p className="text-sm text-gray-600">{link.description}</p>
                                    </div>

                                    {/* Arrow indicator */}
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowUp className="text-gray-400 rotate-45" size={20} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes pulse-subtle {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.9;
          }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
}
