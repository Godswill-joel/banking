"use client";

import React, { useState } from "react";
import {
  Bell,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Shield,
  X,
  Filter,
  Search,
  Archive,
  Trash2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface Notification {
  id: string;
  type: "success" | "warning" | "info" | "alert";
  category: "transaction" | "investment" | "security" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  amount?: number;
  currency?: string;
}

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "transaction" | "investment" | "security">("all");
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      category: "transaction",
      title: "Deposit Successful",
      message: "Your bank transfer of $5,000 has been credited to your account",
      timestamp: "2 minutes ago",
      read: false,
      amount: 5000,
      currency: "USD",
    },
    {
      id: "2",
      type: "info",
      category: "investment",
      title: "Bitcoin Price Alert",
      message: "Bitcoin has reached your target price of $43,750",
      timestamp: "1 hour ago",
      read: false,
      amount: 43750,
      currency: "BTC",
    },
    {
      id: "3",
      type: "warning",
      category: "security",
      title: "New Login Detected",
      message: "A new device logged into your account from New York, USA",
      timestamp: "3 hours ago",
      read: true,
    },
    {
      id: "4",
      type: "success",
      category: "investment",
      title: "Investment Profit",
      message: "Your Bitcoin investment generated $247.50 profit today",
      timestamp: "5 hours ago",
      read: true,
      amount: 247.5,
      currency: "USD",
    },
    {
      id: "5",
      type: "alert",
      category: "security",
      title: "Security Alert",
      message: "We detected unusual activity. Please verify your recent transactions",
      timestamp: "1 day ago",
      read: false,
    },
    {
      id: "6",
      type: "info",
      category: "system",
      title: "System Maintenance",
      message: "Scheduled maintenance on Jan 15, 2026 from 2:00 AM - 4:00 AM EST",
      timestamp: "1 day ago",
      read: true,
    },
    {
      id: "7",
      type: "success",
      category: "transaction",
      title: "Withdrawal Completed",
      message: "Your withdrawal of 0.05 BTC has been processed successfully",
      timestamp: "2 days ago",
      read: true,
      amount: 0.05,
      currency: "BTC",
    },
    {
      id: "8",
      type: "info",
      category: "investment",
      title: "Market Update",
      message: "Ethereum is up 5.2% in the last 24 hours. Consider reviewing your portfolio",
      timestamp: "2 days ago",
      read: true,
    },
  ]);

  const getIcon = (category: string, type: string) => {
    if (category === "transaction") return DollarSign;
    if (category === "investment") return TrendingUp;
    if (category === "security") return Shield;
    if (type === "success") return CheckCircle;
    if (type === "alert") return AlertCircle;
    return Bell;
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-500";
      case "warning":
        return "text-yellow-500";
      case "alert":
        return "text-red-500";
      default:
        return "text-[#B4925B]";
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500/20";
      case "warning":
        return "bg-yellow-500/20";
      case "alert":
        return "bg-red-500/20";
      default:
        return "bg-[#B4925B]/20";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "unread") return !notif.read && matchesSearch;
    return notif.category === activeFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="backdrop-blur-xl bg-gradient-to-r from-black/80 to-gray-900/80 border border-[#B4925B]/20 rounded-2xl shadow-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#B4925B] to-[#8B7355] flex items-center justify-center shadow-lg">
                <Bell className="text-black" size={28} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#B4925B] to-white bg-clip-text text-transparent">
                  Notifications
                </h1>
                <p className="text-gray-400 text-sm md:text-base">
                  {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-6 py-3 bg-gradient-to-r from-[#B4925B] to-[#8B7355] hover:from-[#8B7355] hover:to-[#B4925B] text-black font-semibold rounded-xl transition-all hover:scale-105 shadow-lg"
              >
                Mark All as Read
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#B4925B]/50 transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {[
                { key: "all", label: "All", icon: Filter },
                { key: "unread", label: "Unread", icon: Bell },
                { key: "transaction", label: "Transactions", icon: DollarSign },
                { key: "investment", label: "Investments", icon: TrendingUp },
                { key: "security", label: "Security", icon: Shield },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key as any)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    activeFilter === filter.key
                      ? "bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  <filter.icon size={18} />
                  <span className="hidden md:inline">{filter.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg p-12 text-center">
              <Bell className="mx-auto mb-4 text-gray-600" size={48} />
              <p className="text-gray-400 text-lg">No notifications found</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const Icon = getIcon(notification.category, notification.type);
              
              return (
                <div
                  key={notification.id}
                  className={`backdrop-blur-xl border rounded-2xl shadow-lg overflow-hidden transition-all hover:scale-[1.02] ${
                    notification.read
                      ? "bg-black/40 border-white/5"
                      : "bg-black/60 border-[#B4925B]/30"
                  }`}
                >
                  <div className="p-6">
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${getBgColor(notification.type)} flex items-center justify-center`}>
                        <Icon className={getIconColor(notification.type)} size={24} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="font-bold text-white text-lg">
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-all"
                                title="Mark as read"
                              >
                                <CheckCircle className="text-[#B4925B]" size={18} />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
                              title="Delete"
                            >
                              <Trash2 className="text-red-500" size={18} />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-gray-400 mb-3">{notification.message}</p>
                        
                        {notification.amount && (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#B4925B]/20 rounded-lg mb-3">
                            {notification.currency === "BTC" ? (
                              notification.amount > 1000 ? (
                                <ArrowUpRight className="text-green-500" size={16} />
                              ) : (
                                <ArrowDownRight className="text-red-500" size={16} />
                              )
                            ) : null}
                            <span className="text-[#B4925B] font-bold">
                              {notification.currency === "BTC" ? "₿" : "$"}
                              {notification.amount.toLocaleString()}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock size={14} />
                          <span>{notification.timestamp}</span>
                          {!notification.read && (
                            <span className="ml-2 w-2 h-2 bg-[#B4925B] rounded-full"></span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}