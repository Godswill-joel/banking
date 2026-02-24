"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Shield,
  CheckCircle,
  Award,
  ChevronRight,
} from "lucide-react";

const investmentPlans = [
  {
    id: "starter",
    name: "Starter Plan",
    minInvestment: 100,
    maxInvestment: 2000,
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
    description: "Safe entry-level plan with guaranteed capital protection.",
  },
  {
    id: "growth",
    name: "Growth Plan",
    minInvestment: 2000,
    maxInvestment: 5000,
    roi: 12,
    duration: "60 days",
    riskLevel: "Medium",
    icon: TrendingUp,
    features: [
      "12% Monthly Returns",
      "Compound Interest",
      "Weekly Payouts",
      "Dedicated Manager",
    ],
    color: "from-blue-500 to-cyan-600",
    recommended: true,
    description: "Our most popular plan with flexible payout scheduling.",
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
    description: "Maximum returns for serious investors with VIP perks.",
  },
];

export default function InvestPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  function handleSelect(planId: string) {
    setSelectedPlan(planId);
  }

  function handleInvest(planId: string) {
    router.push(`/dashboard/invest/${planId}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#B4925B] to-white bg-clip-text text-transparent">
            Investment Plans
          </h1>
          <p className="text-gray-400 mt-1">
            Choose a plan and start earning passive income
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {investmentPlans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const riskColor =
              plan.riskLevel === "Low"
                ? "text-green-400"
                : plan.riskLevel === "Medium"
                ? "text-yellow-400"
                : "text-red-400";

            return (
              <div
                key={plan.id}
                onClick={() => handleSelect(plan.id)}
                className={`relative backdrop-blur-xl bg-black/60 border-2 rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-200 hover:scale-[1.02] flex flex-col ${
                  isSelected
                    ? "border-[#B4925B] bg-[#B4925B]/5"
                    : "border-white/10 hover:border-[#B4925B]/50"
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 right-6 bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black text-xs font-bold px-4 py-1 rounded-full z-10">
                    RECOMMENDED
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <plan.icon className="text-white" size={28} />
                </div>

                {/* Name + ROI */}
                <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-gray-500 text-xs mb-3">{plan.description}</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-[#B4925B]">{plan.roi}%</span>
                  <span className="text-gray-400 text-sm">monthly returns</span>
                </div>

                {/* Stats */}
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Min Investment</span>
                    <span className="text-white font-semibold">
                      ${plan.minInvestment.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Max Investment</span>
                    <span className="text-white font-semibold">
                      ${plan.maxInvestment.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white font-semibold">{plan.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Risk Level</span>
                    <span className={`font-semibold ${riskColor}`}>{plan.riskLevel}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="border-t border-white/10 pt-4 mb-5 flex-1">
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="text-[#B4925B] flex-shrink-0" size={15} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInvest(plan.id);
                  }}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black hover:opacity-90"
                      : "bg-white/5 border border-white/10 text-gray-300 hover:bg-[#B4925B]/10 hover:border-[#B4925B]/50 hover:text-[#B4925B]"
                  }`}
                >
                  Invest Now <ChevronRight size={16} />
                </button>

                {/* Selected border overlay */}
                {isSelected && (
                  <div className="absolute inset-0 border-2 border-[#B4925B] rounded-2xl pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-gray-600">
          All investments are subject to market risk. Past performance is not indicative of future results.
          By investing, you agree to our{" "}
          <span className="text-[#B4925B] cursor-pointer hover:underline">Terms & Conditions</span>.
        </p>
      </div>
    </div>
  );
}