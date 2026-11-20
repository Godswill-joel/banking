/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useUserData } from "@/lib/hook/useUserData";
import { useFormatPrice } from "@/lib/hook/useFormatPrice";
import { auth, db } from "@/firebase/config";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import {
  addDoc, collection, onSnapshot, orderBy, query,
  serverTimestamp, Timestamp, where,
} from "firebase/firestore";
import {
  Wallet, Eye, EyeOff, Copy, CheckCircle, ArrowUpRight, X, ArrowLeft,
  Landmark, Bitcoin, CircleDollarSign, Gem, CreditCard, Loader2,
  Clock, Lock, ShieldCheck, History, AlertCircle,
} from "lucide-react";

// ─── Config (change these without touching the UI) ─────────────────────────────

const MIN_WITHDRAWAL = 10;        // USD
const PROCESSING_TIME = "24 hours";
const REQUIRE_KYC = false;        // set true once your KYC review flow is live

// ─── Types ─────────────────────────────────────────────────────────────────────

type MethodId = "bank" | "bitcoin" | "ethereum" | "usdt" | "paypal";

interface Field {
  key: string;
  label: string;
  placeholder?: string;
  options?: string[];
  optional?: boolean;
}

interface Method {
  id: MethodId;
  name: string;
  hint: string;
  icon: React.ElementType;
  fields: Field[];
}

interface Withdrawal {
  id: string;
  method: MethodId;
  amount: number;
  status: "pending" | "processing" | "completed" | "rejected";
  createdAt?: Timestamp;
}

const METHODS: Method[] = [
  {
    id: "bank",
    name: "Bank transfer",
    hint: "Direct to your bank account",
    icon: Landmark,
    fields: [
      { key: "bankName", label: "Bank name", placeholder: "e.g. Wellsfargo" },
      { key: "accountName", label: "Account name", placeholder: "Name on the account" },
      { key: "accountNumber", label: "Account number", placeholder: "Account number / IBAN" },
      { key: "swift", label: "SWIFT / routing code", placeholder: "Optional", optional: true },
    ],
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    hint: "BTC wallet address",
    icon: Bitcoin,
    fields: [{ key: "address", label: "Bitcoin address", placeholder: "bc1..." }],
  },
  {
    id: "ethereum",
    name: "Ethereum",
    hint: "ETH wallet address",
    icon: Gem,
    fields: [{ key: "address", label: "Ethereum address", placeholder: "0x..." }],
  },
  {
    id: "usdt",
    name: "USDT",
    hint: "TRC20, ERC20 or BEP20",
    icon: CircleDollarSign,
    fields: [
      { key: "network", label: "Network", options: ["TRC20", "ERC20", "BEP20"] },
      { key: "address", label: "USDT address", placeholder: "Wallet address" },
    ],
  },
  {
    id: "paypal",
    name: "PayPal",
    hint: "Send to your PayPal email",
    icon: CreditCard,
    fields: [{ key: "email", label: "PayPal email", placeholder: "you@example.com" }],
  },
];

const STATUS_PILL: Record<Withdrawal["status"], { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-500/10 text-yellow-400" },
  processing: { label: "Processing", className: "bg-blue-500/10 text-blue-400" },
  completed: { label: "Completed", className: "bg-green-500/10 text-green-400" },
  rejected: { label: "Rejected", className: "bg-red-500/10 text-red-400" },
};

const inputClass =
  "w-full bg-white/[0.04] border border-white/10 text-white placeholder:text-white/20 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#B4925B]/60 focus:bg-white/[0.06] transition-all";
const labelClass = "text-white/50 text-xs tracking-widest uppercase";

// ─── Validation ────────────────────────────────────────────────────────────────

function validateDetails(method: Method, d: Record<string, string>): string {
  for (const f of method.fields) {
    if (!f.optional && !d[f.key]?.trim()) return `Please enter ${f.label.toLowerCase()}.`;
  }
  const addr = d.address?.trim() ?? "";
  if (method.id === "bitcoin" && !/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/.test(addr))
    return "That doesn't look like a valid Bitcoin address.";
  if (method.id === "ethereum" && !/^0x[a-fA-F0-9]{40}$/.test(addr))
    return "That doesn't look like a valid Ethereum address.";
  if (method.id === "usdt") {
    const ok = d.network === "TRC20" ? /^T[a-zA-Z0-9]{33}$/.test(addr) : /^0x[a-fA-F0-9]{40}$/.test(addr);
    if (!ok) return `That doesn't look like a valid ${d.network} address.`;
  }
  if (method.id === "paypal" && !/^\S+@\S+\.\S+$/.test(d.email ?? ""))
    return "Please enter a valid PayPal email.";
  if (method.id === "bank" && !/^[A-Za-z0-9\- ]{6,34}$/.test(d.accountNumber ?? ""))
    return "Please enter a valid account number.";
  return "";
}

// ─── Withdraw Modal ────────────────────────────────────────────────────────────

function WithdrawModal({
  available,
  userName,
  onClose,
}: {
  available: number;
  userName: string;
  onClose: () => void;
}) {
  const { formatUSD } = useFormatPrice();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [method, setMethod] = useState<Method | null>(null);
  const [details, setDetails] = useState<Record<string, string>>({});
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState("");

  const numAmount = parseFloat(amount) || 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !submitting && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [submitting, onClose]);

  const pickMethod = (m: Method) => {
    setMethod(m);
    setDetails(m.id === "usdt" ? { network: "TRC20" } : {});
    setError("");
    setStep(2);
  };

  const goReview = () => {
    if (!method) return;
    if (!numAmount) return setError("Enter the amount you want to withdraw.");
    if (numAmount < MIN_WITHDRAWAL) return setError(`Minimum withdrawal is ${formatUSD(MIN_WITHDRAWAL)}.`);
    if (numAmount > available) return setError("Amount is more than your available balance.");
    const msg = validateDetails(method, details);
    if (msg) return setError(msg);
    setError("");
    setStep(3);
  };

  const submit = async () => {
    const current = auth.currentUser;
    if (!current || !current.email || !method) return setError("Session expired. Please log in again.");
    if (!password) return setError("Enter your password to confirm.");

    setSubmitting(true);
    setError("");
    try {
      // Confirm identity before moving money
      await reauthenticateWithCredential(current, EmailAuthProvider.credential(current.email, password));

      const ref = await addDoc(collection(db, "withdrawals"), {
        userId: current.uid,
        userEmail: current.email,
        userName,
        method: method.id,
        methodName: method.name,
        amount: numAmount,
        details,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setReference(ref.id.slice(0, 8).toUpperCase());
      setStep(4);
    } catch (e: any) {
      const code = e?.code as string | undefined;
      setError(
        code === "auth/wrong-password" || code === "auth/invalid-credential"
          ? "Incorrect password."
          : code === "auth/too-many-requests"
          ? "Too many attempts. Please try again later."
          : "We couldn't place your withdrawal. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const setField = (key: string, value: string) => {
    setDetails((p) => ({ ...p, [key]: value }));
    setError("");
  };

  const summaryRows = method
    ? method.fields.filter((f) => details[f.key]?.trim()).map((f) => ({ label: f.label, value: details[f.key] }))
    : [];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center sm:p-4"
      onClick={() => !submitting && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md bg-[#111111] border border-white/10 rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        {step !== 4 && (
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <div className="flex items-center gap-3">
              {step > 1 && (
                <button
                  onClick={() => { setError(""); setStep((step - 1) as 1 | 2 | 3); }}
                  disabled={submitting}
                  aria-label="Back"
                  className="w-9 h-9 -ml-2 rounded-full text-white/60 hover:bg-white/5 flex items-center justify-center"
                >
                  <ArrowLeft size={18} />
                </button>
              )}
              <div>
                <h2 className="text-white text-lg font-semibold">
                  {step === 1 ? "Withdraw funds" : step === 2 ? method?.name : "Review & confirm"}
                </h2>
                <p className="text-white/40 text-xs">Step {step} of 3</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={submitting}
              aria-label="Close"
              className="w-9 h-9 rounded-full text-white/60 hover:bg-white/5 flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div className="px-6 pb-6 pt-4 space-y-5">
          {/* Step 1: choose method */}
          {step === 1 && (
            <>
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-white/50 text-sm">Available to withdraw</span>
                <span className="text-[#B4925B] font-semibold">{formatUSD(available)}</span>
              </div>
              <p className={labelClass}>Where should we send it?</p>
              <div className="space-y-2">
                {METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => pickMethod(m)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#B4925B]/50 transition-colors text-left"
                  >
                    <span className="w-11 h-11 rounded-full bg-[#B4925B]/10 text-[#B4925B] flex items-center justify-center flex-shrink-0">
                      <m.icon size={20} />
                    </span>
                    <span className="flex-1">
                      <span className="block text-white text-sm font-semibold">{m.name}</span>
                      <span className="block text-white/40 text-xs">{m.hint}</span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 2: details + amount */}
          {step === 2 && method && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className={labelClass}>Amount (USD)</label>
                  <button
                    type="button"
                    onClick={() => { setAmount(available.toFixed(2)); setError(""); }}
                    className="text-[#B4925B] text-xs font-medium hover:text-[#D4B98A]"
                  >
                    Max {formatUSD(available)}
                  </button>
                </div>
                <input
                  type="number"
                  inputMode="decimal"
                  min={MIN_WITHDRAWAL}
                  step="0.01"
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setError(""); }}
                  placeholder="0.00"
                  className={`${inputClass} text-lg`}
                />
                <p className="text-white/30 text-xs">Minimum {formatUSD(MIN_WITHDRAWAL)}</p>
              </div>

              {method.fields.map((f) => (
                <div key={f.key} className="space-y-2">
                  <label className={labelClass}>{f.label}</label>
                  {f.options ? (
                    <select
                      value={details[f.key] ?? f.options[0]}
                      onChange={(e) => setField(f.key, e.target.value)}
                      className={`${inputClass} appearance-none [color-scheme:dark]`}
                    >
                      {f.options.map((o) => (
                        <option key={o} value={o} className="bg-[#111111]">{o}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={details[f.key] ?? ""}
                      onChange={(e) => setField(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      className={inputClass}
                      autoComplete="off"
                    />
                  )}
                </div>
              ))}

              <div className="flex items-start gap-2.5 bg-yellow-500/5 border border-yellow-500/20 rounded-xl px-4 py-3">
                <AlertCircle size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                <p className="text-yellow-400/90 text-xs leading-relaxed">
                  {method.id === "bank" || method.id === "paypal"
                    ? "The account must be in your own name. Payments to third-party accounts may be rejected."
                    : "Double-check your address. Crypto transfers can't be reversed if the address is wrong."}
                </p>
              </div>
            </>
          )}

          {/* Step 3: review + password */}
          {step === 3 && method && (
            <>
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl divide-y divide-white/[0.06]">
                <div className="p-4 flex items-center justify-between">
                  <span className="text-white/50 text-sm">You will receive</span>
                  <span className="text-white text-xl font-semibold">{formatUSD(numAmount)}</span>
                </div>
                <div className="p-4 flex items-center justify-between text-sm">
                  <span className="text-white/50">Method</span>
                  <span className="text-white">{method.name}</span>
                </div>
                {summaryRows.map((r) => (
                  <div key={r.label} className="p-4 flex items-start justify-between gap-4 text-sm">
                    <span className="text-white/50 flex-shrink-0">{r.label}</span>
                    <span className="text-white text-right break-all">{r.value}</span>
                  </div>
                ))}
                <div className="p-4 flex items-center justify-between text-sm">
                  <span className="text-white/50">Fee</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="p-4 flex items-center justify-between text-sm">
                  <span className="text-white/50">Estimated arrival</span>
                  <span className="text-white">Within {PROCESSING_TIME}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Confirm with your password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 4: success */}
          {step === 4 && method && (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center mx-auto">
                <CheckCircle size={32} />
              </div>
              <div>
                <h2 className="text-white text-xl font-semibold">Withdrawal placed</h2>
                <p className="text-white/50 text-sm mt-2 leading-relaxed max-w-xs mx-auto">
                  You will receive <span className="text-white font-medium">{formatUSD(numAmount)}</span> via{" "}
                  {method.name} within {PROCESSING_TIME}.
                </p>
              </div>
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 flex items-center justify-between text-sm">
                <span className="text-white/50">Reference</span>
                <span className="text-white font-mono">{reference}</span>
              </div>
              <button
                onClick={onClose}
                className="w-full py-4 rounded-xl bg-[#B4925B] hover:bg-[#C1A578] text-black text-sm font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          )}

          {/* Error */}
          {error && step !== 4 && (
            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
              <p className="text-red-400 text-sm leading-relaxed">{error}</p>
            </div>
          )}

          {/* Actions */}
          {step === 2 && (
            <button
              onClick={goReview}
              className="w-full py-4 rounded-xl bg-[#B4925B] hover:bg-[#C1A578] text-black text-sm font-semibold transition-colors"
            >
              Review withdrawal
            </button>
          )}
          {step === 3 && (
            <button
              onClick={submit}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#B4925B] hover:bg-[#C1A578] text-black text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <><Loader2 size={16} className="animate-spin" /> Placing withdrawal...</>
              ) : (
                <>Confirm withdrawal</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Wallet Page ───────────────────────────────────────────────────────────────

export default function WalletPage() {
  const { userData, loading, error } = useUserData();
  const { formatUSD } = useFormatPrice();
  const [showBalance, setShowBalance] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [wLoading, setWLoading] = useState(true);
  const user = userData;

  // Live withdrawal history
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) { setWLoading(false); return; }

    const q = query(
      collection(db, "withdrawals"),
      where("userId", "==", uid),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(
      q,
      (snap) => {
        setWithdrawals(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Withdrawal)));
        setWLoading(false);
      },
      () => setWLoading(false)
    );
  }, [user]);

  // Money already requested but not yet paid out is held back from the available balance
  const onHold = useMemo(
    () =>
      withdrawals
        .filter((w) => w.status === "pending" || w.status === "processing")
        .reduce((s, w) => s + w.amount, 0),
    [withdrawals]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white/60 text-sm animate-pulse">Loading wallet...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-red-400 text-xl font-semibold mb-2">Access denied</p>
          <p className="text-white/50 text-sm">{error || "Please log in again."}</p>
        </div>
      </div>
    );
  }

  const available = Math.max(0, (user.balance ?? 0) - onHold);
  const kycBlocked = REQUIRE_KYC && !user.kycVerified;
  const canWithdraw = !kycBlocked && available >= MIN_WITHDRAWAL;

  const copyAddress = () => {
    if (!user.walletAddress) return;
    navigator.clipboard.writeText(user.walletAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const methodName = (id: MethodId) => METHODS.find((m) => m.id === id)?.name ?? id;
  const methodIcon = (id: MethodId) => METHODS.find((m) => m.id === id)?.icon ?? Wallet;

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-4 py-6 md:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-white text-2xl font-semibold">My Wallet</h1>
          <p className="text-white/40 text-sm mt-1">Manage your USD balance and withdrawals</p>
        </header>

        {/* Balance card */}
        <section className="bg-[#B4925B] rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-black/70">
              <Wallet size={18} />
              <span className="text-sm font-medium">Total balance (USD)</span>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              aria-label={showBalance ? "Hide balance" : "Show balance"}
              className="p-2 -mr-2 rounded-full text-black/70 hover:bg-black/10 transition-colors"
            >
              {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          <p className="text-black text-4xl md:text-5xl font-semibold tracking-tight mt-3">
            {showBalance ? formatUSD(user.balance) : "••••••"}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="bg-black/10 rounded-2xl p-4">
              <p className="text-black/60 text-xs">Available</p>
              <p className="text-black font-semibold mt-0.5">{showBalance ? formatUSD(available) : "••••"}</p>
            </div>
            <div className="bg-black/10 rounded-2xl p-4">
              <p className="text-black/60 text-xs">Pending withdrawals</p>
              <p className="text-black font-semibold mt-0.5">{showBalance ? formatUSD(onHold) : "••••"}</p>
            </div>
          </div>

          <button
            onClick={() => setShowWithdraw(true)}
            disabled={!canWithdraw}
            className="mt-6 w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-black text-white text-sm font-semibold hover:bg-black/85 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowUpRight size={18} />
            Withdraw
          </button>

          {!canWithdraw && (
            <p className="text-black/70 text-xs text-center mt-3">
              {kycBlocked
                ? "Complete identity verification to withdraw."
                : `You need at least ${formatUSD(MIN_WITHDRAWAL)} available to withdraw.`}
            </p>
          )}
        </section>

        {/* Wallet ID */}
        <section className="bg-[#111111] border border-white/[0.08] rounded-3xl p-5">
          <p className={labelClass}>Wallet ID</p>
          <div className="flex items-center justify-between gap-3 mt-3">
            <p className="text-white font-mono text-sm truncate">
              {user.walletAddress || "No wallet ID found"}
            </p>
            <button
              onClick={copyAddress}
              aria-label="Copy wallet ID"
              className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 text-white/60 hover:text-[#B4925B] flex items-center justify-center flex-shrink-0 transition-colors"
            >
              {copiedAddress ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} />}
            </button>
          </div>
        </section>

        {/* Withdrawal history */}
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <History size={16} className="text-white/40" />
            <h2 className="text-white font-semibold">Withdrawal history</h2>
          </div>

          {wLoading && (
            <div className="bg-[#111111] border border-white/[0.08] rounded-3xl divide-y divide-white/[0.06]">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                  <div className="w-11 h-11 rounded-full bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <div className="w-28 h-3 bg-white/10 rounded" />
                    <div className="w-20 h-2.5 bg-white/10 rounded" />
                  </div>
                  <div className="w-14 h-3 bg-white/10 rounded" />
                </div>
              ))}
            </div>
          )}

          {!wLoading && withdrawals.length === 0 && (
            <div className="bg-[#111111] border border-white/[0.08] rounded-3xl p-10 text-center">
              <div className="w-12 h-12 rounded-full bg-white/[0.05] flex items-center justify-center mx-auto mb-4">
                <Clock size={20} className="text-white/30" />
              </div>
              <p className="text-white font-semibold text-sm">No withdrawals yet</p>
              <p className="text-white/40 text-xs mt-1">Your withdrawal requests will show up here.</p>
            </div>
          )}

          {!wLoading && withdrawals.length > 0 && (
            <div className="bg-[#111111] border border-white/[0.08] rounded-3xl overflow-hidden divide-y divide-white/[0.06]">
              {withdrawals.slice(0, 8).map((w) => {
                const Icon = methodIcon(w.method);
                const pill = STATUS_PILL[w.status] ?? STATUS_PILL.pending;
                return (
                  <div key={w.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-11 h-11 rounded-full bg-[#B4925B]/10 text-[#B4925B] flex items-center justify-center flex-shrink-0">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{methodName(w.method)}</p>
                      <p className="text-white/40 text-xs mt-0.5">
                        {w.createdAt?.toDate().toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) ?? "Just now"}
                        {" · "}
                        <span className="font-mono">{w.id.slice(0, 8).toUpperCase()}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-sm font-semibold">-{formatUSD(w.amount)}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${pill.className}`}>
                        {pill.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Trust note */}
        <div className="flex items-center justify-center gap-2 text-white/30 text-xs pb-4">
          <ShieldCheck size={14} />
          Withdrawals are protected by password confirmation and reviewed before payout.
        </div>
      </div>

      {showWithdraw && (
        <WithdrawModal
          available={available}
          userName={`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()}
          onClose={() => setShowWithdraw(false)}
        />
      )}
    </div>
  );
}