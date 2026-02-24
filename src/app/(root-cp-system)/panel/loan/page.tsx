"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  collection, query, orderBy, onSnapshot,
  doc, getDoc, setDoc, serverTimestamp, Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import {
  Search, Shield, TrendingUp, Award, Clock, CheckCircle, XCircle,
  ArrowDownCircle, ChevronRight, Wallet, Copy, Save, AlertCircle,
  RefreshCw, Bitcoin, ChevronUp, ChevronDown, ChevronsUpDown,
  ArrowLeft, ArrowRight,
} from "lucide-react";


interface Investment {
  id: string;
  planId: string;
  planName: string;
  amount: number;
  roi: number;
  duration: string;
  payoutFrequency: string;
  cryptoChoice: string;
  status: "pending" | "active" | "completed" | "cancelled" | "withdraw_requested";
  createdAt: Timestamp;
  confirmedAt?: Timestamp;
  userFullName: string;
  userEmail: string;
}

type SortKey = "createdAt" | "amount" | "status" | "planId";
type SortDir = "asc" | "desc";

const PLAN_META: Record<string, { icon: React.ElementType; color: string }> = {
  starter: { icon: Shield, color: "text-emerald-600" },
  growth: { icon: TrendingUp, color: "text-blue-600" },
  premium: { icon: Award, color: "text-purple-600" },
};

const STATUS_META: Record<string, { label: string; row: string; badge: string; dot: string; icon: React.ElementType }> = {
  pending: { label: "Pending", row: "bg-amber-50/60 hover:bg-amber-100/70", badge: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-400", icon: Clock },
  active: { label: "Active", row: "bg-emerald-50/60 hover:bg-emerald-100/70", badge: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500", icon: CheckCircle },
  completed: { label: "Completed", row: "bg-sky-50/60 hover:bg-sky-100/70", badge: "bg-sky-100 text-sky-700 border-sky-200", dot: "bg-sky-500", icon: CheckCircle },
  cancelled: { label: "Cancelled", row: "bg-red-50/60 hover:bg-red-100/70", badge: "bg-red-100 text-red-700 border-red-200", dot: "bg-red-400", icon: XCircle },
  withdraw_requested: { label: "Withdraw Req.", row: "bg-orange-50/60 hover:bg-orange-100/70", badge: "bg-orange-100 text-orange-700 border-orange-200", dot: "bg-orange-500", icon: ArrowDownCircle },
};

const STATUS_OPTIONS = ["all", "pending", "active", "completed", "cancelled", "withdraw_requested"];
const PLAN_OPTIONS = ["all", "starter", "growth", "premium"];
const PAGE_SIZE = 10;

function formatDate(ts?: Timestamp) {
  if (!ts) return "—";
  return ts.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_META[status] ?? STATUS_META.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${s.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
      {s.label}
    </span>
  );
}

function SortBtn({ col, sortKey, sortDir, onClick, children }: {
  col: SortKey; sortKey: SortKey; sortDir: SortDir; onClick: () => void; children: React.ReactNode;
}) {
  const active = col === sortKey;
  return (
    <button onClick={onClick} className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-800 transition-colors">
      {children}
      {active
        ? (sortDir === "asc" ? <ChevronUp size={12} className="text-amber-500" /> : <ChevronDown size={12} className="text-amber-500" />)
        : <ChevronsUpDown size={12} className="text-gray-300" />}
    </button>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function AdminInvestmentsPage() {
  const router = useRouter();

  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [showWallets, setShowWallets] = useState(false);
  const [wallets, setWallets] = useState({ BTC: "", USDT_TRC20: "", USDT_ERC20: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "investments"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setInvestments(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Investment)));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    getDoc(doc(db, "settings", "wallets")).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setWallets({ BTC: d.BTC ?? "", USDT_TRC20: d.USDT_TRC20 ?? "", USDT_ERC20: d.USDT_ERC20 ?? "" });
      }
    });
  }, []);

  async function saveWallets() {
    setSaving(true);
    await setDoc(doc(db, "settings", "wallets"), { ...wallets, updatedAt: serverTimestamp() });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function copyWallet(key: string, val: string) {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
    setPage(1);
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const list = investments.filter((inv) => {
      const ms = !search || inv.userFullName?.toLowerCase().includes(q) || inv.userEmail?.toLowerCase().includes(q);
      const mst = statusFilter === "all" || inv.status === statusFilter;
      const mp = planFilter === "all" || inv.planId === planFilter;
      return ms && mst && mp;
    });
    return [...list].sort((a, b) => {
      let av: number | string = 0, bv: number | string = 0;
      if (sortKey === "createdAt") { av = a.createdAt?.seconds ?? 0; bv = b.createdAt?.seconds ?? 0; }
      if (sortKey === "amount") { av = a.amount; bv = b.amount; }
      if (sortKey === "status") { av = a.status; bv = b.status; }
      if (sortKey === "planId") { av = a.planId; bv = b.planId; }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [investments, search, statusFilter, planFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = {
    total: investments.length,
    pending: investments.filter((i) => i.status === "pending").length,
    active: investments.filter((i) => i.status === "active").length,
    withdraw: investments.filter((i) => i.status === "withdraw_requested").length,
    volume: investments.filter((i) => i.status === "active").reduce((s, i) => s + i.amount, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Investment Management</h1>
            <p className="text-gray-500 text-sm mt-0.5">Review, approve, and manage all user investments.</p>
          </div>
          <button
            onClick={() => setShowWallets((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border shadow-sm transition-all ${showWallets ? "bg-amber-50 border-amber-300 text-amber-700" : "bg-white border-gray-200 text-gray-600 hover:border-amber-300 hover:text-amber-700"
              }`}
          >
            <Wallet size={15} /> Wallet Addresses
          </button>
        </div>

        {/* Wallet panel */}
        {showWallets && (
          <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <Bitcoin size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="text-gray-900 font-semibold text-sm">
                  Payment Wallet Addresses
                </p>
                <p className="text-gray-400 text-xs">
                  These addresses are stored in <span className="font-medium">settings / wallets</span>
                </p>
              </div>
            </div>

            {/* Wallet Inputs */}
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { key: "BTC", label: "Bitcoin (BTC)", placeholder: "bc1q..." },
                { key: "USDT_TRC20", label: "USDT – TRC20", placeholder: "TRx..." },
                { key: "USDT_ERC20", label: "USDT – ERC20", placeholder: "0x..." },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                    {label}
                  </label>

                  <div className="flex gap-2">
                    <input
                      value={wallets[key as keyof typeof wallets]}
                      onChange={(e) =>
                        setWallets((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      placeholder={placeholder}
                      className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 text-xs font-mono focus:outline-none focus:border-amber-400 transition-colors"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        copyWallet(
                          key,
                          wallets[key as keyof typeof wallets]
                        )
                      }
                      className="flex-shrink-0 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {copied === key ? (
                        <CheckCircle size={14} className="text-emerald-500" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Changes apply immediately to new investments.
              </p>

              <button
                onClick={saveWallets}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60"
              >
                {saving ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : saved ? (
                  <>
                    <CheckCircle size={14} /> Saved
                  </>
                ) : (
                  <>
                    <Save size={14} /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Total", val: stats.total, color: "text-gray-800", bg: "bg-white border-gray-200" },
            { label: "Pending", val: stats.pending, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
            { label: "Active", val: stats.active, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
            { label: "Withdrawals", val: stats.withdraw, color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
            { label: "Active Vol.", val: `$${stats.volume.toLocaleString()}`, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
          ].map(({ label, val, color, bg }) => (
            <div key={label} className={`border rounded-2xl p-4 shadow-sm ${bg}`}>
              <p className="text-xs text-gray-400 font-medium">{label}</p>
              <p className={`text-xl font-bold mt-1 ${color}`}>{val}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search name or email..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-2 text-sm text-gray-700 focus:outline-none focus:border-amber-400 transition-colors placeholder:text-gray-400"
            />
          </div>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-amber-400 transition-colors">
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s === "all" ? "All Statuses" : STATUS_META[s]?.label ?? s}</option>)}
          </select>
          <select value={planFilter} onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-amber-400 transition-colors">
            {PLAN_OPTIONS.map((p) => <option key={p} value={p}>{p === "all" ? "All Plans" : `${p.charAt(0).toUpperCase() + p.slice(1)} Plan`}</option>)}
          </select>
          <span className="text-xs text-gray-400 ml-auto">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          {/* Desktop header */}
          <div className="hidden md:grid grid-cols-[1.8fr_1.3fr_110px_110px_90px_130px_48px] gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Investor</span>
            <SortBtn col="planId" sortKey={sortKey} sortDir={sortDir} onClick={() => handleSort("planId")}>Plan</SortBtn>
            <SortBtn col="amount" sortKey={sortKey} sortDir={sortDir} onClick={() => handleSort("amount")}>Amount</SortBtn>
            <SortBtn col="createdAt" sortKey={sortKey} sortDir={sortDir} onClick={() => handleSort("createdAt")}>Date</SortBtn>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Payout</span>
            <SortBtn col="status" sortKey={sortKey} sortDir={sortDir} onClick={() => handleSort("status")}>Status</SortBtn>
            <span />
          </div>

          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="w-7 h-7 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && paginated.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
              <AlertCircle size={32} className="text-gray-200" />
              <p className="text-gray-400 text-sm">No investments match your filters.</p>
            </div>
          )}

          {!loading && paginated.map((inv, idx) => {
            const plan = PLAN_META[inv.planId] ?? PLAN_META.starter;
            const status = STATUS_META[inv.status] ?? STATUS_META.pending;
            const PlanIcon = plan.icon;

            return (
              <div
                key={inv.id}
                onClick={() => router.push(`/panel/loan/${inv.id}`)}
                className={`cursor-pointer border-b border-gray-100 transition-colors ${status.row} ${idx === paginated.length - 1 ? "border-b-0" : ""}`}
              >
                {/* Desktop row */}
                <div className="hidden md:grid grid-cols-[1.8fr_1.3fr_110px_110px_90px_130px_48px] gap-3 px-5 py-3.5 items-center">
                  <div className="min-w-0">
                    <p className="text-gray-900 text-sm font-semibold truncate">{inv.userFullName || "—"}</p>
                    <p className="text-gray-400 text-xs truncate">{inv.userEmail}</p>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <PlanIcon size={14} className={plan.color} />
                    <span className="text-gray-700 text-sm font-medium truncate">{inv.planName}</span>
                  </div>
                  <p className="text-gray-900 text-sm font-bold">${inv.amount.toLocaleString()}</p>
                  <p className="text-gray-500 text-xs">{formatDate(inv.createdAt)}</p>
                  <p className="text-gray-500 text-xs">{inv.payoutFrequency}</p>
                  <StatusBadge status={inv.status} />
                  <div className="flex justify-end">
                    <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-amber-600 hover:border-amber-300 transition-colors shadow-sm">
                      <ChevronRight size={15} />
                    </span>
                  </div>
                </div>

                {/* Mobile row */}
                <div className="md:hidden flex items-center justify-between gap-3 px-4 py-3.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <PlanIcon size={16} className={plan.color} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-gray-900 text-sm font-semibold truncate">{inv.userFullName || "—"}</p>
                      <p className="text-gray-400 text-xs">${inv.amount.toLocaleString()} · {inv.planName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={inv.status} />
                    <ChevronRight size={15} className="text-gray-400" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-gray-400">
              {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} investments
            </p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-amber-300 hover:text-amber-600 disabled:opacity-40 shadow-sm transition-colors">
                <ArrowLeft size={15} />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let p = i + 1;
                if (totalPages > 5) {
                  if (page <= 3) p = i + 1;
                  else if (page >= totalPages - 2) p = totalPages - 4 + i;
                  else p = page - 2 + i;
                }
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl border text-sm font-semibold shadow-sm transition-colors ${page === p ? "bg-amber-500 border-amber-500 text-white" : "bg-white border-gray-200 text-gray-600 hover:border-amber-300 hover:text-amber-600"
                      }`}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-amber-300 hover:text-amber-600 disabled:opacity-40 shadow-sm transition-colors">
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}