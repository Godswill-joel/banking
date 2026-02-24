"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "@/firebase/config";
import { useUserData } from "@/lib/hook/useUserData";
import {
  TrendingUp,
  Shield,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Wallet,
  ArrowDownCircle,
  BarChart2,
  Calendar,
  Loader2,
  RefreshCw,
  PlusCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Investment {
  id: string;
  planId: "starter" | "growth" | "premium";
  planName: string;
  amount: number;
  roi: number;
  duration: string;
  durationDays: number;
  payoutFrequency: "Weekly" | "Monthly" | "Annual";
  cryptoChoice: string;
  status: "pending" | "active" | "completed" | "cancelled" | "withdraw_requested";
  createdAt: Timestamp;
  confirmedAt?: Timestamp;
  txHash?: string;
}

// ─── Plan metadata ────────────────────────────────────────────────────────────

const PLAN_META: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  starter: { icon: Shield, color: "from-green-500 to-emerald-600", bg: "from-green-500/10 to-emerald-600/5" },
  growth: { icon: TrendingUp, color: "from-blue-500 to-cyan-600", bg: "from-blue-500/10 to-cyan-600/5" },
  premium: { icon: Award, color: "from-purple-500 to-pink-600", bg: "from-purple-500/10 to-pink-600/5" },
};

// ─── Payout interval in days ──────────────────────────────────────────────────

const PAYOUT_INTERVAL: Record<string, number> = {
  Weekly: 7,
  Monthly: 30,
  Annual: 365,
};

// ─── Duration map (plan → days) ───────────────────────────────────────────────

const DURATION_DAYS: Record<string, number> = {
  starter: 30,
  growth: 60,
  premium: 90,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysBetween(a: Date, b: Date) {
  return Math.max(0, Math.floor((b.getTime() - a.getTime()) / 86400000));
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function calcEarnings(inv: Investment): number {
  const start = inv.confirmedAt?.toDate() ?? inv.createdAt.toDate();
  const now = new Date();
  const daysActive = Math.min(daysBetween(start, now), inv.durationDays ?? DURATION_DAYS[inv.planId] ?? 30);
  const dailyRate = inv.roi / 100 / 30;
  return parseFloat((inv.amount * dailyRate * daysActive).toFixed(2));
}

function calcProgress(inv: Investment): number {
  const start = inv.confirmedAt?.toDate() ?? inv.createdAt.toDate();
  const total = inv.durationDays ?? DURATION_DAYS[inv.planId] ?? 30;
  const elapsed = daysBetween(start, new Date());
  return Math.min(100, Math.round((elapsed / total) * 100));
}

function calcNextPayout(inv: Investment): Date {
  const start = inv.confirmedAt?.toDate() ?? inv.createdAt.toDate();
  const interval = PAYOUT_INTERVAL[inv.payoutFrequency] ?? 30;
  const now = new Date();
  let next = addDays(start, interval);
  while (next < now) next = addDays(next, interval);
  return next;
}

function daysUntil(date: Date) {
  return daysBetween(new Date(), date);
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Investment["status"] }) {
  const map: Record<string, { label: string; className: string; icon: React.ElementType }> = {
    pending: { label: "Pending", className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: Clock },
    active: { label: "Active", className: "bg-green-500/10 text-green-400 border-green-500/20", icon: CheckCircle },
    completed: { label: "Completed", className: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: CheckCircle },
    cancelled: { label: "Cancelled", className: "bg-red-500/10 text-red-400 border-red-500/20", icon: XCircle },
    withdraw_requested: { label: "Withdraw Requested", className: "bg-orange-500/10 text-orange-400 border-orange-500/20", icon: ArrowDownCircle },
  };
  const s = map[status] ?? map.pending;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${s.className}`}>
      <Icon size={11} />
      {s.label}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MyInvestmentsPage() {
  const router = useRouter();
  const { userData, loading: userLoading } = useUserData();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawRequesting, setWithdrawRequesting] = useState<string | null>(null);
  const [withdrawSuccess, setWithdrawSuccess] = useState<string | null>(null);
  const [confirmWithdraw, setConfirmWithdraw] = useState<Investment | null>(null);

  // ─── Fetch investments ──────────────────────────────────────────────────────
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "investments"),
      where("userId", "==", uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          planId: d.planId,
          planName: d.planName,
          amount: d.amount,
          roi: d.roi,
          duration: d.duration,
          durationDays: d.durationDays ?? DURATION_DAYS[d.planId] ?? 30,
          payoutFrequency: d.payoutFrequency,
          cryptoChoice: d.cryptoChoice,
          status: d.status,
          createdAt: d.createdAt,
          confirmedAt: d.confirmedAt,
          txHash: d.txHash,
        } as Investment;
      });
      setInvestments(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // ─── Request withdraw ────────────────────────────────────────────────────────
  async function requestWithdraw(inv: Investment) {
    setWithdrawRequesting(inv.id);
    try {
      await addDoc(collection(db, "withdraw_requests"), {
        userId: auth.currentUser?.uid,
        investmentId: inv.id,
        planName: inv.planName,
        amount: inv.amount,
        earnings: calcEarnings(inv),
        totalExpected: inv.amount + calcEarnings(inv),
        userFullName: userData?.fullName ?? "",
        userEmail: userData?.email ?? "",
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setWithdrawSuccess(inv.id);
      setTimeout(() => setWithdrawSuccess(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setWithdrawRequesting(null);
      setConfirmWithdraw(null);
    }
  }

  // ─── Summary stats ───────────────────────────────────────────────────────────
  const activeInvestments = investments.filter((i) => i.status === "active");
  const totalInvested = activeInvestments.reduce((s, i) => s + i.amount, 0);
  const totalEarnings = activeInvestments.reduce((s, i) => s + calcEarnings(i), 0);
  const totalPortfolio = totalInvested + totalEarnings;

  // ─── Loading ─────────────────────────────────────────────────────────────────
  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#B4925B] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading your investments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#B4925B] to-white bg-clip-text text-transparent">
              My Investments
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              Track your portfolio, earnings, and payouts in real time.
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/invest")}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black font-bold rounded-xl text-sm hover:opacity-90 transition-opacity"
          >
            <PlusCircle size={16} /> New Investment
          </button>
        </div>

        {/* Summary Cards */}
        {investments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Total Invested",
                value: `$${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                icon: Wallet,
                color: "text-[#B4925B]",
              },
              {
                label: "Earnings So Far",
                value: `$${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                icon: TrendingUp,
                color: "text-green-400",
              },
              {
                label: "Portfolio Value",
                value: `$${totalPortfolio.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                icon: BarChart2,
                color: "text-blue-400",
              },
            ].map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="bg-black/60 border border-white/10 rounded-2xl p-5 flex items-center gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className={color} />
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">{label}</p>
                  <p className={`text-xl font-bold ${color}`}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {investments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-5">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <BarChart2 size={36} className="text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2">No Investments Yet</h2>
              <p className="text-gray-500 text-sm max-w-xs">
                You haven&apos;t made any investments yet. Choose a plan and start earning passive income today.
              </p>
            </div>
            <button
              onClick={() => router.push("/invest")}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#B4925B] to-[#8B7355] text-black font-bold rounded-xl text-sm hover:opacity-90 transition-opacity"
            >
              Browse Plans <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Investment List */}
        {investments.length > 0 && (
          <div className="space-y-5">
            {investments.map((inv) => {
              const meta = PLAN_META[inv.planId] ?? PLAN_META.starter;
              const PlanIcon = meta.icon;
              const earnings = calcEarnings(inv);
              const progress = calcProgress(inv);
              const nextPayout = calcNextPayout(inv);
              const daysLeft = daysUntil(nextPayout);
              const totalDays = inv.durationDays ?? DURATION_DAYS[inv.planId] ?? 30;
              const startDate = inv.confirmedAt?.toDate() ?? inv.createdAt.toDate();
              const endDate = addDays(startDate, totalDays);
              const isActive = inv.status === "active";
              const isPending = inv.status === "pending";
              const canWithdraw = isActive;
              const isWithdrawRequested = inv.status === "withdraw_requested";
              const didWithdrawSucceed = withdrawSuccess === inv.id;

              return (
                <div
                  key={inv.id}
                  className={`relative bg-black/60 border rounded-2xl overflow-hidden transition-all ${
                    isActive ? "border-white/10" : "border-white/5 opacity-80"
                  }`}
                >
                  {/* Top accent line */}
                  <div className={`h-0.5 w-full bg-gradient-to-r ${meta.color}`} />

                  <div className="p-5 md:p-6 space-y-5">
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
                        >
                          <PlanIcon className="text-white" size={24} />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg leading-tight">{inv.planName}</h3>
                          <p className="text-gray-500 text-xs mt-0.5">
                            Started {formatDate(startDate)} · Ends {formatDate(endDate)}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={inv.status} />
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white/5 rounded-xl p-3">
                        <p className="text-gray-500 text-xs mb-1">Invested</p>
                        <p className="text-white font-bold">${inv.amount.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3">
                        <p className="text-gray-500 text-xs mb-1">Monthly ROI</p>
                        <p className="text-[#B4925B] font-bold">{inv.roi}%</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3">
                        <p className="text-gray-500 text-xs mb-1">Earnings So Far</p>
                        <p className="text-green-400 font-bold">
                          {isActive || inv.status === "completed"
                            ? `$${earnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                            : "—"}
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3">
                        <p className="text-gray-500 text-xs mb-1">Payout Freq.</p>
                        <p className="text-white font-bold">{inv.payoutFrequency}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {(isActive || inv.status === "completed") && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Investment Progress</span>
                          <span>{progress}% complete · {totalDays} day plan</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${meta.color} transition-all duration-700`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>{formatDate(startDate)}</span>
                          <span>{formatDate(endDate)}</span>
                        </div>
                      </div>
                    )}

                    {/* Next Payout + Network + Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex flex-wrap gap-4">
                        {/* Next payout */}
                        {isActive && (
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar size={14} className="text-[#B4925B]" />
                            <span className="text-gray-400">
                              Next payout:{" "}
                              <span className="text-white font-semibold">
                                {formatDate(nextPayout)}
                              </span>{" "}
                              <span className="text-gray-500">
                                ({daysLeft === 0 ? "Today!" : `in ${daysLeft}d`})
                              </span>
                            </span>
                          </div>
                        )}

                        {/* Crypto */}
                        <div className="flex items-center gap-2 text-sm">
                          <Wallet size={14} className="text-gray-500" />
                          <span className="text-gray-500">{inv.cryptoChoice?.replace("_", " ")}</span>
                        </div>

                        {/* Pending note */}
                        {isPending && (
                          <div className="flex items-center gap-2 text-sm text-yellow-400">
                            <AlertCircle size={14} />
                            Awaiting admin confirmation
                          </div>
                        )}
                      </div>

                      {/* Withdraw button */}
                      {canWithdraw && !isWithdrawRequested && (
                        <button
                          onClick={() => setConfirmWithdraw(inv)}
                          className="flex items-center gap-1.5 px-4 py-2 border border-orange-500/30 bg-orange-500/5 text-orange-400 hover:bg-orange-500/10 rounded-xl text-xs font-semibold transition-all"
                        >
                          <ArrowDownCircle size={14} />
                          Request Withdrawal
                        </button>
                      )}

                      {isWithdrawRequested && (
                        <span className="flex items-center gap-1.5 text-orange-400 text-xs font-semibold">
                          <RefreshCw size={13} className="animate-spin" />
                          Withdrawal pending review
                        </span>
                      )}

                      {didWithdrawSucceed && (
                        <span className="flex items-center gap-1.5 text-green-400 text-xs font-semibold">
                          <CheckCircle size={13} />
                          Request submitted!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Disclaimer */}
        {investments.length > 0 && (
          <p className="text-center text-xs text-gray-600 pb-4">
            Earnings displayed are estimates based on your plan&apos;s ROI and time elapsed.
            Actual payouts are processed by our team on your selected schedule.
          </p>
        )}
      </div>

      {/* ── Withdraw Confirmation Modal ── */}
      {confirmWithdraw && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full space-y-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <ArrowDownCircle size={20} className="text-orange-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">Request Withdrawal</h3>
                <p className="text-gray-500 text-xs">{confirmWithdraw.planName}</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm">
              {[
                ["Principal", `$${confirmWithdraw.amount.toLocaleString()}`],
                ["Earnings", `$${calcEarnings(confirmWithdraw).toFixed(2)}`],
                ["Total Expected", `$${(confirmWithdraw.amount + calcEarnings(confirmWithdraw)).toFixed(2)}`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-400">{label}</span>
                  <span className="text-white font-semibold">{value}</span>
                </div>
              ))}
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle size={14} className="text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-yellow-300 text-xs">
                Early withdrawals may be subject to review. Our team will process your request within 24–48 hours.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmWithdraw(null)}
                className="flex-1 py-3 border border-white/10 text-gray-400 rounded-xl text-sm hover:border-white/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => requestWithdraw(confirmWithdraw)}
                disabled={!!withdrawRequesting}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-orange-500 text-white font-bold rounded-xl text-sm hover:bg-orange-600 transition-colors disabled:opacity-60"
              >
                {withdrawRequesting ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <>
                    <ArrowDownCircle size={15} /> Confirm
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}