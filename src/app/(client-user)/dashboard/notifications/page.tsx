/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Search,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  X,
} from "lucide-react";
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { useUserData } from "@/lib/hook/useUserData";

interface Transaction {
  id: string;
  type: "deposit" | "withdraw" | "transfer" | "received";
  amount: number;
  currency: "USD" | "BTC";
  status: "completed" | "pending" | "failed" | "reverted";
  date: string;
  description?: string;
  timestamp: string;
  rawTimestamp: number;
  userId: string;
  createdAt?: any;
}

function formatTimestamp(createdAt: any): string {
  if (!createdAt) return "Unknown time";
  const date: Date =
    createdAt instanceof Timestamp
      ? createdAt.toDate()
      : createdAt?.seconds
        ? new Date(createdAt.seconds * 1000)
        : new Date(createdAt);

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getRawTimestamp(createdAt: any): number {
  if (!createdAt) return 0;
  if (createdAt instanceof Timestamp) return createdAt.toMillis();
  if (createdAt?.seconds) return createdAt.seconds * 1000;
  return new Date(createdAt).getTime();
}

function getTypeConfig(type: string) {
  switch (type) {
    case "deposit":
      return { icon: ArrowUpRight, bg: "bg-green-500/15", iconColor: "text-green-400", amountColor: "text-green-400", prefix: "+" };
    case "withdraw":
      return { icon: ArrowDownRight, bg: "bg-red-500/15", iconColor: "text-red-400", amountColor: "text-red-400", prefix: "-" };
    case "transfer":
      return { icon: TrendingUp, bg: "bg-blue-500/15", iconColor: "text-blue-400", amountColor: "text-red-400", prefix: "-" };
    case "received":
      return { icon: ArrowUpRight, bg: "bg-[#B4925B]/15", iconColor: "text-[#B4925B]", amountColor: "text-green-400", prefix: "+" };
    default:
      return { icon: DollarSign, bg: "bg-white/10", iconColor: "text-gray-400", amountColor: "text-white", prefix: "" };
  }
}

function getStatusStyle(status: string) {
  switch (status) {
    case "completed": return "bg-green-500/15 text-green-400 border border-green-500/20";
    case "pending": return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20";
    case "failed": return "bg-red-500/15 text-red-400 border border-red-500/20";
    case "reverted": return "bg-orange-500/15 text-orange-400 border border-orange-500/20";
    default: return "bg-gray-500/15 text-gray-400 border border-gray-500/20";
  }
}

const FILTERS = [
  { key: "all", label: "All" },
  { key: "deposit", label: "Deposits" },
  { key: "withdraw", label: "Withdrawals" },
  { key: "transfer", label: "Transfers" },
  { key: "received", label: "Received" },
  { key: "pending", label: "Pending" },
];

export default function TransactionsPage() {
  const { user, loading: authLoading } = useUserData();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "deposit" | "withdraw" | "transfer" | "received" | "pending"
  >("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: Transaction[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          type: data.type ?? "deposit",
          amount: data.amount ?? 0,
          currency: data.currency ?? "USD",
          status: data.status ?? "completed",
          date: data.date ?? "",
          description: data.description ?? "",
          timestamp: formatTimestamp(data.createdAt),
          rawTimestamp: getRawTimestamp(data.createdAt),
          userId: data.userId ?? "",
          createdAt: data.createdAt,
        };
      });

      fetched.sort((a, b) => b.rawTimestamp - a.rawTimestamp);
      setTransactions(fetched);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const filteredTransactions = transactions.filter((tx) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      tx.description?.toLowerCase().includes(q) ||
      tx.type.toLowerCase().includes(q) ||
      tx.amount.toString().includes(q) ||
      tx.date.includes(q);

    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "pending") return tx.status === "pending" && matchesSearch;
    return tx.type === activeFilter && matchesSearch;
  });

  const isLoading = authLoading || loading;

  const totalIn = transactions
    .filter((t) => (t.type === "deposit" || t.type === "received") && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOut = transactions
    .filter((t) => (t.type === "withdraw" || t.type === "transfer") && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingCount = transactions.filter((t) => t.status === "pending").length;

  return (
    <div className="min-h-screen p-2  overflow-hidden w-full bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="w-full space-y-3  lg:max-w-3xl">

        {/* ── Header ── */}
        <div className="bg-black/70 border border-[#B4925B]/20 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center w-fit flex-wrap justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#B4925B] to-[#8B7355] flex items-center justify-center shadow-lg shrink-0">
                <DollarSign className="text-black" size={20} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#B4925B] to-white bg-clip-text text-transparent leading-tight">
                  Transactions
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm">
                  {isLoading ? "Loading..." : `${transactions.length} total`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { label: "Total In", value: `$${totalIn.toLocaleString()}`, color: "border-green-500/20 text-green-400" },
            { label: "Total Out", value: `$${totalOut.toLocaleString()}`, color: "border-red-500/20 text-red-400" },
            { label: "Pending", value: pendingCount.toString(), color: "border-yellow-500/20 text-yellow-400" },
          ].map((stat) => (
            <div key={stat.label} className={`bg-black/60 border ${stat.color} rounded-xl p-2.5 sm:p-4 text-center`}>
              <p className={`text-xs font-medium mb-0.5 ${stat.color.split(" ")[1]}`}>{stat.label}</p>
              {isLoading ? (
                <div className="h-5 bg-white/10 rounded animate-pulse mx-auto w-3/4" />
              ) : (
                <p className="text-white font-bold text-sm sm:text-base truncate">{stat.value}</p>
              )}
            </div>
          ))}
        </div>

        {/* ── Search ── */}
        <div className="bg-black/60 border border-[#B4925B]/20 rounded-2xl p-3 sm:p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 shrink-0" size={16} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#B4925B]/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter chips — scrollable on mobile */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide  px-1">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key as any)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeFilter === f.key
                  ? "bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black shadow-md"
                  : "bg-white/5 text-gray-400 active:bg-white/15"
                  }`}
              >
                {f.label}
                {f.key === "pending" && pendingCount > 0 && (
                  <span className="ml-1.5 bg-yellow-500/30 text-yellow-400 text-[10px] px-1 py-0.5 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── List ── */}
        <div className="space-y-2">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-black/40 border border-white/5 rounded-2xl p-4 animate-pulse">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-xl bg-white/10 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-white/10 rounded w-1/4" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                  <div className="space-y-1.5 text-right">
                    <div className="h-4 bg-white/10 rounded w-16" />
                    <div className="h-3 bg-white/5 rounded w-12 ml-auto" />
                  </div>
                </div>
              </div>
            ))
          ) : filteredTransactions.length === 0 ? (
            <div className="bg-black/60 border border-[#B4925B]/20 rounded-2xl p-10 text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                <DollarSign className="text-gray-700" size={24} />
              </div>
              <p className="text-gray-400 font-medium text-sm">No transactions found</p>
              <p className="text-gray-600 text-xs mt-1">
                {activeFilter !== "all" ? "Try a different filter" : "Your transactions will appear here"}
              </p>
              {activeFilter !== "all" && (
                <button
                  onClick={() => { setActiveFilter("all"); setSearchQuery(""); }}
                  className="mt-3 text-xs text-[#B4925B] underline underline-offset-2"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const config = getTypeConfig(tx.type);
              const Icon = config.icon;
              return (
                <div
                  key={tx.id}
                  className="bg-black/60 border border-white/5 rounded-2xl overflow-hidden transition-all active:scale-[0.985] active:bg-black/80 hover:border-[#B4925B]/15"
                >
                  <div className="p-3.5 sm:p-4">
                    <div className="flex items-center justify-between ">

                      <div>
                        {/* Icon */}
                        <div className={`shrink-0 w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center`}>
                          <Icon className={config.iconColor} size={18} />
                        </div>

                        {/* Middle: type + description */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-white font-semibold text-sm capitalize leading-tight">
                              {tx.type}
                            </p>
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md capitalize ${getStatusStyle(tx.status)}`}>
                              {tx.status}
                            </span>
                          </div>
                          {tx.description ? (
                            <p className="text-gray-500 text-xs truncate mt-0.5 w-full">
                              {tx.description}
                            </p>
                          ) : (
                            <p className="text-gray-600 text-xs mt-0.5">{tx.date}</p>
                          )}
                          <div className="flex items-center gap-1 mt-1">
                            <Clock size={10} className="text-gray-700" />
                            <span className="text-gray-700 text-[10px]">{tx.timestamp}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: amount */}
                      <div className="text-right shrink-0">
                        <p className={`font-bold text-sm sm:text-base tabular-nums ${config.amountColor}`}>
                          {config.prefix}{tx.currency === "BTC" ? "₿" : "$"}{tx.amount.toLocaleString()}
                        </p>
                        <p className="text-gray-600 text-[10px] mt-0.5">{tx.currency}</p>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── Footer count ── */}
        {!isLoading && filteredTransactions.length > 0 && (
          <p className="text-center text-gray-700 text-xs pb-2">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </p>
        )}

      </div>
    </div>
  );
}