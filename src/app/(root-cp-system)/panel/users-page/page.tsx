/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
    Users,
    Search,
    Edit,
    Trash2,
    Eye,
    Plus,
    MoreVertical,
    TrendingUp,
    UserCheck,
    Shield,
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import Link from 'next/link';

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [statusFilter, setStatusFilter] = useState("all");
    const [users, setUsers] = useState<any[]>([]);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, "users");
                const usersSnapshot = await getDocs(usersCollection);
                const usersList = usersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUsers(usersList);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === "active").length;
    const kycVerified = users.filter(u => u.kycVerified).length;
    const admins = users.filter(u => u.role === "admin").length;


    const stats = [
        { title: "Total Users", value: totalUsers, change: "+0%", icon: Users, color: "from-blue-500 to-cyan-500" },
        { title: "Active Users", value: activeUsers, change: `${((activeUsers / totalUsers) * 100).toFixed(1)}%`, icon: TrendingUp, color: "from-green-500 to-emerald-500" },
        { title: "KYC Verified", value: kycVerified, change: `${((kycVerified / totalUsers) * 100).toFixed(1)}%`, icon: UserCheck, color: "from-purple-500 to-pink-500" },
        { title: "Admins", value: admins, change: admins > 0 ? `+${admins}` : "0", icon: Shield, color: "from-orange-500 to-red-500" },
    ];



    const getRoleColor = (role: string) => {
        const colors = {
            admin: "bg-purple-500/10 text-purple-600 border-purple-500/20",
            moderator: "bg-blue-500/10 text-blue-600 border-blue-500/20",
            user: "bg-gray-500/10 text-gray-600 border-gray-500/20",
        };
        return colors[role as keyof typeof colors];
    };

    const filteredUsers = users.filter((user) => {
        const name = user.name?.toLowerCase() || "";
        const email = user.email?.toLowerCase() || "";

        return (
            (name.includes(searchTerm.toLowerCase()) ||
                email.includes(searchTerm.toLowerCase())) &&
            (statusFilter === "all" || user.status === statusFilter)
        );
    });


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            User Management
                        </h1>
                        <p className="text-gray-600 text-sm md:text-base">
                            Manage user accounts, roles, and permissions
                        </p>
                    </div>
                    <Link href='/panel/users-page/add-new-user'>
                        <button
                            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105">
                            <Plus size={20} />
                            <span className="font-semibold">Add User</span>
                        </button>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="group relative backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div
                                    className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}
                                >
                                    <stat.icon className="text-white" size={24} />
                                </div>
                                <span className="text-green-600 text-sm font-semibold bg-green-50 px-2 py-1 rounded-lg">
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-gray-600 text-sm font-medium mb-1">
                                {stat.title}
                            </h3>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Search and Filters */}
                <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-4 md:p-6 shadow-lg">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="flex-1 relative group">
                            <Search
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 border-2 text-black rounded-xl "
                            />
                        </div>

                    </div>
                </div>

                {/* Users Table - Desktop */}
                <div className="hidden lg:block backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">
                                        Role
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">
                                        Balance
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">
                                        KYC
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold text-black uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map((user, index) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-blue-50/50 transition-colors group"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                                    {user.avatar}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {user.lastName}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${getRoleColor(
                                                    user.role
                                                )}`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-gray-900">
                                                {user.balance}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${user.kycVerified
                                                    ? "bg-green-500/10 text-green-600 border-green-500/20"
                                                    : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                                                    }`}
                                            >
                                                {user.kycVerified ? "✓ Verified" : "⏳ Pending"}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/panel/users-page/${user.id}`}
                                                >
                                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                        <Eye size={16} />
                                                    </button>
                                                </Link>
                                                <Link
                                                    href={`/panel/users-page/${user.id}/edit-user`}
                                                >
                                                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all">
                                                        <Edit size={16} />
                                                    </button>
                                                </Link>
                                                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredUsers.map((user, index) => (
                        <div
                            key={user.id}
                            className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            {/* Card Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        {user.avatar}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{user.name}</h3>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <MoreVertical size={18} className="text-gray-400" />
                                </button>
                            </div>

                            {/* Card Body */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Balance</span>
                                    <span className="font-bold text-gray-900">{user.balance}</span>
                                </div>



                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Role</span>
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${getRoleColor(
                                            user.role
                                        )}`}
                                    >
                                        {user.role}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">KYC</span>
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${user.kycVerified
                                            ? "bg-green-500/10 text-green-600 border-green-500/20"
                                            : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                                            }`}
                                    >
                                        {user.kycVerified ? "✓ Verified" : "⏳ Pending"}
                                    </span>
                                </div>


                            </div>

                            {/* Card Actions */}
                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                <button className="flex-1 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1">
                                    <Eye size={16} />
                                    View
                                </button>
                                <button className="flex-1 py-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1">
                                    <Edit size={16} />
                                    Edit
                                </button>
                                <button className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl p-4 md:p-6 shadow-lg">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-black text-center sm:text-left">
                            Showing <span className="font-semibold">1</span> to{" "}
                            <span className="font-semibold">{filteredUsers.length}</span> of{" "}
                            <span className="font-semibold">{users.length}</span> results
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-medium text-black hover:bg-white transition-all">
                                Previous
                            </button>
                            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-semibold shadow-lg">
                                1
                            </button>
                            <button className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-medium text-black hover:bg-white transition-all">
                                2
                            </button>
                            <button className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-medium text-black hover:bg-white transition-all">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}