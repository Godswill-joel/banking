"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
    Shield,
    TrendingUp,
    Award,
    CheckCircle,
    ChevronRight,
    Copy,
    Upload,
    ArrowLeft,
    Clock,
    Wallet,
    FileText,
    BadgeCheck,
    X,
    AlertCircle,
    Calculator,
} from "lucide-react";
import { useUserData } from "@/lib/hook/useUserData";
import { db, auth } from "@/firebase/config";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";

const PLANS: Record<string, {
    id: string;
    name: string;
    minInvestment: number;
    maxInvestment: number;
    roi: number;
    duration: string;
    durationDays: number;
    riskLevel: "Low" | "Medium" | "High";
    icon: React.ElementType;
    color: string;
    bgGradient: string;
    payoutOptions: string[];
    features: string[];
    description: string;
    recommended?: boolean;
}> = {
    starter: {
        id: "starter",
        name: "Starter Plan",
        minInvestment: 100,
        maxInvestment: 2000,
        roi: 5,
        duration: "30 days",
        durationDays: 30,
        riskLevel: "Low",
        icon: Shield,
        color: "from-green-500 to-emerald-600",
        bgGradient: "from-green-500/10 to-emerald-600/5",
        payoutOptions: ["Monthly"],
        features: [
            "5% Monthly Returns",
            "Capital Protected",
            "Withdraw Anytime",
            "Low Risk Investment",
            "24/7 Support",
        ],
        description:
            "Perfect for first-time investors. The Starter Plan offers a safe, low-risk entry point into our investment ecosystem with guaranteed capital protection and steady monthly returns.",
    },
    growth: {
        id: "growth",
        name: "Growth Plan",
        minInvestment: 2000,
        maxInvestment: 5000,
        roi: 12,
        duration: "60 days",
        durationDays: 60,
        riskLevel: "Medium",
        icon: TrendingUp,
        color: "from-blue-500 to-cyan-600",
        bgGradient: "from-blue-500/10 to-cyan-600/5",
        payoutOptions: ["Weekly", "Monthly"],
        features: [
            "12% Monthly Returns",
            "Compound Interest",
            "Weekly Payouts Available",
            "Medium Risk Investment",
            "Dedicated Account Manager",
        ],
        description:
            "Our most popular plan. Designed for investors who want significant returns with manageable risk. Compound interest and flexible payout scheduling make this the smart growth choice.",
        recommended: true,
    },
    premium: {
        id: "premium",
        name: "Premium Plan",
        minInvestment: 5000,
        maxInvestment: 50000,
        roi: 20,
        duration: "90 days",
        durationDays: 90,
        riskLevel: "High",
        icon: Award,
        color: "from-purple-500 to-pink-600",
        bgGradient: "from-purple-500/10 to-pink-600/5",
        payoutOptions: ["Weekly", "Monthly", "Annual"],
        features: [
            "20% Monthly Returns",
            "Exclusive Benefits",
            "Priority Support",
            "High Yield Investment",
            "VIP Wealth Manager",
        ],
        description:
            "For serious investors seeking maximum returns. Premium members receive VIP treatment, dedicated wealth managers, and access to exclusive high-yield opportunities not available on other tiers.",
    },
};



const STEPS = [
    { id: 1, label: "Plan Details", icon: FileText },
    { id: 2, label: "Your Info", icon: Wallet },
    { id: 3, label: "Payment", icon: Copy },
    { id: 4, label: "Confirm", icon: BadgeCheck },
];

export default function InvestPlanPage() {
    const params = useParams();
    const router = useRouter();
    const planId = (params?.id as string) || "starter";
    const plan = PLANS[planId];
    const [wallets, setWallets] = useState<{
        BTC: string;
        USDT_TRC20: string;
        USDT_ERC20: string;
    }>({
        BTC: "",
        USDT_TRC20: "",
        USDT_ERC20: "",
    });

    const { userData, loading: userLoading } = useUserData();

    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState("");
    const [payoutFrequency, setPayoutFrequency] = useState("");
    const [cryptoChoice, setCryptoChoice] = useState<"BTC" | "USDT_TRC20" | "USDT_ERC20">("BTC");
    const [txHash, setTxHash] = useState("");
    const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
    const [agreed, setAgreed] = useState(false);
    const [copied, setCopied] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function fetchWallets() {
            try {
                const snap = await getDoc(doc(db, "settings", "wallets"));
                if (snap.exists()) {
                    const data = snap.data();
                    setWallets({
                        BTC: data.BTC || "",
                        USDT_TRC20: data.USDT_TRC20 || "",
                        USDT_ERC20: data.USDT_ERC20 || "",
                    });
                }
            } catch (err) {
                console.error("Failed to load wallets", err);
            }
        }

        fetchWallets();
    }, []);

    useEffect(() => {
        if (!plan) router.push("/dashboard/invest");
    }, [plan, router]);

    // Default payout to first option
    useEffect(() => {
        if (plan && !payoutFrequency) {
            setPayoutFrequency(plan.payoutOptions[0]);
        }
    }, [plan]);

    if (!plan || userLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#B4925B] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const PlanIcon = plan.icon;
    const parsedAmount = parseFloat(amount) || 0;
    const walletAddress = wallets[cryptoChoice];
    const monthlyEarning = parsedAmount * (plan.roi / 100);
    const totalReturn = parsedAmount + monthlyEarning * (plan.durationDays / 30);


    function validateStep1() {
        const e: Record<string, string> = {};
        if (!amount || parsedAmount < plan.minInvestment)
            e.amount = `Minimum investment is $${plan.minInvestment.toLocaleString()}`;
        if (parsedAmount > plan.maxInvestment)
            e.amount = `Maximum investment is $${plan.maxInvestment.toLocaleString()}`;
        if (!payoutFrequency) e.payout = "Please select a payout frequency";
        if (!agreed) e.agreed = "You must agree to the terms";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function validateStep3() {
        const e: Record<string, string> = {};
        if (!txHash && !screenshotFile)
            e.proof = "Please provide a transaction hash or upload a screenshot";
        setErrors(e);
        return Object.keys(e).length === 0;
    }


    function copyWallet() {
        navigator.clipboard.writeText(walletAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setScreenshotFile(file);
        const reader = new FileReader();
        reader.onload = () => setScreenshotPreview(reader.result as string);
        reader.readAsDataURL(file);
    }

    // ─── Submit investment ─────────────────────────────────────────────────────
    async function handleSubmit() {
        if (!validateStep3()) return;
        setSubmitting(true);
        try {
            const uid = auth.currentUser?.uid;
            await addDoc(collection(db, "investments"), {
                userId: uid,
                planId: plan.id,
                planName: plan.name,
                amount: parsedAmount,
                roi: plan.roi,
                duration: plan.duration,
                payoutFrequency,
                cryptoChoice,
                walletAddress,
                txHash: txHash || null,
                hasScreenshot: !!screenshotFile,
                status: "pending",
                createdAt: serverTimestamp(),
                userFullName: userData?.fullName || "",
                userEmail: userData?.email || "",
                userPhone: userData?.phone || "",
                userCountry: userData?.country || "",
            });
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            setErrors({ submit: "Something went wrong. Please try again." });
        } finally {
            setSubmitting(false);
        }
    }


    function nextStep() {
        if (step === 2 && !validateStep1()) return;
        setStep((s) => Math.min(s + 1, 4));
    }

    // ─── Risk color ────────────────────────────────────────────────────────────
    const riskColor =
        plan.riskLevel === "Low"
            ? "text-green-400"
            : plan.riskLevel === "Medium"
                ? "text-yellow-400"
                : "text-red-400";

    // ─── SUCCESS SCREEN ────────────────────────────────────────────────────────
    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="w-24 h-24 rounded-full bg-[#B4925B]/20 border-2 border-[#B4925B] flex items-center justify-center mx-auto animate-pulse">
                        <BadgeCheck size={48} className="text-[#B4925B]" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Investment Submitted!</h2>
                        <p className="text-gray-400">
                            Your <span className="text-[#B4925B] font-semibold">{plan.name}</span> investment of{" "}
                            <span className="text-white font-semibold">${parsedAmount.toLocaleString()}</span> is
                            now under review. Our team will confirm your payment within 24 hours.
                        </p>
                    </div>
                    <div className="bg-black/60 border border-white/10 rounded-2xl p-5 text-left space-y-3">
                        {[
                            ["Plan", plan.name],
                            ["Amount", `$${parsedAmount.toLocaleString()}`],
                            ["Payout", payoutFrequency],
                            ["Duration", plan.duration],
                            ["Monthly ROI", `${plan.roi}%`],
                            ["Status", "Pending Confirmation"],
                        ].map(([label, value]) => (
                            <div key={label} className="flex justify-between text-sm">
                                <span className="text-gray-400">{label}</span>
                                <span className={value === "Pending Confirmation" ? "text-yellow-400 font-semibold" : "text-white font-semibold"}>{value}</span>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="w-full py-4 bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
                    >
                        Go to Dashboard
                    </button>
                    <p className="text-xs text-gray-500">
                        You&apos;ll receive a confirmation email at{" "}
                        <span className="text-[#B4925B]">{userData?.email}</span>
                    </p>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Back button */}
                <button
                    onClick={() => router.push("/dashboard/invest")}
                    className="flex items-center gap-2 text-gray-400 hover:text-[#B4925B] transition-colors text-sm"
                >
                    <ArrowLeft size={16} /> Back to Plans
                </button>

                {/* Plan Hero */}
                <div className={`relative rounded-2xl bg-gradient-to-br ${plan.bgGradient} border border-white/10 p-6 md:p-8 overflow-hidden`}>
                    {plan.recommended && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black text-xs font-bold px-3 py-1 rounded-full">
                            RECOMMENDED
                        </div>
                    )}
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                            <PlanIcon className="text-white" size={32} />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-white mb-1">{plan.name}</h1>
                            <p className="text-gray-400 text-sm max-w-xl">{plan.description}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <div className="text-5xl font-bold text-[#B4925B]">{plan.roi}%</div>
                            <div className="text-gray-400 text-sm">monthly returns</div>
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
                        {[
                            { label: "Min Investment", value: `$${plan.minInvestment.toLocaleString()}` },
                            { label: "Max Investment", value: `$${plan.maxInvestment.toLocaleString()}` },
                            { label: "Duration", value: plan.duration },
                            { label: "Risk Level", value: plan.riskLevel, className: riskColor },
                        ].map(({ label, value, className }) => (
                            <div key={label}>
                                <div className="text-gray-500 text-xs mb-1">{label}</div>
                                <div className={`font-semibold ${className || "text-white"}`}>{value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-between relative">
                    <div className="absolute top-4 left-0 right-0 h-px bg-white/10 z-0" />
                    {STEPS.map((s) => {
                        const Icon = s.icon;
                        const isActive = step === s.id;
                        const isDone = step > s.id;
                        return (
                            <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isDone
                                        ? "bg-[#B4925B] text-black"
                                        : isActive
                                            ? "bg-[#B4925B]/20 border-2 border-[#B4925B] text-[#B4925B]"
                                            : "bg-gray-900 border border-white/10 text-gray-600"
                                        }`}
                                >
                                    {isDone ? <CheckCircle size={16} /> : <Icon size={14} />}
                                </div>
                                <span className={`text-xs hidden md:block ${isActive ? "text-[#B4925B]" : isDone ? "text-gray-400" : "text-gray-600"}`}>
                                    {s.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Step Content */}
                <div className="backdrop-blur-xl bg-black/60 border border-white/10 rounded-2xl p-6 md:p-8">

                    {/* ── STEP 1: Plan Details & Features ── */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-white">Plan Features & Overview</h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Features list */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">What&apos;s included</h3>
                                    {plan.features.map((f) => (
                                        <div key={f} className="flex items-center gap-3 text-gray-300">
                                            <CheckCircle className="text-[#B4925B] flex-shrink-0" size={18} />
                                            <span>{f}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Earnings calculator */}
                                <div className="bg-white/5 rounded-xl p-5 space-y-4">
                                    <div className="flex items-center gap-2 text-[#B4925B] mb-2">
                                        <Calculator size={18} />
                                        <span className="text-sm font-semibold">Earnings Calculator</span>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 mb-1 block">Investment Amount (USD)</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                            <input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder={plan.minInvestment.toString()}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg pl-7 pr-4 py-3 text-white focus:outline-none focus:border-[#B4925B] transition-colors"
                                                min={plan.minInvestment}
                                                max={plan.maxInvestment}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                                            <span>Min: ${plan.minInvestment.toLocaleString()}</span>
                                            <span>Max: ${plan.maxInvestment.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    {parsedAmount >= plan.minInvestment && (
                                        <div className="space-y-2 border-t border-white/10 pt-4">
                                            {[
                                                ["Monthly Earnings", `$${monthlyEarning.toFixed(2)}`],
                                                [`Total after ${plan.duration}`, `$${totalReturn.toFixed(2)}`],
                                                ["Net Profit", `$${(totalReturn - parsedAmount).toFixed(2)}`],
                                            ].map(([label, value]) => (
                                                <div key={label} className="flex justify-between text-sm">
                                                    <span className="text-gray-400">{label}</span>
                                                    <span className="text-[#B4925B] font-semibold">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Payout options */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Payout Frequency</h3>
                                <div className="flex gap-3 flex-wrap">
                                    {plan.payoutOptions.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => setPayoutFrequency(opt)}
                                            className={`px-5 py-2.5 rounded-lg border text-sm font-medium transition-all ${payoutFrequency === opt
                                                ? "border-[#B4925B] bg-[#B4925B]/10 text-[#B4925B]"
                                                : "border-white/10 text-gray-400 hover:border-white/30"
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                className="flex items-center gap-2 ml-auto px-8 py-3 bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
                            >
                                Continue <ChevronRight size={18} />
                            </button>
                        </div>
                    )}

                    {/* ── STEP 2: Your Info & Confirm Amount ── */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-white">Confirm Your Details</h2>
                            <p className="text-sm text-gray-400">Your information has been pre-filled from your profile. Review and proceed.</p>

                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    { label: "Full Name", value: userData?.fullName || "" },
                                    { label: "Email Address", value: userData?.email || "" },
                                    { label: "Phone Number", value: userData?.phone || "" },
                                    { label: "Country", value: userData?.country || "" },
                                    { label: "City", value: userData?.city || "" },
                                    { label: "Username", value: userData?.username || "" },
                                ].map(({ label, value }) => (
                                    <div key={label}>
                                        <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                                        <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm">
                                            {value || <span className="text-gray-600 italic">Not provided</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Investment summary */}
                            <div className="bg-[#B4925B]/5 border border-[#B4925B]/20 rounded-xl p-5">
                                <h3 className="text-[#B4925B] font-semibold mb-4">Investment Summary</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                    {[
                                        ["Plan", plan.name],
                                        ["Amount", parsedAmount >= plan.minInvestment ? `$${parsedAmount.toLocaleString()}` : "—"],
                                        ["Payout", payoutFrequency || "—"],
                                        ["Duration", plan.duration],
                                        ["Monthly ROI", `${plan.roi}%`],
                                        ["Expected Return", parsedAmount >= plan.minInvestment ? `$${totalReturn.toFixed(2)}` : "—"],
                                    ].map(([label, value]) => (
                                        <div key={label}>
                                            <div className="text-gray-500 text-xs">{label}</div>
                                            <div className="text-white font-semibold mt-0.5">{value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Amount input if not set */}
                            {(!amount || parsedAmount < plan.minInvestment) && (
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">Investment Amount (USD) *</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder={`Min $${plan.minInvestment}`}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg pl-7 pr-4 py-3 text-white focus:outline-none focus:border-[#B4925B] transition-colors"
                                        />
                                    </div>
                                    {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount}</p>}
                                </div>
                            )}

                            {/* T&C */}
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div
                                    onClick={() => setAgreed(!agreed)}
                                    className={`w-5 h-5 mt-0.5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-all ${agreed ? "bg-[#B4925B] border-[#B4925B]" : "border-white/30 group-hover:border-[#B4925B]/50"
                                        }`}
                                >
                                    {agreed && <CheckCircle size={12} className="text-black" />}
                                </div>
                                <span className="text-sm text-gray-400">
                                    I understand the risks involved and agree to the{" "}
                                    <span className="text-[#B4925B] underline cursor-pointer">Terms & Conditions</span>{" "}
                                    and{" "}
                                    <span className="text-[#B4925B] underline cursor-pointer">Investment Policy</span>.
                                    I confirm that the investment amount of{" "}
                                    <span className="text-white font-semibold">
                                        ${parsedAmount >= plan.minInvestment ? parsedAmount.toLocaleString() : "..."}
                                    </span>{" "}
                                    is correct.
                                </span>
                            </label>
                            {errors.agreed && <p className="text-red-400 text-xs">{errors.agreed}</p>}

                            <div className="flex gap-3 justify-between">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-6 py-3 border border-white/10 text-gray-400 rounded-xl hover:border-white/30 transition-colors text-sm"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={nextStep}
                                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
                                >
                                    Proceed to Payment <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 3: Payment ── */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-white">Make Your Payment</h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    Send exactly{" "}
                                    <span className="text-[#B4925B] font-semibold">${parsedAmount.toLocaleString()} USD</span>{" "}
                                    equivalent to the address below.
                                </p>
                            </div>

                            {/* Crypto selector */}
                            <div>
                                <label className="text-xs text-gray-400 uppercase tracking-wider mb-3 block">Select Network</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(["BTC", "USDT_TRC20", "USDT_ERC20"] as const).map((key) => {
                                        const labels: Record<string, string> = {
                                            BTC: "Bitcoin (BTC)",
                                            USDT_TRC20: "USDT TRC20",
                                            USDT_ERC20: "USDT ERC20",
                                        };
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => setCryptoChoice(key)}
                                                className={`py-3 px-3 rounded-xl border text-sm font-medium transition-all text-center ${cryptoChoice === key
                                                    ? "border-[#B4925B] bg-[#B4925B]/10 text-[#B4925B]"
                                                    : "border-white/10 text-gray-400 hover:border-white/30"
                                                    }`}
                                            >
                                                {labels[key]}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Wallet address */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
                                <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider">
                                    <Wallet size={14} />
                                    Payment Address
                                </div>
                                <div className="flex items-start gap-3">
                                    <code className="flex-1 text-[#B4925B] text-sm break-all font-mono bg-black/40 rounded-lg p-3">
                                        {walletAddress}
                                    </code>
                                    <button
                                        onClick={copyWallet}
                                        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all ${copied
                                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                            : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30"
                                            }`}
                                    >
                                        {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                                        {copied ? "Copied!" : "Copy"}
                                    </button>
                                </div>
                                <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                                    <AlertCircle size={14} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-yellow-300 text-xs">
                                        Send only on the selected network. Sending on the wrong network will result in permanent loss of funds.
                                    </p>
                                </div>
                            </div>

                            {/* Amount reminder */}
                            <div className="flex items-center justify-between bg-[#B4925B]/5 border border-[#B4925B]/20 rounded-xl p-4">
                                <div className="text-gray-400 text-sm flex items-center gap-2">
                                    <Clock size={16} /> Amount to send
                                </div>
                                <div className="text-[#B4925B] font-bold text-lg">${parsedAmount.toLocaleString()} USD</div>
                            </div>

                            {/* Proof of payment */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-300">Proof of Payment</h3>

                                {/* TX Hash */}
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">Transaction Hash / ID (optional if uploading screenshot)</label>
                                    <input
                                        type="text"
                                        value={txHash}
                                        onChange={(e) => setTxHash(e.target.value)}
                                        placeholder="0x... or txid..."
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-[#B4925B] transition-colors"
                                    />
                                </div>

                                {/* Screenshot upload */}
                                <div>
                                    <label className="text-xs text-gray-400 mb-2 block">Upload Screenshot</label>
                                    <div
                                        onClick={() => fileRef.current?.click()}
                                        className={`border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all text-center ${screenshotPreview
                                            ? "border-[#B4925B]/50 bg-[#B4925B]/5"
                                            : "border-white/10 hover:border-[#B4925B]/30 hover:bg-white/5"
                                            }`}
                                    >
                                        {screenshotPreview ? (
                                            <div className="space-y-3">
                                                <Image
                                                    src={screenshotPreview}
                                                    alt="Screenshot"
                                                    className="max-h-40 mx-auto rounded-lg object-contain" />
                                                <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
                                                    <CheckCircle size={16} /> Screenshot uploaded
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setScreenshotFile(null);
                                                        setScreenshotPreview(null);
                                                    }}
                                                    className="flex items-center gap-1 text-xs text-red-400 mx-auto hover:text-red-300"
                                                >
                                                    <X size={12} /> Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <Upload size={32} className="text-gray-600 mx-auto" />
                                                <p className="text-gray-400 text-sm">Click to upload payment screenshot</p>
                                                <p className="text-gray-600 text-xs">PNG, JPG, WEBP up to 10MB</p>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        ref={fileRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFile}
                                        className="hidden"
                                    />
                                </div>

                                {errors.proof && (
                                    <div className="flex items-center gap-2 text-red-400 text-sm">
                                        <AlertCircle size={14} /> {errors.proof}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 justify-between">
                                <button
                                    onClick={() => setStep(2)}
                                    className="px-6 py-3 border border-white/10 text-gray-400 rounded-xl hover:border-white/30 transition-colors text-sm"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => { if (validateStep3()) setStep(4); }}
                                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
                                >
                                    Review & Confirm <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 4: Final Review & Submit ── */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-white">Review & Confirm Investment</h2>
                                <p className="text-sm text-gray-400 mt-1">Please review everything carefully before submitting.</p>
                            </div>

                            {/* Full summary */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-xl p-5 space-y-3">
                                    <h3 className="text-[#B4925B] text-sm font-semibold uppercase tracking-wider">Investment Details</h3>
                                    {[
                                        ["Plan", plan.name],
                                        ["Amount", `$${parsedAmount.toLocaleString()}`],
                                        ["Payout", payoutFrequency],
                                        ["Duration", plan.duration],
                                        ["Monthly ROI", `${plan.roi}%`],
                                        ["Total Return", `$${totalReturn.toFixed(2)}`],
                                    ].map(([label, value]) => (
                                        <div key={label} className="flex justify-between text-sm">
                                            <span className="text-gray-400">{label}</span>
                                            <span className="text-white font-semibold">{value}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-white/5 rounded-xl p-5 space-y-3">
                                    <h3 className="text-[#B4925B] text-sm font-semibold uppercase tracking-wider">Payment Details</h3>
                                    {[
                                        ["Network", cryptoChoice.replace("_", " ")],
                                        ["Amount", `$${parsedAmount.toLocaleString()} USD`],
                                        ["Tx Hash", txHash ? `${txHash.slice(0, 12)}...` : "—"],
                                        ["Screenshot", screenshotFile ? "Uploaded ✓" : "—"],
                                        ["Status", "Awaiting Confirmation"],
                                    ].map(([label, value]) => (
                                        <div key={label} className="flex justify-between text-sm">
                                            <span className="text-gray-400">{label}</span>
                                            <span className={value === "Awaiting Confirmation" ? "text-yellow-400 font-semibold" : "text-white font-semibold"}>{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-xl p-5 space-y-3">
                                <h3 className="text-[#B4925B] text-sm font-semibold uppercase tracking-wider">Investor Information</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        ["Name", userData?.fullName || "—"],
                                        ["Email", userData?.email || "—"],
                                        ["Phone", userData?.phone || "—"],
                                        ["Country", userData?.country || "—"],
                                    ].map(([label, value]) => (
                                        <div key={label} className="text-sm">
                                            <div className="text-gray-500 text-xs">{label}</div>
                                            <div className="text-white">{value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                                <p className="text-yellow-300 text-sm">
                                    After submission, your investment will be marked as <strong>Pending</strong> until our admin team confirms your payment. This typically takes up to 24 hours. You&apos;ll be notified via email once confirmed.
                                </p>
                            </div>

                            {errors.submit && (
                                <div className="flex items-center gap-2 text-red-400 text-sm">
                                    <AlertCircle size={14} /> {errors.submit}
                                </div>
                            )}

                            <div className="flex gap-3 justify-between">
                                <button
                                    onClick={() => setStep(3)}
                                    className="px-6 py-3 border border-white/10 text-gray-400 rounded-xl hover:border-white/30 transition-colors text-sm"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <BadgeCheck size={18} /> Submit Investment
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}