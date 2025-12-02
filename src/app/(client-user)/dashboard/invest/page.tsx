"use client";

import React, { useState } from "react";
import {
    TrendingUp,
    Bitcoin,
    Shield,
    CheckCircle,
    ArrowRight,
    Calculator,
    Award,
} from "lucide-react";


export default function InvestPage() {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [investAmount, setInvestAmount] = useState("");
    const [showInvestModal, setShowInvestModal] = useState(false);

    const investmentPlans = [
        {
            id: "starter",
            name: "Starter Plan",
            minInvestment: 100,
            maxInvestment: 1000,
            roi: 5,
            duration: "30 days",
            riskLevel: "Low",
            icon: Shield,
            features: [
                "5% Monthly Returns",
                "Low Risk Investment",
                "Capital Protected",
                "Withdraw Anytime",
            ],
            color: "from-green-500 to-emerald-600",
        },
        {
            id: "growth",
            name: "Growth Plan",
            minInvestment: 1000,
            maxInvestment: 5000,
            roi: 12,
            duration: "60 days",
            riskLevel: "Medium",
            icon: TrendingUp,
            features: [
                "12% Monthly Returns",
                "Medium Risk Investment",
                "Compound Interest",
                "Weekly Payouts",
            ],
            color: "from-blue-500 to-cyan-600",
            recommended: true,
        },
        {
            id: "premium",
            name: "Premium Plan",
            minInvestment: 5000,
            maxInvestment: 50000,
            roi: 20,
            duration: "90 days",
            riskLevel: "High",
            icon: Award,
            features: [
                "20% Monthly Returns",
                "High Yield Investment",
                "Priority Support",
                "Exclusive Benefits",
            ],
            color: "from-purple-500 to-pink-600",
        },
    ];

    const cryptoAssets = [
        {
            id: "btc",
            name: "Bitcoin",
            symbol: "BTC",
            currentPrice: 43750.25,
            expectedReturn: 15,
            duration: "6 months",
            minInvest: 0.001,
            icon: Bitcoin,
        },
        {
            id: "eth",
            name: "Ethereum",
            symbol: "ETH",
            currentPrice: 2340.80,
            expectedReturn: 18,
            duration: "6 months",
            minInvest: 0.01,
            icon: TrendingUp,
        },
    ];

    const selectedPlanData = investmentPlans.find(p => p.id === selectedPlan);
    const estimatedReturn = investAmount ? (parseFloat(investAmount) * (selectedPlanData?.roi || 0)) / 100 : 0;

    const handleInvest = () => {
        if (!selectedPlan || !investAmount) return;
        setShowInvestModal(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#B4925B] to-white bg-clip-text text-transparent">
                        Investment Plans
                    </h1>
                    <p className="text-gray-400 mt-1">Choose a plan and start earning passive income</p>
                </div>

                {/* Investment Plans */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {investmentPlans.map((plan) => (
                        <div
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan.id)}
                            className={`relative backdrop-blur-xl bg-black/60 border-2 rounded-2xl shadow-lg p-6 cursor-pointer transition-all hover:scale-105 ${selectedPlan === plan.id
                                    ? "border-[#B4925B] bg-[#B4925B]/5"
                                    : "border-white/10 hover:border-[#B4925B]/50"
                                }`}
                        >
                            {plan.recommended && (
                                <div className="absolute -top-3 right-6 bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black text-xs font-bold px-4 py-1 rounded-full">
                                    RECOMMENDED
                                </div>
                            )}

                            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-lg`}>
                                <plan.icon className="text-white" size={32} />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-4xl font-bold text-[#B4925B]">{plan.roi}%</span>
                                <span className="text-gray-400">monthly returns</span>
                            </div>

                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Min Investment</span>
                                    <span className="text-white font-semibold">${plan.minInvestment.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Duration</span>
                                    <span className="text-white font-semibold">{plan.duration}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Risk Level</span>
                                    <span className={`font-semibold ${plan.riskLevel === "Low" ? "text-green-500" :
                                            plan.riskLevel === "Medium" ? "text-yellow-500" : "text-red-500"
                                        }`}>{plan.riskLevel}</span>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-4 mb-4">
                                <p className="text-sm text-gray-400 mb-3">Features:</p>
                                <ul className="space-y-2">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                                            <CheckCircle className="text-[#B4925B]" size={16} />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {selectedPlan === plan.id && (
                                <div className="absolute inset-0 border-2 border-[#B4925B] rounded-2xl pointer-events-none"></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Crypto Assets */}
                <div className="backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-white mb-4">Invest in Crypto Assets</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cryptoAssets.map((crypto) => (
                            <div
                                key={crypto.id}
                                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#B4925B]/50 transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#B4925B] to-[#8B7355] flex items-center justify-center">
                                            <crypto.icon className="text-black" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">{crypto.name}</h3>
                                            <p className="text-sm text-gray-400">{crypto.symbol}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-white">${crypto.currentPrice.toLocaleString()}</p>
                                        <p className="text-sm text-green-500">+{crypto.expectedReturn}%</p>
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm mb-4">
                                    <span className="text-gray-400">Min. Investment</span>
                                    <span className="text-white">{crypto.minInvest} {crypto.symbol}</span>
                                </div>
                                <button className="w-full py-3 bg-[#B4925B]/20 hover:bg-[#B4925B]/30 border border-[#B4925B]/30 text-[#B4925B] rounded-lg font-semibold transition-all">
                                    Invest Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Investment Form */}
                {selectedPlan && (
                    <div className="backdrop-blur-xl bg-black/60 border border-[#B4925B]/20 rounded-2xl shadow-lg p-6 md:p-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Investment Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-white mb-2">
                                    Investment Amount (USD)
                                </label>
                                <input
                                    type="number"
                                    value={investAmount}
                                    onChange={(e) => setInvestAmount(e.target.value)}
                                    placeholder={`Min: $${selectedPlanData?.minInvestment}`}
                                    className="w-full px-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white text-xl font-bold placeholder-gray-500 focus:outline-none focus:border-[#B4925B] transition-all"
                                />
                            </div>

                            <div className="bg-[#B4925B]/10 border border-[#B4925B]/30 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Calculator className="text-[#B4925B]" size={20} />
                                    <h3 className="font-bold text-white">Estimated Returns</h3>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-400">Monthly Return</span>
                                        <span className="text-lg font-bold text-[#B4925B]">
                                            ${estimatedReturn.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-400">Total After {selectedPlanData?.duration}</span>
                                        <span className="text-lg font-bold text-white">
                                            ${(parseFloat(investAmount || "0") + estimatedReturn).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleInvest}
                            disabled={!investAmount || parseFloat(investAmount) < (selectedPlanData?.minInvestment || 0)}
                            className="w-full mt-6 py-4 bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-[#B4925B]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            Start Investing
                            <ArrowRight size={20} />
                        </button>
                    </div>
                )}

                {/* Success Modal */}
                {showInvestModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-gradient-to-br from-gray-900 to-black border border-[#B4925B]/30 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slideUp">
                            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20">
                                <CheckCircle className="text-green-500" size={48} />
                            </div>
                            <h2 className="text-2xl font-bold text-white text-center mb-2">
                                Investment Successful!
                            </h2>
                            <p className="text-gray-400 text-center mb-6">
                                Your investment is now active and earning returns
                            </p>
                            <button
                                onClick={() => setShowInvestModal(false)}
                                className="w-full px-6 py-3 bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black rounded-xl font-semibold hover:shadow-xl transition-all"
                            >
                                View Portfolio
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