"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    CreditCard,
    Shield,
    Clock,
    Lock,
    Wallet,
    CheckCircle,
    XCircle,
    Edit,
    ArrowLeft,
    TrendingUp,
    Send,
    Download,
    Ban,
    AlertTriangle,
    Activity,
    DollarSign,
    FileText,
    Plus,
    X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { createTransaction, fetchTransactions } from "@/firebase/firebaseTransactions";



export default function UserProfileView() {
    const params = useParams();
    const router = useRouter()
    const userId = params.id;
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");



    const [showCreateTxModal, setShowCreateTxModal] = useState(false);
    const [txType, setTxType] = useState<"deposit" | "withdraw" | "received" | "transfer">("deposit");
    const [status, setStatus] = useState<"completed" | "pending" | "failed" | "reverted">("completed");
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState<"USD" | "BTC">("USD");
    const [txDate, setTxDate] = useState("");
    const [description, setDescription] = useState("");
    const [creating, setCreating] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);


    useEffect(() => {
        console.log("userId param:", userId);
    }, [userId]);

    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) return;
            try {
                const userRef = doc(db, "users", userId);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    setUserData(userSnap.data());
                } else {
                    console.error("User not found");
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    useEffect(() => {
        if (!userId) return;
        const loadTransactions = async () => {
            const userTxs = await fetchTransactions(userId);
            setTransactions(userTxs);
        };
        loadTransactions();
    }, [userId]);


    if (loading) {
        return <div className="text-center py-20">Loading user data...</div>;
    }

    if (!userData) {
        return <div className="text-center py-20 text-red-600">User not found</div>;
    }

  
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-500';
            case 'pending': return 'bg-yellow-500';
            case 'failed': return 'bg-red-500';
            case 'reverted': return 'bg-orange-500';
            default: return 'bg-gray-500';
        }
    };

    const tabs = [
        { id: "overview", label: "Overview", icon: User },
        { id: "transactions", label: "Transactions", icon: Activity },
    ];

    const stats = [
        {
            label: "Total Balance",
            value: `$${userData.balance.toLocaleString()}`,
            icon: DollarSign,
            color: "from-green-500 to-emerald-500",
            change: "+12.5%",
        },
        {
            label: "Total Transactions",
            value: userData.transactions.length,
            icon: Activity,
            color: "from-blue-500 to-cyan-500",
            change: "+8",
        },
        {
            label: "Account Status",
            value: userData.kycVerified ? "Verified" : "Pending",
            icon: CheckCircle,
            color: "from-purple-500 to-pink-500",
            change: userData.kycVerified ? "Active" : "Review",
        },
    ];

    const handleCreate = () => {
        if (!amount || parseFloat(amount) <= 0) {
            alert("Enter valid amount");
            return;
        }
        setCreating(true);
        // Simulate creation
        setTimeout(() => {
            setCreating(false);
            setShowCreateTxModal(false);
            setAmount('');
            setDescription('');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header with Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <button className="p-3 hover:bg-white/80 rounded-xl transition-all backdrop-blur-sm border border-white/20 shadow-lg">
                            <ArrowLeft size={24} className="text-gray-700" />
                        </button>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                User Profile
                            </h1>
                            <p className="text-gray-600 text-sm md:text-base mt-1">
                                View and manage user details
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 w-full md:w-auto">
                        <Link href={`/panel/users-page/${userId}/edit-user`}>
                            <button
                                className="flex-1 md:flex-none px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl font-semibold text-gray-700 hover:bg-white transition-all shadow-lg flex items-center justify-center gap-2">
                                <Edit size={18} />
                                Edit
                            </button>
                        </Link>
                        <button className="flex-1 md:flex-none px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2">
                            <Send size={18} />
                            Message
                        </button>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl shadow-lg overflow-hidden">
                    <div className="relative h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                        <div className="absolute -bottom-16 left-8">
                            <div className="relative">
                                {userData.profileImage ? (
                                    <Image
                                        src={userData.profileImage}
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                        <span className="text-4xl font-bold text-white">
                                            {userData.firstName.charAt(0)}
                                            {userData.lastName.charAt(0)}
                                        </span>
                                    </div>
                                )}
                                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 px-8 pb-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {userData.firstName} {userData.lastName}
                                </h2>
                                <p className="text-gray-600 mt-1">@{userData.username}</p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold border border-purple-200">
                                        {userData.role.toUpperCase()}
                                    </span>
                                    {userData.kycVerified && (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold border border-green-200 flex items-center gap-1">
                                            <CheckCircle size={14} />
                                            KYC Verified
                                        </span>
                                    )}
                                    {userData.emailVerified && (
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold border border-blue-200">
                                            Email Verified
                                        </span>
                                    )}
                                    {userData.phoneVerified && (
                                        <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-lg text-xs font-semibold border border-cyan-200">
                                            Phone Verified
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all">
                                    <Ban size={20} />
                                </button>
                                <button className="p-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-xl transition-all">
                                    <AlertTriangle size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div
                                    className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}
                                >
                                    <stat.icon className="text-white" size={24} />
                                </div>
                                <span className="text-green-600 text-xs font-semibold bg-green-50 px-2 py-1 rounded-lg">
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-gray-600 text-sm font-medium mb-1">
                                {stat.label}
                            </h3>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl shadow-lg overflow-hidden">
                    <div className="border-b border-gray-200">
                        <div className="flex overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50"
                                        }`}
                                >
                                    <tab.icon size={20} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        {/* Overview Tab */}
                        {activeTab === "overview" && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Personal Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <User size={20} className="text-blue-600" />
                                            Personal Information
                                        </h3>

                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <Mail size={18} className="text-gray-400 mt-1" />
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium">
                                                        Email
                                                    </p>
                                                    <p className="text-sm text-gray-900 font-semibold">
                                                        {userData.email}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <Phone size={18} className="text-gray-400 mt-1" />
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium">
                                                        Phone
                                                    </p>
                                                    <p className="text-sm text-gray-900 font-semibold">
                                                        {userData.phone}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <Calendar size={18} className="text-gray-400 mt-1" />
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium">
                                                        Date of Birth
                                                    </p>
                                                    <p className="text-sm text-gray-900 font-semibold">
                                                        {new Date(userData.dateOfBirth).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            }
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <MapPin size={18} className="text-gray-400 mt-1" />
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium">
                                                        Address
                                                    </p>
                                                    <p className="text-sm text-gray-900 font-semibold">
                                                        {userData.address}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {userData.city}, {userData.country} {userData.zipCode}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Account Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Shield size={20} className="text-purple-600" />
                                            Account Information
                                        </h3>

                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <Wallet size={18} className="text-gray-400 mt-1" />
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium">
                                                        Wallet Address
                                                    </p>
                                                    <p className="text-xs text-gray-900 font-mono break-all">
                                                        {userData.walletAddress}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <CreditCard size={18} className="text-gray-400 mt-1" />
                                                <div>
                                                    <p className="text-xs text-gray-500 font-medium">
                                                        Current Balance
                                                    </p>
                                                    <p className="text-sm text-gray-900 font-bold">
                                                        ${userData.balance.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <Clock size={18} className="text-gray-400 mt-1" />
                                                <div>
                                                    <p className="text-xs text-black font-medium">
                                                        Account Created
                                                    </p>
                                                    <p className=" text-black">
                                                        {userData.createdAt.toDate
                                                            ? userData.createdAt.toDate().toLocaleDateString()
                                                            : new Date(userData.createdAt.seconds * 1000).toLocaleDateString()}
                                                    </p>

                                                </div>
                                            </div>                                          

                                        </div>
                                    </div>
                                </div>

                                {/* Verification Status */}
                                <div className="mt-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <CheckCircle size={20} className="text-green-600" />
                                        Verification Status
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div
                                            className={`p-4 rounded-xl border-2 ${userData.emailVerified
                                                ? "bg-green-50 border-green-200"
                                                : "bg-red-50 border-red-200"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Mail
                                                        size={20}
                                                        className={
                                                            userData.emailVerified
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                        }
                                                    />
                                                    <span className="font-semibold text-gray-900">
                                                        Email
                                                    </span>
                                                </div>
                                                {userData.emailVerified ? (
                                                    <CheckCircle size={20} className="text-green-600" />
                                                ) : (
                                                    <XCircle size={20} className="text-red-600" />
                                                )}
                                            </div>
                                            <p
                                                className={`text-xs mt-2 font-medium ${userData.emailVerified
                                                    ? "text-green-700"
                                                    : "text-red-700"
                                                    }`}
                                            >
                                                {userData.emailVerified ? "Verified" : "Not Verified"}
                                            </p>
                                        </div>

                                        <div
                                            className={`p-4 rounded-xl border-2 ${userData.phoneVerified
                                                ? "bg-green-50 border-green-200"
                                                : "bg-red-50 border-red-200"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Phone
                                                        size={20}
                                                        className={
                                                            userData.phoneVerified
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                        }
                                                    />
                                                    <span className="font-semibold text-gray-900">
                                                        Phone
                                                    </span>
                                                </div>
                                                {userData.phoneVerified ? (
                                                    <CheckCircle size={20} className="text-green-600" />
                                                ) : (
                                                    <XCircle size={20} className="text-red-600" />
                                                )}
                                            </div>
                                            <p
                                                className={`text-xs mt-2 font-medium ${userData.phoneVerified
                                                    ? "text-green-700"
                                                    : "text-red-700"
                                                    }`}
                                            >
                                                {userData.phoneVerified ? "Verified" : "Not Verified"}
                                            </p>
                                        </div>

                                        <div
                                            className={`p-4 rounded-xl border-2 ${userData.kycVerified
                                                ? "bg-green-50 border-green-200"
                                                : "bg-red-50 border-red-200"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Shield
                                                        size={20}
                                                        className={
                                                            userData.kycVerified
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                        }
                                                    />
                                                    <span className="font-semibold text-gray-900">
                                                        KYC
                                                    </span>
                                                </div>
                                                {userData.kycVerified ? (
                                                    <CheckCircle size={20} className="text-green-600" />
                                                ) : (
                                                    <XCircle size={20} className="text-red-600" />
                                                )}
                                            </div>
                                            <p
                                                className={`text-xs mt-2 font-medium ${userData.kycVerified
                                                    ? "text-green-700"
                                                    : "text-red-700"
                                                    }`}
                                            >
                                                {userData.kycVerified ? "Verified" : "Pending Review"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Transactions Tab */}
                        {activeTab === "transactions" && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Transaction History</h3>
                                        <p className="text-sm text-gray-500 mt-1">View and manage all transactions</p>
                                    </div>
                                    <button
                                        onClick={() => setShowCreateTxModal(true)}
                                        className="px-5 py-2.5 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl font-semibold hover:from-gray-800 hover:to-gray-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Create Transaction
                                    </button>
                                </div>

                                {transactions.length === 0 ? (
                                    <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Activity size={40} className="text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            No Transactions Yet
                                        </h3>
                                        <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                                            This user hasn&apos;t made any transactions yet. Click the button above to create their first transaction.
                                        </p>
                                        <button
                                            onClick={() => setShowCreateTxModal(true)}
                                            className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all inline-flex items-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Create First Transaction
                                        </button>
                                    </div>
                                ) : (
                                    <div className="overflow-hidden border border-gray-200 rounded-2xl shadow-sm">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                                    <tr>
                                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                            Date
                                                        </th>
                                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                            Type
                                                        </th>
                                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                            Amount
                                                        </th>
                                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                            Currency
                                                        </th>
                                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                            Status
                                                        </th>
                                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                            Description
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {transactions.map((tx) => (
                                                        <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                                {tx.date}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${tx.type === 'deposit'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-red-100 text-red-800'
                                                                    }`}>
                                                                    <div className={`w-1.5 h-1.5 rounded-full ${tx.type === 'deposit' ? 'bg-green-500' : 'bg-red-500'
                                                                        }`} />
                                                                    {tx.type === 'deposit' ? 'Deposit' : 'Withdraw'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                                {tx.currency === 'USD' ? '$' : '₿'}{tx.amount.toLocaleString()}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                                                {tx.currency}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${tx.status === 'completed'
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : tx.status === 'pending'
                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                    {tx.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                                                {tx.description || '—'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>


                {showCreateTxModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg lg:max-w-2xl overflow-hidden max-h-[95vh] flex flex-col transform transition-all duration-300 ease-out scale-100 opacity-100">

                            {/* Modal Header */}
                            <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center flex-shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                        <Plus className="w-4 h-4 text-white" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-white">Create New Transaction</h2>
                                </div>
                                <button
                                    onClick={() => setShowCreateTxModal(false)}
                                    className="p-1 rounded-full text-white hover:bg-white/10 transition-colors group"
                                    aria-label="Close modal"
                                >
                                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 overflow-y-auto flex-grow">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">

                                    {/* Transaction Type */}
                                    <div className="space-y-2">
                                        <label htmlFor="txTypeSelect" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <div className={`w-2.5 h-2.5 rounded-full ${txType === 'deposit' ? 'bg-green-500' : 'bg-red-500'} transition-colors`} />
                                            Transaction Type
                                        </label>
                                        <select
                                            id="txTypeSelect"
                                            value={txType}
                                            onChange={(e) => setTxType(e.target.value as "deposit" | "withdraw" | "received" | "transfer")}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white hover:border-gray-400 font-normal text-gray-800 shadow-sm appearance-none"
                                        >
                                            <option value="deposit">Deposit</option>
                                            <option value="withdraw">Withdraw</option>
                                            <option value="transfer">Transfer</option>
                                            <option value="received">Received</option>
                                        </select>
                                    </div>

                                    {/* Transaction Status - NEW SECTION */}
                                    <div className="space-y-2">
                                        <label htmlFor="statusSelect" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor('completed')} transition-colors`} />
                                            Transaction Status
                                        </label>
                                        <select
                                            id="statusSelect"
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value as "completed" | "pending" | "failed" | "reverted")}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white hover:border-gray-400 font-normal text-gray-800 shadow-sm appearance-none"
                                        >
                                            <option value="completed">Completed</option>
                                            <option value="pending">Pending</option>
                                            <option value="failed">Failed</option>
                                            <option value="reverted">Reverted</option>
                                        </select>
                                    </div>

                                    {/* Amount */}
                                    <div className="space-y-2">
                                        <label htmlFor="amountInput" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <DollarSign className="w-4 h-4 text-gray-500" />
                                            Amount
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="amountInput"
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white hover:border-gray-400 font-medium text-gray-900 shadow-sm pr-12"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">
                                                {currency === 'USD' ? '$' : '₿'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Currency */}
                                    <div className="space-y-2">
                                        <label htmlFor="currencySelect" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                                            Currency
                                        </label>
                                        <select
                                            id="currencySelect"
                                            value={currency}
                                            onChange={(e) => setCurrency(e.target.value as "USD" | "BTC")}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white hover:border-gray-400 font-normal text-gray-800 shadow-sm appearance-none"
                                        >
                                            <option value="USD">USD ($)</option>
                                            <option value="BTC">Bitcoin (₿)</option>
                                        </select>
                                    </div>

                                    {/* Date */}
                                    <div className="space-y-2">
                                        <label htmlFor="dateInput" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            Date
                                        </label>
                                        <input
                                            id="dateInput"
                                            type="date"
                                            value={txDate}
                                            onChange={(e) => setTxDate(e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white hover:border-gray-400 font-normal text-gray-900 shadow-sm"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="md:col-span-2 space-y-2">
                                        <label htmlFor="descriptionTextarea" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <FileText className="w-4 h-4 text-gray-500" />
                                            Description
                                            <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                                        </label>
                                        <textarea
                                            id="descriptionTextarea"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white hover:border-gray-400 font-normal text-gray-900 shadow-sm resize-none"
                                            placeholder="Add a note about this transaction..."
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="px-6 py-4 flex justify-end gap-3 border-t border-gray-200 flex-shrink-0">
                                <button
                                    onClick={() => setShowCreateTxModal(false)}
                                    className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={async () => {
                                        if (!amount || parseFloat(amount) <= 0) {
                                            alert("Please enter a valid amount");
                                            return;
                                        }

                                        setCreating(true);

                                        // Create transaction with proper status
                                        await createTransaction(userId!, {
                                            type: txType,
                                            amount: parseFloat(amount),
                                            currency,
                                            status: status, // Use the status state
                                            date: txDate || new Date().toISOString().split('T')[0],
                                            description: description || `${txType.charAt(0).toUpperCase() + txType.slice(1)} via admin panel`,
                                            createdAt: new Date().toISOString(),
                                        });

                                        // Refresh user data and transactions
                                        const userRef = doc(db, "users", userId!);
                                        const updatedUserSnap = await getDoc(userRef);
                                        if (updatedUserSnap.exists()) {
                                            setUserData(updatedUserSnap.data());
                                        }

                                        const userTxs = await fetchTransactions(userId!);
                                        setTransactions(userTxs);

                                        // Reset form
                                        setShowCreateTxModal(false);
                                        setAmount("");
                                        setDescription("");
                                        setTxDate("");
                                        setStatus("completed"); // Reset to default
                                        setCreating(false);
                                    }}
                                    disabled={creating || !amount}
                                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                >
                                    {creating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4" />
                                            Create Transaction
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
        </div>
    );
}