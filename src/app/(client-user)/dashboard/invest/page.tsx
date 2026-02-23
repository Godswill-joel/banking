"use client";

import React, { useState } from "react";
import {
    TrendingUp,
    Shield,
    CheckCircle,
    Award,
} from "lucide-react";


export default function InvestPage() {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);


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
            </div>
        </div>
    );
}