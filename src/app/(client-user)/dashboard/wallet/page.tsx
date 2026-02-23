"use client";

import React, { useState } from "react";
import { useUserData } from "@/lib/hook/useUserData";
import { useFormatPrice } from "@/lib/hook/useFormatPrice";
import {
  Wallet,
  Send,
  Download,
  Eye,
  EyeOff,
  Copy,
  QrCode,
  CheckCircle,
} from "lucide-react";

export default function WalletPage() {
  const { userData, loading, error } = useUserData();
  const [showBalance, setShowBalance] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const user = userData;
  const { formatUSD } = useFormatPrice();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">
          Loading wallet...
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

  const copyAddress = () => {
    if (!user.walletAddress) return;

    navigator.clipboard.writeText(user.walletAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#B4925B] to-white bg-clip-text text-transparent">
              My Wallet
            </h1>
            <p className="text-gray-400 mt-1">
              Manage your USD balance
            </p>
          </div>

        </div>
        <div className="bg-gradient-to-br from-[#B4925B] via-[#A08550] to-[#8B7355] rounded-2xl shadow-2xl border border-[#B4925B]/30 p-8">
          <div className="flex items-start justify-between mb-6">

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-black/20 flex items-center justify-center">
                <Wallet className="text-black" size={32} />
              </div>

              <div>
                <p className="text-black/70 text-sm font-medium">
                  Total Balance (USD)
                </p>

                <div className="flex items-center gap-3 mt-1">
                  {showBalance ? (
                    <h1 className="text-5xl font-bold text-black">
                      {formatUSD(user.balance)}
                    </h1>
                  ) : (
                    <h1 className="text-5xl font-bold text-black">
                      ••••••
                    </h1>
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
          <div className="bg-black/20 rounded-xl p-4">
            <p className="text-black/70 text-sm mb-2">
              Wallet Address
            </p>

            <div className="flex items-center justify-between gap-3">
              <p className="text-black font-mono text-sm md:text-base truncate">
                {user.walletAddress || "No wallet address found"}
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
            <button className="bg-black/20 hover:bg-black/30 p-4 rounded-xl transition-all flex items-center justify-center gap-2 font-semibold text-black">
              <Send size={20} />
              Send
            </button>

            <button className="bg-black/20 hover:bg-black/30 p-4 rounded-xl transition-all flex items-center justify-center gap-2 font-semibold text-black">
              <Download size={20} />
              Receive
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}