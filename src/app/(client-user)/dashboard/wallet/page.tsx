"use client";

import React, { useState } from "react";
import {
  Wallet,
  Send,
  Download,
  Eye,
  EyeOff,
  Copy,
  QrCode,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Bitcoin,
  DollarSign,
  RefreshCw,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface Asset {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  value: number;
  change24h: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface Transaction {
  id: string;
  type: "send" | "receive" | "buy" | "sell";
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed";
  date: string;
  time: string;
  address: string;
}

export default function WalletPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "BTC" | "EUR">("USD");
  const [copiedAddress, setCopiedAddress] = useState(false);

  const walletAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
  
  const totalBalance = {
    USD: 12450.50,
    BTC: 0.2847,
    EUR: 11454.46,
  };

  const assets: Asset[] = [
    {
      id: "1",
      name: "Bitcoin",
      symbol: "BTC",
      amount: 0.2847,
      value: 12450.50,
      change24h: 2.5,
      icon: Bitcoin,
    },
    {
      id: "2",
      name: "Ethereum",
      symbol: "ETH",
      amount: 1.5420,
      value: 3607.86,
      change24h: -1.2,
      icon: TrendingUp,
    },
    {
      id: "3",
      name: "USD Coin",
      symbol: "USDC",
      amount: 5000.00,
      value: 5000.00,
      change24h: 0.0,
      icon: DollarSign,
    },
  ];

  const recentTransactions: Transaction[] = [
    {
      id: "1",
      type: "receive",
      amount: 0.05,
      currency: "BTC",
      status: "completed",
      date: "Today",
      time: "2:30 PM",
      address: "0x742...bEb",
    },
    {
      id: "2",
      type: "send",
      amount: 500,
      currency: "USD",
      status: "completed",
      date: "Yesterday",
      time: "4:15 PM",
      address: "0x8a3...c7D",
    },
    {
      id: "3",
      type: "buy",
      amount: 0.1,
      currency: "BTC",
      status: "pending",
      date: "2 days ago",
      time: "10:45 AM",
      address: "0x6f2...9aE",
    },
    {
      id: "4",
      type: "sell",
      amount: 1000,
      currency: "USD",
      status: "completed",
      date: "3 days ago",
      time: "1:20 PM",
      address: "0x9b1...4fC",
    },
  ];

  const formatBalance = () => {
    const balance = totalBalance[selectedCurrency];
    if (selectedCurrency === "USD") return `$${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (selectedCurrency === "BTC") return `₿${balance.toFixed(8)}`;
    return `€${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "receive":
        return <Download className="text-green-500" size={20} />;
      case "send":
        return <Send className="text-red-500" size={20} />;
      case "buy":
        return <ArrowDownRight className="text-blue-500" size={20} />;
      case "sell":
        return <ArrowUpRight className="text-orange-500" size={20} />;
      default:
        return <Wallet className="text-gray-500" size={20} />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="text-green-500" size={16} />;
      case "pending":
        return <Clock className="text-yellow-500" size={16} />;
      case "failed":
        return <XCircle className="text-red-500" size={16} />;
      default:
        return <AlertCircle className="text-gray-500" size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#B4925B] to-white bg-clip-text text-transparent">
              My Wallet
            </h1>
            <p className="text-gray-400 mt-1">Manage your crypto assets</p>
          </div>
          <button className="p-3 bg-[#B4925B]/10 hover:bg-[#B4925B]/20 border border-[#B4925B]/30 rounded-xl transition-all">
            <RefreshCw className="text-[#B4925B]" size={20} />
          </button>
        </div>

        {/* Main Balance Card */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-[#B4925B] via-[#A08550] to-[#8B7355] rounded-2xl shadow-2xl overflow-hidden border border-[#B4925B]/30 p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-black/20 flex items-center justify-center">
                <Wallet className="text-black" size={32} />
              </div>
              <div>
                <p className="text-black/70 text-sm font-medium">Total Balance</p>
                <div className="flex items-center gap-3 mt-1">
                  {showBalance ? (
                    <h1 className="text-5xl font-bold text-black">
                      {formatBalance()}
                    </h1>
                  ) : (
                    <h1 className="text-5xl font-bold text-black">••••••</h1>
                  )}
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-2 hover:bg-black/10 rounded-lg transition-all"
                  >
                    {showBalance ? (
                      <Eye className="text-black" size={24} />
                    ) : (
                      <EyeOff className="text-black" size={24} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Currency Selector */}
          <div className="flex gap-3 mb-6">
            {(["USD", "BTC", "EUR"] as const).map((currency) => (
              <button
                key={currency}
                onClick={() => setSelectedCurrency(currency)}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                  selectedCurrency === currency
                    ? "bg-black text-[#B4925B]"
                    : "bg-black/20 text-black hover:bg-black/30"
                }`}
              >
                {currency}
              </button>
            ))}
          </div>

          {/* Wallet Address */}
          <div className="bg-black/20 rounded-xl p-4">
            <p className="text-black/70 text-sm mb-2">Wallet Address</p>
            <div className="flex items-center justify-between gap-3">
              <p className="text-black font-mono text-sm md:text-base truncate">
                {walletAddress}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={copyAddress}
                  className="p-2 bg-black/20 hover:bg-black/30 rounded-lg transition-all"
                >
                  {copiedAddress ? (
                    <CheckCircle className="text-black" size={20} />
                  ) : (
                    <Copy className="text-black" size={20} />
                  )}
                </button>
                <button className="p-2 bg-black/20 hover:bg-black/30 rounded-lg transition-all">
                  <QrCode className="text-black" size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button className="bg-black/20 hover:bg-black/30 backdrop-blur-sm p-4 rounded-xl transition-all flex items-center justify-center gap-2 font-semibold text-black">
              <Send size={20} />
              Send
            </button>
            <button className="bg-black/20 hover:bg-black/30 backdrop-blur-sm p-4 rounded-xl transition-all flex items-center justify-center gap-2 font-semibold text-black">
              <Download size={20} />
              Receive
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Assets List */}
          <div className="lg:col-span-2 backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-[#B4925B]/20">
              <h2 className="text-xl font-bold text-white">Your Assets</h2>
              <p className="text-sm text-gray-400 mt-1">Crypto holdings overview</p>
            </div>
            <div className="p-6 space-y-3">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 hover:border-[#B4925B]/30 cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#B4925B] to-[#8B7355] flex items-center justify-center shadow-lg">
                      <asset.icon className="text-black" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{asset.name}</h3>
                      <p className="text-sm text-gray-400">
                        {asset.amount.toFixed(4)} {asset.symbol}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white text-lg">
                      ${asset.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                    <div
                      className={`flex items-center gap-1 justify-end ${
                        asset.change24h >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {asset.change24h >= 0 ? (
                        <TrendingUp size={14} />
                      ) : (
                        <TrendingDown size={14} />
                      )}
                      <span className="text-sm font-semibold">
                        {Math.abs(asset.change24h).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400 group-hover:text-[#B4925B] transition-colors" size={20} />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Profit</p>
                  <p className="text-2xl font-bold text-white">$1,247.50</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-500">
                <TrendingUp size={16} />
                <span className="text-sm font-semibold">+12.5% this month</span>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600">
                  <Wallet className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Assets</p>
                  <p className="text-2xl font-bold text-white">{assets.length}</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">Across all wallets</p>
            </div>

            <div className="backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                  <Clock className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Last Transaction</p>
                  <p className="text-lg font-bold text-white">2 hours ago</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">Received 0.05 BTC</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-[#B4925B]/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
                <p className="text-sm text-gray-400 mt-1">Your latest activities</p>
              </div>
              <button className="text-[#B4925B] hover:text-[#8B7355] text-sm font-semibold transition-colors">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        transaction.type === "receive"
                          ? "bg-green-500/20"
                          : transaction.type === "send"
                          ? "bg-red-500/20"
                          : transaction.type === "buy"
                          ? "bg-blue-500/20"
                          : "bg-orange-500/20"
                      }`}
                    >
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white capitalize">
                          {transaction.type}
                        </h3>
                        {getStatusIcon(transaction.status)}
                      </div>
                      <p className="text-sm text-gray-400">
                        {transaction.date} • {transaction.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.type === "receive" || transaction.type === "buy"
                        ? "text-green-500"
                        : "text-white"
                    }`}>
                      {transaction.type === "receive" || transaction.type === "buy" ? "+" : "-"}
                      {transaction.currency === "BTC" ? "₿" : "$"}
                      {transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-400 font-mono">{transaction.address}</p>
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