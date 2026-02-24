"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  doc, getDoc, updateDoc, addDoc, collection,
  serverTimestamp, Timestamp, query, where, getDocs,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import {
  ArrowLeft, CheckCircle, XCircle, ArrowDownCircle, Clock, Shield,
  TrendingUp, Award, Wallet, User, Bell, AlertCircle, BadgeCheck,
  Loader2, FileText, Phone, Mail, MapPin, Hash,
  CircleCheck, Ban, Send, Save, TrendingDown, Calendar,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Investment {
  id: string;
  planId: string;
  planName: string;
  amount: number;
  roi: number;
  duration: string;
  durationDays: number;
  payoutFrequency: string;
  cryptoChoice: string;
  walletAddress: string;
  status: "pending" | "active" | "completed" | "cancelled" | "withdraw_requested";
  createdAt: Timestamp;
  confirmedAt?: Timestamp;
  completedAt?: Timestamp;
  userFullName: string;
  userEmail: string;
  userPhone?: string;
  userCountry?: string;
  userId: string;
  txHash?: string;
  hasScreenshot?: boolean;
  adminNote?: string;
}

interface WithdrawRequest {
  id: string;
  amount: number;
  earnings: number;
  totalExpected: number;
  status: string;
  createdAt: Timestamp;
}

// ─── Meta ───────────────────────────────────────────────────────────────────────

const PLAN_META: Record<string, { icon: React.ElementType; color: string; gradient: string; light: string }> = {
  starter: { icon: Shield,    color: "text-emerald-600", gradient: "from-emerald-500 to-green-600",   light: "bg-emerald-50 border-emerald-200" },
  growth:  { icon: TrendingUp, color: "text-blue-600",  gradient: "from-blue-500 to-cyan-600",        light: "bg-blue-50 border-blue-200"       },
  premium: { icon: Award,     color: "text-purple-600", gradient: "from-purple-500 to-pink-600",      light: "bg-purple-50 border-purple-200"   },
};

const STATUS_META: Record<string, { label: string; badge: string; icon: React.ElementType }> = {
  pending:            { label: "Pending",           badge: "bg-amber-100 text-amber-700 border-amber-200",      icon: Clock          },
  active:             { label: "Active",            badge: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle    },
  completed:          { label: "Completed",         badge: "bg-sky-100 text-sky-700 border-sky-200",            icon: BadgeCheck     },
  cancelled:          { label: "Cancelled",         badge: "bg-red-100 text-red-700 border-red-200",            icon: XCircle        },
  withdraw_requested: { label: "Withdraw Requested",badge: "bg-orange-100 text-orange-700 border-orange-200",   icon: ArrowDownCircle },
};

const DURATION_DAYS: Record<string, number> = { starter: 30, growth: 60, premium: 90 };
const PAYOUT_INTERVAL: Record<string, number> = { Weekly: 7, Monthly: 30, Annual: 365 };

// ─── Helpers ───────────────────────────────────────────────────────────────────

function calcEarnings(inv: Investment): number {
  if (inv.status === "pending" || inv.status === "cancelled") return 0;
  const start = inv.confirmedAt?.toDate() ?? inv.createdAt.toDate();
  const end   = inv.completedAt?.toDate() ?? new Date();
  const days  = Math.max(0, (end.getTime() - start.getTime()) / 86400000);
  const capped = Math.min(days, inv.durationDays ?? DURATION_DAYS[inv.planId] ?? 30);
  return parseFloat((inv.amount * (inv.roi / 100 / 30) * capped).toFixed(4));
}

function calcProgress(inv: Investment): number {
  if (inv.status === "pending" || inv.status === "cancelled") return 0;
  const start = inv.confirmedAt?.toDate() ?? inv.createdAt.toDate();
  const total = (inv.durationDays ?? DURATION_DAYS[inv.planId] ?? 30) * 86400000;
  const elapsed = Math.min(new Date().getTime() - start.getTime(), total);
  return Math.min(100, Math.round((elapsed / total) * 100));
}

function nextPayoutDate(inv: Investment): Date | null {
  if (inv.status !== "active") return null;
  const start    = inv.confirmedAt?.toDate() ?? inv.createdAt.toDate();
  const interval = (PAYOUT_INTERVAL[inv.payoutFrequency] ?? 30) * 86400000;
  const now      = Date.now();
  let next       = start.getTime() + interval;
  while (next < now) next += interval;
  return new Date(next);
}

function fmtFull(ts?: Timestamp) {
  if (!ts) return "—";
  return ts.toDate().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function fmtShort(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function addDays(d: Date, n: number) {
  const r = new Date(d); r.setDate(r.getDate() + n); return r;
}

// ─── Confirm Modal ─────────────────────────────────────────────────────────────

function Modal({ open, title, body, confirmLabel, variant = "red", onConfirm, onCancel, loading, children }: {
  open: boolean; title: string; body: string; confirmLabel: string;
  variant?: "red" | "green" | "amber" | "blue";
  onConfirm: () => void; onCancel: () => void; loading?: boolean; children?: React.ReactNode;
}) {
  if (!open) return null;
  const btn = { red: "bg-red-500 hover:bg-red-600 text-white", green: "bg-emerald-500 hover:bg-emerald-600 text-white", amber: "bg-amber-500 hover:bg-amber-600 text-white", blue: "bg-sky-500 hover:bg-sky-600 text-white" }[variant];
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
        <h3 className="text-gray-900 font-bold text-lg">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
        {children}
        <div className="flex gap-3 pt-1">
          <button onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-60 ${btn}`}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Info Row ──────────────────────────────────────────────────────────────────

function InfoRow({ icon: Icon, label, value, mono }: { icon: React.ElementType; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <Icon size={15} className="text-gray-400 flex-shrink-0 mt-0.5" />
      <span className="text-gray-400 text-sm w-28 flex-shrink-0">{label}</span>
      <span className={`text-gray-800 text-sm font-medium flex-1 break-all ${mono ? "font-mono text-xs" : ""}`}>{value || "—"}</span>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function AdminInvestmentDetailPage() {
  const { id } = useParams() as { id: string };
  const router  = useRouter();

  const [inv, setInv]                 = useState<Investment | null>(null);
  const [withdrawReq, setWithdrawReq] = useState<WithdrawRequest | null>(null);
  const [loading, setLoading]         = useState(true);
  const [busy, setBusy]               = useState<string | null>(null);
  const [toast, setToast]             = useState<string | null>(null);
  const [modal, setModal]             = useState<string | null>(null);
  const [liveEarnings, setLiveEarnings] = useState(0);
  const [notifTitle, setNotifTitle]   = useState("");
  const [notifBody, setNotifBody]     = useState("");
  const [notifSent, setNotifSent]     = useState(false);
  const [adminNote, setAdminNote]     = useState("");
  const [noteSaved, setNoteSaved]     = useState(false);
  const [noteSaving, setNoteSaving]   = useState(false);

  // ─── Fetch ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, "investments", id)).then((snap) => {
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() } as Investment;
        setInv(data);
        setAdminNote(data.adminNote ?? "");
        setLiveEarnings(calcEarnings(data));
      }
      setLoading(false);
    });
    getDocs(query(collection(db, "withdraw_requests"), where("investmentId", "==", id))).then((snap) => {
      if (!snap.empty) setWithdrawReq({ id: snap.docs[0].id, ...snap.docs[0].data() } as WithdrawRequest);
    });
  }, [id]);

  // ─── Live earnings ticker (updates every hour) ─────────────────────────────
  useEffect(() => {
    if (!inv || inv.status !== "active") return;
    const tick = () => setLiveEarnings(calcEarnings(inv));
    const interval = setInterval(tick, 3600000); // every 1 hour
    return () => clearInterval(interval);
  }, [inv]);

  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 4000); }

  async function act(key: string, fn: () => Promise<void>) {
    setBusy(key);
    try { await fn(); } finally { setBusy(null); setModal(null); }
  }

  async function updateStatus(status: Investment["status"], extra: Record<string, unknown> = {}) {
    if (!inv) return;
    await updateDoc(doc(db, "investments", inv.id), { status, ...extra, updatedAt: serverTimestamp() });
    setInv((p) => p ? { ...p, status, ...extra } : p);
  }

  async function notify(title: string, body: string) {
    if (!inv) return;
    await addDoc(collection(db, "notifications"), { userId: inv.userId, title, body, read: false, createdAt: serverTimestamp() });
  }

  // ─── Actions ────────────────────────────────────────────────────────────────

  const approve = () => act("approve", async () => {
    await updateStatus("active", { confirmedAt: serverTimestamp() });
    await notify("Investment Confirmed ✅", `Your ${inv!.planName} investment of $${inv!.amount.toLocaleString()} is now active.`);
    flash("Investment approved and user notified.");
  });

  const reject = () => act("reject", async () => {
    await updateStatus("cancelled");
    await notify("Investment Rejected ❌", `Your ${inv!.planName} investment was not confirmed. Please contact support.`);
    flash("Investment rejected.");
  });

  const complete = () => act("complete", async () => {
    await updateStatus("completed", { completedAt: serverTimestamp() });
    await notify("Investment Completed 🎉", `Your ${inv!.planName} investment has matured. Total return: $${(inv!.amount + liveEarnings).toFixed(2)}.`);
    flash("Investment marked as completed.");
  });

  const acceptWithdraw = () => act("accept_w", async () => {
    await updateStatus("completed", { completedAt: serverTimestamp() });
    if (withdrawReq) await updateDoc(doc(db, "withdraw_requests", withdrawReq.id), { status: "approved", resolvedAt: serverTimestamp() });
    await notify("Withdrawal Approved 💰", `Your withdrawal of $${inv!.amount.toLocaleString()} has been approved. Funds processing shortly.`);
    flash("Withdrawal accepted.");
  });

  const rejectWithdraw = () => act("reject_w", async () => {
    await updateStatus("active");
    if (withdrawReq) await updateDoc(doc(db, "withdraw_requests", withdrawReq.id), { status: "rejected", resolvedAt: serverTimestamp() });
    await notify("Withdrawal Rejected", "Your withdrawal request was rejected. Investment remains active. Contact support for details.");
    flash("Withdrawal rejected, investment restored to active.");
  });

  async function sendNotif() {
    if (!notifTitle || !notifBody) return;
    await notify(notifTitle, notifBody);
    setNotifTitle(""); setNotifBody(""); setNotifSent(true);
    setTimeout(() => setNotifSent(false), 3000);
  }

  async function saveNote() {
    if (!inv) return;
    setNoteSaving(true);
    await updateDoc(doc(db, "investments", inv.id), { adminNote, updatedAt: serverTimestamp() });
    setNoteSaving(false); setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 3000);
  }

  // ─── Loading / Not found ───────────────────────────────────────────────────

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!inv) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center space-y-3">
      <div><AlertCircle size={40} className="text-gray-300 mx-auto mb-3" />
      <p className="text-gray-500">Investment not found.</p>
      <button onClick={() => router.back()} className="text-amber-600 text-sm hover:underline mt-2 block">Go back</button></div>
    </div>
  );

  const meta   = PLAN_META[inv.planId] ?? PLAN_META.starter;
  const status = STATUS_META[inv.status] ?? STATUS_META.pending;
  const Icon   = meta.icon;
  const StIcon = status.icon;
  const progress   = calcProgress(inv);
  const totalDays  = inv.durationDays ?? DURATION_DAYS[inv.planId] ?? 30;
  const startDate  = inv.confirmedAt?.toDate() ?? inv.createdAt.toDate();
  const endDate    = addDays(startDate, totalDays);
  const nextPayout = nextPayoutDate(inv);
  const totalReturn = inv.amount + liveEarnings;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Back */}
        <button onClick={() => router.push("/panel/loan")}
          className="flex items-center gap-2 text-gray-400 hover:text-amber-600 transition-colors text-sm font-medium">
          <ArrowLeft size={15} /> Back to Investments
        </button>

        {/* Toast */}
        {toast && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-700 text-sm shadow-sm">
            <CheckCircle size={16} /> {toast}
          </div>
        )}

        {/* Hero */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className={`h-1.5 w-full bg-gradient-to-r ${meta.gradient}`} />
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-md flex-shrink-0`}>
                  <Icon className="text-white" size={28} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{inv.planName}</h1>
                  <p className="text-gray-400 text-xs mt-0.5 font-mono">{inv.id}</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${status.badge}`}>
                <StIcon size={14} /> {status.label}
              </span>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Invested",      value: `$${inv.amount.toLocaleString()}`,  highlight: false },
                { label: "Monthly ROI",   value: `${inv.roi}%`,                       highlight: false },
                { label: "Duration",      value: inv.duration,                        highlight: false },
                { label: "Payout Freq.",  value: inv.payoutFrequency,                 highlight: false },
                { label: "Earnings So Far", value: `$${liveEarnings.toFixed(4)}`,    highlight: true  },
                { label: "Total Return",  value: `$${totalReturn.toFixed(2)}`,        highlight: true  },
                { label: "Network",       value: inv.cryptoChoice?.replace("_", " "),highlight: false },
                { label: "Maturity",      value: fmtShort(endDate),                  highlight: false },
              ].map(({ label, value, highlight }) => (
                <div key={label} className={`rounded-xl p-3.5 border ${highlight ? `${meta.light}` : "bg-gray-50 border-gray-100"}`}>
                  <p className="text-gray-400 text-xs mb-1">{label}</p>
                  <p className={`font-bold text-sm ${highlight ? meta.color : "text-gray-800"}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            {(inv.status === "active" || inv.status === "completed") && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Progress: {progress}% of {totalDays}-day plan</span>
                  {nextPayout && <span className="flex items-center gap-1"><Calendar size={11} /> Next payout: {fmtShort(nextPayout)}</span>}
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${meta.gradient} transition-all duration-1000`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{fmtShort(startDate)}</span>
                  <span>{fmtShort(endDate)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Investor Info */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-gray-900 font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <User size={15} className="text-amber-500" /> Investor Info
            </h2>
            <InfoRow icon={User}   label="Full Name" value={inv.userFullName} />
            <InfoRow icon={Mail}   label="Email"     value={inv.userEmail} />
            <InfoRow icon={Phone}  label="Phone"     value={inv.userPhone ?? ""} />
            <InfoRow icon={MapPin} label="Country"   value={inv.userCountry ?? ""} />
          </div>

          {/* Payment Proof */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-gray-900 font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText size={15} className="text-amber-500" /> Payment Proof
            </h2>
            <InfoRow icon={Hash}   label="TX Hash"   value={inv.txHash ?? "Not provided"} mono />
            <InfoRow icon={Wallet} label="Address"   value={inv.walletAddress ?? ""} mono />
            <InfoRow icon={FileText} label="Screenshot" value={inv.hasScreenshot ? "Uploaded ✓" : "Not uploaded"} />
            <div className="mt-4 pt-4 border-t border-gray-50 space-y-2">
              <div className="flex justify-between text-xs"><span className="text-gray-400">Submitted</span><span className="text-gray-600">{fmtFull(inv.createdAt)}</span></div>
              {inv.confirmedAt && <div className="flex justify-between text-xs"><span className="text-gray-400">Confirmed</span><span className="text-emerald-600 font-medium">{fmtFull(inv.confirmedAt)}</span></div>}
              {inv.completedAt && <div className="flex justify-between text-xs"><span className="text-gray-400">Completed</span><span className="text-sky-600 font-medium">{fmtFull(inv.completedAt)}</span></div>}
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="text-gray-900 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
            <BadgeCheck size={15} className="text-amber-500" /> Admin Actions
          </h2>

          <div className="flex flex-wrap gap-3">
            {inv.status === "pending" && (<>
              <button onClick={() => setModal("approve")} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 rounded-xl text-sm font-semibold transition-colors">
                <CircleCheck size={15} /> Approve & Confirm Payment
              </button>
              <button onClick={() => setModal("reject")} className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 rounded-xl text-sm font-semibold transition-colors">
                <Ban size={15} /> Reject Investment
              </button>
            </>)}

            {inv.status === "active" && (
              <button onClick={() => setModal("complete")} className="flex items-center gap-2 px-4 py-2.5 bg-sky-50 border border-sky-200 text-sky-700 hover:bg-sky-100 rounded-xl text-sm font-semibold transition-colors">
                <BadgeCheck size={15} /> Mark as Completed
              </button>
            )}

            {inv.status === "withdraw_requested" && (<>
              <button onClick={() => setModal("accept_w")} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 rounded-xl text-sm font-semibold transition-colors">
                <CheckCircle size={15} /> Accept Withdrawal
              </button>
              <button onClick={() => setModal("reject_w")} className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 rounded-xl text-sm font-semibold transition-colors">
                <XCircle size={15} /> Reject Withdrawal
              </button>
            </>)}

            {(inv.status === "active" || inv.status === "pending") && (
              <button onClick={() => setModal("reject")} className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-500 hover:bg-gray-100 rounded-xl text-sm font-semibold transition-colors">
                <TrendingDown size={15} /> Cancel Investment
              </button>
            )}
          </div>

          {/* Withdraw request details */}
          {withdrawReq && inv.status === "withdraw_requested" && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-2">
              <p className="text-orange-700 font-semibold text-sm flex items-center gap-2"><ArrowDownCircle size={14} /> Withdrawal Request</p>
              {[
                ["Principal",      `$${withdrawReq.amount?.toLocaleString()}`],
                ["Earnings",       `$${withdrawReq.earnings?.toFixed(2)}`],
                ["Total Expected", `$${withdrawReq.totalExpected?.toFixed(2)}`],
                ["Requested",      fmtFull(withdrawReq.createdAt)],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between text-sm">
                  <span className="text-orange-500">{l}</span>
                  <span className="text-orange-800 font-semibold">{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Send Notification */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-gray-900 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
            <Bell size={15} className="text-amber-500" /> Send Notification to User
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1.5 block">Title</label>
              <input value={notifTitle} onChange={(e) => setNotifTitle(e.target.value)}
                placeholder="e.g. Your payout has been processed"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:border-amber-400 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1.5 block">Message</label>
              <input value={notifBody} onChange={(e) => setNotifBody(e.target.value)}
                placeholder="Write your message..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:border-amber-400 transition-colors" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            {notifSent && <span className="flex items-center gap-2 text-emerald-600 text-sm"><CheckCircle size={14} /> Notification sent!</span>}
            <button onClick={sendNotif} disabled={!notifTitle || !notifBody}
              className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-40">
              <Send size={14} /> Send Notification
            </button>
          </div>
        </div>

        {/* Admin Note */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-gray-900 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
            <FileText size={15} className="text-amber-500" /> Admin Note
            <span className="text-gray-300 text-xs font-normal normal-case tracking-normal">(internal only)</span>
          </h2>
          <textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)}
            placeholder="Add an internal note about this investment — never shown to the user..."
            rows={3}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none" />
          <div className="flex items-center justify-between">
            {noteSaved && <span className="flex items-center gap-2 text-emerald-600 text-sm"><CheckCircle size={14} /> Note saved!</span>}
            <button onClick={saveNote} disabled={noteSaving}
              className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors disabled:opacity-60">
              {noteSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save Note
            </button>
          </div>
        </div>

      </div>

      {/* Modals */}
      <Modal open={modal === "approve"} title="Approve Investment"
        body={`Confirm payment received and activate this ${inv.planName} investment of $${inv.amount.toLocaleString()}. The investor will be notified immediately.`}
        confirmLabel="Approve & Activate" variant="green" onConfirm={approve} onCancel={() => setModal(null)} loading={busy === "approve"} />

      <Modal open={modal === "reject"} title="Reject / Cancel Investment"
        body="This will cancel the investment and notify the user. This action cannot be undone."
        confirmLabel="Reject" variant="red" onConfirm={reject} onCancel={() => setModal(null)} loading={busy === "reject"} />

      <Modal open={modal === "complete"} title="Mark as Completed"
        body={`Mark this investment as matured. The investor will be notified with a total return of $${totalReturn.toFixed(2)}.`}
        confirmLabel="Mark Completed" variant="amber" onConfirm={complete} onCancel={() => setModal(null)} loading={busy === "complete"} />

      <Modal open={modal === "accept_w"} title="Accept Withdrawal"
        body={`Approve this withdrawal. Ensure you process a payout of $${totalReturn.toFixed(2)} to the investor before confirming.`}
        confirmLabel="Accept" variant="green" onConfirm={acceptWithdraw} onCancel={() => setModal(null)} loading={busy === "accept_w"} />

      <Modal open={modal === "reject_w"} title="Reject Withdrawal"
        body="Reject this withdrawal request and restore the investment to active. The investor will be notified."
        confirmLabel="Reject" variant="red" onConfirm={rejectWithdraw} onCancel={() => setModal(null)} loading={busy === "reject_w"} />
    </div>
  );
}