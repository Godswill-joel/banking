"use client";

import React, { useState } from "react";
import {
    Download,
    Copy,
    QrCode,
    AlertCircle,
    CheckCircle,
    Share2,
    Mail,
    MessageSquare
} from "lucide-react";


export default function Page() {
    const [selectedAsset, setSelectedAsset] = useState("BTC");
    const [copiedAddress, setCopiedAddress] = useState(false);
    const [shareMethod, setShareMethod] = useState<string | null>(null);

    const walletAddresses = {
        BTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
        ETH: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        USDC: "0x8a3B2C9D1F6E4A7B5C2D3E4F5A6B7C8D9E0F1A2B",
    };

    const currentAddress = walletAddresses[selectedAsset as keyof typeof walletAddresses];

    const copyAddress = () => {
        navigator.clipboard.writeText(currentAddress);
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
    };

    const shareAddress = (method: string) => {
        setShareMethod(method);
        setTimeout(() => setShareMethod(null), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#B4925B] to-white bg-clip-text text-transparent">
                        Receive Crypto
                    </h1>
                    <p className="text-gray-400 mt-1">Share your wallet address to receive crypto</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Receive Section */}
                    <div className="lg:col-span-2 backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg p-6 md:p-8">
                        {/* Select Asset */}
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-white mb-3">
                                Select Asset to Receive
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {Object.keys(walletAddresses).map((asset) => (
                                    <button
                                        key={asset}
                                        onClick={() => setSelectedAsset(asset)}
                                        className={`p-4 rounded-xl border-2 transition-all ${selectedAsset === asset
                                                ? "border-[#B4925B] bg-[#B4925B]/10"
                                                : "border-white/10 hover:border-[#B4925B]/50 bg-white/5"
                                            }`}
                                    >
                                        <p className="font-bold text-white text-lg">{asset}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* QR Code */}
                        <div className="bg-white rounded-2xl p-8 mb-6 flex items-center justify-center">
                            <div className="w-64 h-64 bg-gray-200 rounded-xl flex items-center justify-center">
                                <QrCode className="text-gray-400" size={200} />
                            </div>
                        </div>

                        {/* Wallet Address */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                            <label className="block text-sm font-semibold text-white mb-3">
                                Your {selectedAsset} Address
                            </label>
                            <div className="bg-black/40 rounded-lg p-4 mb-4">
                                <p className="text-white font-mono text-sm md:text-base break-all text-center">
                                    {currentAddress}
                                </p>
                            </div>
                            <button
                                onClick={copyAddress}
                                className="w-full py-3 bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                            >
                                {copiedAddress ? (
                                    <>
                                        <CheckCircle size={20} />
                                        Address Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy size={20} />
                                        Copy Address
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Share Options */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-3">
                                Share Address
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    onClick={() => shareAddress("email")}
                                    className="p-4 bg-white/5 hover:bg-[#B4925B]/10 border border-white/10 hover:border-[#B4925B]/30 rounded-xl transition-all flex flex-col items-center gap-2"
                                >
                                    <Mail className={shareMethod === "email" ? "text-[#B4925B]" : "text-gray-400"} size={24} />
                                    <span className="text-xs text-gray-400">Email</span>
                                </button>
                                <button
                                    onClick={() => shareAddress("sms")}
                                    className="p-4 bg-white/5 hover:bg-[#B4925B]/10 border border-white/10 hover:border-[#B4925B]/30 rounded-xl transition-all flex flex-col items-center gap-2"
                                >
                                    <MessageSquare className={shareMethod === "sms" ? "text-[#B4925B]" : "text-gray-400"} size={24} />
                                    <span className="text-xs text-gray-400">SMS</span>
                                </button>
                                <button
                                    onClick={() => shareAddress("share")}
                                    className="p-4 bg-white/5 hover:bg-[#B4925B]/10 border border-white/10 hover:border-[#B4925B]/30 rounded-xl transition-all flex flex-col items-center gap-2"
                                >
                                    <Share2 className={shareMethod === "share" ? "text-[#B4925B]" : "text-gray-400"} size={24} />
                                    <span className="text-xs text-gray-400">Share</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Info Sidebar */}
                    <div className="space-y-4">
                        <div className="backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Download className="text-[#B4925B]" size={24} />
                                <h3 className="font-bold text-white">How to Receive</h3>
                            </div>
                            <ol className="space-y-3 text-sm text-gray-400">
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#B4925B]/20 text-[#B4925B] flex items-center justify-center text-xs font-bold">1</span>
                                    <span>Select the cryptocurrency you want to receive</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#B4925B]/20 text-[#B4925B] flex items-center justify-center text-xs font-bold">2</span>
                                    <span>Share your wallet address or QR code</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#B4925B]/20 text-[#B4925B] flex items-center justify-center text-xs font-bold">3</span>
                                    <span>Wait for the transaction to be confirmed</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#B4925B]/20 text-[#B4925B] flex items-center justify-center text-xs font-bold">4</span>
                                    <span>Funds will appear in your wallet</span>
                                </li>
                            </ol>
                        </div>

                        <div className="backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="text-yellow-500" size={20} />
                                <h3 className="font-bold text-white">Important Notes</h3>
                            </div>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>• Only send {selectedAsset} to this address</li>
                                <li>• Sending other tokens may result in loss</li>
                                <li>• Minimum deposit: 0.0001 {selectedAsset}</li>
                                <li>• Network confirmations: 3-6 blocks</li>
                            </ul>
                        </div>

                        <div className="backdrop-blur-xl bg-black/60 border border-green-500/20 rounded-2xl shadow-lg p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <CheckCircle className="text-green-500" size={20} />
                                <h3 className="font-bold text-white">Secure Address</h3>
                            </div>
                            <p className="text-sm text-gray-400">
                                This address is verified and secure for receiving {selectedAsset}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
