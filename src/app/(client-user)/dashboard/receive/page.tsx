"use client";

import React, { useState } from "react";
import {
    Send,
    Download,
    QrCode,
    Copy,
    AlertCircle,
    CheckCircle,
    Wallet,
} from "lucide-react";
import { useUserData } from "@/lib/hook/useUserData";
import { useFormatPrice } from "@/lib/hook/useFormatPrice";


const BTC_PRICE_USD = 43700;

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div
            className={`rounded-2xl ${className}`}
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(180,146,91,0.14)" }}
        >
            {children}
        </div>
    );
}

function Label({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-[10px] font-semibold text-[#B4925B]/60 uppercase tracking-widest mb-2">
            {children}
        </p>
    );
}

// ── Confirm modal ─────────────────────────────────────────────────────────────

function ConfirmModal({
    amountUSD,
    btcEquiv,
    recipient,
    walletAddress,
    onCancel,
    onConfirm,
}: {
    amountUSD: string;
    btcEquiv: string;
    recipient: string;
    walletAddress: string;
    onCancel: () => void;
    onConfirm: () => void;
}) {
    const fee = 2.5; // flat USD fee
    const total = (parseFloat(amountUSD || "0") + fee).toFixed(2);

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div
                className="w-full max-w-md rounded-2xl sm:rounded-3xl p-6"
                style={{ background: "#0e0e0e", border: "1px solid rgba(180,146,91,0.2)" }}
            >
                <div className="w-10 h-10 mx-auto mb-4 rounded-xl bg-[#B4925B]/15 flex items-center justify-center">
                    <Send className="text-[#B4925B]" size={18} />
                </div>
                <h2 className="text-lg font-bold text-white text-center mb-1">Confirm Transaction</h2>
                <p className="text-zinc-600 text-xs text-center mb-5">Review carefully before sending</p>

                <div className="space-y-2 mb-5">
                    {/* Amount */}
                    <div className="rounded-xl p-3.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <p className="text-[9px] text-zinc-700 uppercase tracking-widest mb-1.5">You&apos;re sending</p>
                        <p className="text-white font-bold text-xl">${parseFloat(amountUSD || "0").toLocaleString("en-US", { minimumFractionDigits: 2 })} USD</p>
                        <p className="text-zinc-600 text-xs mt-0.5">≈ {btcEquiv} BTC</p>
                    </div>

                    {/* Recipient */}
                    <div className="rounded-xl p-3.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <p className="text-[9px] text-zinc-700 uppercase tracking-widest mb-1.5">Recipient address</p>
                        <p className="text-white font-mono text-xs break-all">{recipient || walletAddress}</p>
                    </div>

                    {/* Fee */}
                    <div className="rounded-xl p-3.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-zinc-600">Network Fee</span>
                            <span className="text-zinc-400">${fee.toFixed(2)} USD</span>
                        </div>
                        <div className="h-px bg-white/5 mb-1.5" />
                        <div className="flex justify-between text-sm font-semibold">
                            <span className="text-zinc-400">Total Deducted</span>
                            <span className="text-[#B4925B]">${total} USD</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 border border-white/10 text-zinc-400 rounded-xl text-sm font-semibold hover:bg-white/5 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black rounded-xl text-sm font-semibold hover:shadow-lg transition-all active:scale-[0.98]"
                    >
                        Confirm Send
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function CryptoTransferPage() {
    const { userData, loading, error } = useUserData();
    const { formatUSD } = useFormatPrice();


    const [tab, setTab] = useState<"send" | "receive">("send");
    const [recipient, setRecipient] = useState("");
    const [amountUSD, setAmountUSD] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [copied, setCopied] = useState(false);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#080808]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-[#B4925B] border-t-transparent rounded-full animate-spin" />
                    <p className="text-zinc-600 text-xs tracking-widest uppercase">Loading</p>
                </div>
            </div>
        );
    }

    if (error || !userData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#080808] gap-3">
                <AlertCircle className="w-7 h-7 text-red-400" />
                <p className="text-red-400 text-sm">{error || "Unable to load data."}</p>
            </div>
        );
    }

    const usdBalance = userData.balance ?? 0;
    const walletAddress = userData.walletAddress ?? "";
    const btcEquiv = amountUSD
        ? (parseFloat(amountUSD) / BTC_PRICE_USD).toFixed(8)
        : "0.00000000";

    const setPercent = (pct: number) => {
        setAmountUSD(((usdBalance * pct) / 100).toFixed(2));
    };

    const handleConfirm = () => {
        setShowConfirm(false);
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setRecipient("");
            setAmountUSD("");
        }, 3000);
    };

    const copyAddress = () => {
        navigator.clipboard.writeText(walletAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#080808]">
            <div className="max-w-xl lg:max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-5">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <h1
                            className="text-2xl sm:text-3xl font-bold tracking-tight"
                            style={{ background: "linear-gradient(90deg,#B4925B,#e0c99a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                        >
                            {tab === "send" ? "Send" : "Receive"}
                        </h1>
                        <p className="text-zinc-600 text-sm mt-0.5">
                            {tab === "send" ? "Send USD from your balance" : "Share your wallet address"}
                        </p>
                    </div>

                    {/* Tab toggle */}
                    <div
                        className="flex self-start sm:self-auto rounded-xl p-1 gap-1"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                        {(["send", "receive"] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${tab === t
                                        ? "bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black shadow"
                                        : "text-zinc-500 hover:text-white"
                                    }`}
                            >
                                {t === "send" ? <Send size={13} /> : <Download size={13} />}
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Balance strip ── */}
                <div
                    className="rounded-2xl px-5 py-4 flex items-center justify-between gap-3"
                    style={{ background: "linear-gradient(135deg,#1c1408,#2a1d0c)", border: "1px solid rgba(180,146,91,0.2)" }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#B4925B] to-[#8B7355] flex items-center justify-center">
                            <Wallet size={16} className="text-black" />
                        </div>
                        <div>
                            <p className="text-zinc-600 text-[10px] uppercase tracking-widest">Available Balance</p>
                            <p className="text-white font-bold">
                                ${formatUSD(usdBalance)}
                                <span className="text-zinc-600 text-xs font-normal ml-1.5">USD</span>
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-zinc-700 text-[10px] uppercase tracking-widest">BTC equiv.</p>
                        <p className="text-zinc-500 text-xs font-mono">
                            {(usdBalance / BTC_PRICE_USD).toFixed(6)} BTC
                        </p>
                    </div>
                </div>

                {/* ══════════ SEND TAB ══════════ */}
                {tab === "send" && (
                    <Card className="p-5 sm:p-7 space-y-5">

                        {/* Recipient wallet address */}
                        <div>
                            <Label>Recipient Wallet Address</Label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                    placeholder="Enter or paste wallet address"
                                    className="w-full px-4 py-3.5 pr-12 bg-white/[0.03] border border-white/8 rounded-xl text-white text-sm placeholder-zinc-700 focus:outline-none focus:border-[#B4925B]/60 focus:ring-1 focus:ring-[#B4925B]/20 transition-all"
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-lg transition-all">
                                    <QrCode className="text-[#B4925B]" size={17} />
                                </button>
                            </div>
                            <p className="text-[10px] text-zinc-700 mt-1.5">
                                Transactions are irreversible — verify the address before sending.
                            </p>
                        </div>

                        {/* USD Amount */}
                        <div>
                            <Label>Amount (USD)</Label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-2xl font-bold">$</span>
                                <input
                                    type="number"
                                    value={amountUSD}
                                    onChange={(e) => setAmountUSD(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full pl-9 pr-4 py-3.5 bg-white/[0.03] border border-white/8 rounded-xl text-white text-2xl font-bold placeholder-zinc-700 focus:outline-none focus:border-[#B4925B]/60 focus:ring-1 focus:ring-[#B4925B]/20 transition-all"
                                />
                            </div>

                            {/* BTC equivalent tag */}
                            {amountUSD && parseFloat(amountUSD) > 0 && (
                                <p className="text-[11px] text-zinc-500 mt-1.5 flex items-center gap-1">
                                    <span className="inline-block bg-[#B4925B]/10 border border-[#B4925B]/20 text-[#B4925B] rounded-full px-2 py-0.5 font-mono font-semibold">
                                        ≈ {btcEquiv} BTC
                                    </span>
                                    <span className="text-zinc-700">at current rate</span>
                                </p>
                            )}

                            {/* Percentage quick-fill */}
                            <div className="grid grid-cols-4 gap-2 mt-3">
                                {[["25%", 25], ["50%", 50], ["75%", 75], ["Max", 100]].map(([label, pct]) => (
                                    <button
                                        key={label as string}
                                        onClick={() => setPercent(pct as number)}
                                        className="py-2 bg-white/[0.03] hover:bg-[#B4925B]/10 border border-white/8 hover:border-[#B4925B]/25 rounded-lg text-xs font-semibold text-zinc-600 hover:text-[#B4925B] transition-all active:scale-95"
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Fee row */}
                        <div
                            className="rounded-xl px-4 py-3 flex items-center justify-between"
                            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                        >
                            <div>
                                <p className="text-[10px] text-zinc-700 uppercase tracking-widest">Network Fee</p>
                                <p className="text-xs text-zinc-400 font-semibold mt-0.5">$2.50 USD</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-zinc-700 uppercase tracking-widest">Total Deducted</p>
                                <p className="text-sm font-bold text-[#B4925B] mt-0.5">
                                    ${amountUSD ? (parseFloat(amountUSD) + 2.5).toLocaleString("en-US", { minimumFractionDigits: 2 }) : "0.00"} USD
                                </p>
                            </div>
                        </div>

                        {/* Send button */}
                        <button
                            onClick={() => setShowConfirm(true)}
                            disabled={!recipient || !amountUSD || parseFloat(amountUSD) <= 0}
                            className="w-full py-3.5 bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-[#B4925B]/20 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Send size={15} /> Send USD
                        </button>
                    </Card>
                )}

                {/* ══════════ RECEIVE TAB ══════════ */}
                {tab === "receive" && (
                    <Card className="p-5 sm:p-7 space-y-5">

                        {/* QR placeholder */}
                        <div className="bg-white rounded-2xl p-6 flex items-center justify-center">
                            <div className="w-44 h-44 sm:w-52 sm:h-52 bg-zinc-100 rounded-xl flex items-center justify-center">
                                <QrCode className="text-zinc-300" size={120} />
                            </div>
                        </div>

                        {/* Wallet address */}
                        <div>
                            <Label>Your Wallet Address</Label>
                            <div
                                className="rounded-xl px-4 py-3.5 mb-3"
                                style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
                            >
                                <p className="text-white font-mono text-xs sm:text-sm break-all text-center leading-relaxed">
                                    {walletAddress || "No wallet address found"}
                                </p>
                            </div>
                            <button
                                onClick={copyAddress}
                                className="w-full py-3.5 bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-[#B4925B]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                {copied
                                    ? <><CheckCircle size={15} /> Copied!</>
                                    : <><Copy size={15} /> Copy Address</>}
                            </button>
                        </div>

                        {/* Warning */}
                        <div
                            className="rounded-xl px-4 py-3.5 flex items-start gap-3"
                            style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.12)" }}
                        >
                            <AlertCircle className="text-amber-400 shrink-0 mt-0.5" size={15} />
                            <div className="space-y-1 text-xs text-zinc-500">
                                <p>Share this address to receive funds into your account.</p>
                                <p>Only send compatible assets — sending unsupported tokens may result in permanent loss.</p>
                                <p className="text-zinc-600">Confirmations: <span className="text-zinc-400">3–6 blocks</span> · Min deposit: <span className="text-zinc-400">$1.00</span></p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* ── Confirm modal ── */}
                {showConfirm && (
                    <ConfirmModal
                        amountUSD={amountUSD}
                        btcEquiv={btcEquiv}
                        recipient={recipient}
                        walletAddress={walletAddress}
                        onCancel={() => setShowConfirm(false)}
                        onConfirm={handleConfirm}
                    />
                )}

                {/* ── Success modal ── */}
                {showSuccess && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div
                            className="w-full max-w-sm rounded-2xl p-7 text-center"
                            style={{ background: "#0e0e0e", border: "1px solid rgba(34,197,94,0.2)" }}
                        >
                            <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
                                <CheckCircle className="text-emerald-400" size={24} />
                            </div>
                            <h2 className="text-lg font-bold text-white mb-1">Transaction Sent!</h2>
                            <p className="text-zinc-500 text-sm mb-5">Your funds have been sent successfully.</p>
                            <button
                                onClick={() => setShowSuccess(false)}
                                className="w-full py-3 bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black rounded-xl font-semibold text-sm"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}