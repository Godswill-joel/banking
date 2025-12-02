"use client";

import React, { useState } from "react";
import {
  Send,
  QrCode,
  AlertCircle,
  CheckCircle,
  Wallet,
} from "lucide-react";

export default function SendCryptoPage() {
  const [selectedAsset, setSelectedAsset] = useState("BTC");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const assets = [
    { symbol: "BTC", name: "Bitcoin", balance: 0.2847, usdValue: 12450.50 },
    { symbol: "ETH", name: "Ethereum", balance: 1.5420, usdValue: 3607.86 },
    { symbol: "USDC", name: "USD Coin", balance: 5000.00, usdValue: 5000.00 },
  ];

  const selectedAssetData = assets.find(a => a.symbol === selectedAsset);
  const usdValue = amount ? parseFloat(amount) * (selectedAssetData!.usdValue / selectedAssetData!.balance) : 0;

  const handleSend = () => {
    setShowConfirmation(true);
  };

  const confirmSend = () => {
    setShowConfirmation(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setRecipient("");
      setAmount("");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#B4925B] to-white bg-clip-text text-transparent">
            Send Crypto
          </h1>
          <p className="text-gray-400 mt-1">Transfer your crypto assets securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Send Form */}
          <div className="lg:col-span-2 backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg p-6 md:p-8">
            <div className="space-y-6">
              {/* Select Asset */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Select Asset
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {assets.map((asset) => (
                    <button
                      key={asset.symbol}
                      onClick={() => setSelectedAsset(asset.symbol)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedAsset === asset.symbol
                          ? "border-[#B4925B] bg-[#B4925B]/10"
                          : "border-white/10 hover:border-[#B4925B]/50 bg-white/5"
                      }`}
                    >
                      <p className="font-bold text-white">{asset.symbol}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {asset.balance.toFixed(4)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Address */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Recipient Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Enter wallet address or scan QR code"
                    className="w-full px-4 py-4 pr-12 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#B4925B] transition-all"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-all">
                    <QrCode className="text-[#B4925B]" size={20} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Make sure the address is correct. Crypto transactions cannot be reversed.
                </p>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white text-2xl font-bold placeholder-gray-500 focus:outline-none focus:border-[#B4925B] transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B4925B] font-bold">
                    {selectedAsset}
                  </div>
                </div>
                {amount && (
                  <p className="text-sm text-gray-400 mt-2">
                    ≈ ${usdValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                  </p>
                )}
                <div className="flex gap-2 mt-3">
                  {["25%", "50%", "75%", "Max"].map((percent) => (
                    <button
                      key={percent}
                      onClick={() => {
                        const percentage = percent === "Max" ? 100 : parseInt(percent);
                        setAmount(((selectedAssetData!.balance * percentage) / 100).toFixed(8));
                      }}
                      className="flex-1 py-2 bg-white/5 hover:bg-[#B4925B]/10 border border-white/10 hover:border-[#B4925B]/30 rounded-lg text-sm font-semibold text-gray-300 hover:text-[#B4925B] transition-all"
                    >
                      {percent}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transaction Fee */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Network Fee</span>
                  <span className="text-sm font-semibold text-white">0.0001 {selectedAsset}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total Amount</span>
                  <span className="text-lg font-bold text-[#B4925B]">
                    {amount ? (parseFloat(amount) + 0.0001).toFixed(8) : "0.00"} {selectedAsset}
                  </span>
                </div>
              </div>

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={!recipient || !amount}
                className="w-full py-4 bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-[#B4925B]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Send {selectedAsset}
              </button>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-4">
            <div className="backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#B4925B] to-[#8B7355] flex items-center justify-center">
                  <Wallet className="text-black" size={24} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Available Balance</p>
                  <p className="text-xl font-bold text-white">
                    {selectedAssetData?.balance.toFixed(4)} {selectedAsset}
                  </p>
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-sm text-gray-400">≈ ${selectedAssetData?.usdValue.toLocaleString()} USD</p>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="text-yellow-500" size={20} />
                <h3 className="font-bold text-white">Important</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Double-check recipient address</li>
                <li>• Transactions are irreversible</li>
                <li>• Network fees may vary</li>
                <li>• Allow 10-30 minutes for confirmation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-[#B4925B]/30 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slideUp">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-[#B4925B]/20">
                <Send className="text-[#B4925B]" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                Confirm Transaction
              </h2>
              <p className="text-gray-400 text-center mb-6">
                Please review the details before sending
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-sm text-gray-400">You&apos;re sending</p>
                  <p className="text-2xl font-bold text-white">{amount} {selectedAsset}</p>
                  <p className="text-sm text-gray-400">≈ ${usdValue.toFixed(2)} USD</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">To address</p>
                  <p className="text-sm text-white font-mono break-all">{recipient}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">Network Fee</span>
                    <span className="text-sm text-white">0.0001 {selectedAsset}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/10">
                    <span className="text-sm font-semibold text-white">Total</span>
                    <span className="text-sm font-bold text-[#B4925B]">
                      {(parseFloat(amount) + 0.0001).toFixed(8)} {selectedAsset}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-6 py-3 border-2 border-white/20 text-gray-300 rounded-xl font-semibold hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSend}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black rounded-xl font-semibold hover:shadow-xl transition-all"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-green-500/30 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slideUp">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20">
                <CheckCircle className="text-green-500" size={48} />
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                Transaction Sent!
              </h2>
              <p className="text-gray-400 text-center mb-6">
                Your crypto has been sent successfully
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black rounded-xl font-semibold hover:shadow-xl transition-all"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  );
}