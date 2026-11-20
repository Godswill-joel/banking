"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import {
    addDoc, collection, deleteDoc, doc, getCountFromServer, getDocs,
    onSnapshot, query, serverTimestamp, Timestamp, updateDoc, where,
} from "firebase/firestore";
import {
    Users, DollarSign, AlertCircle, UserPlus, Landmark, CreditCard, Bitcoin, Gem,
    Plus, Pencil, Trash2, Copy, CheckCircle, X, Loader2, TriangleAlert, Power,
    ArrowUpRight,
} from "lucide-react";
import { BitcoinLoadingScreen } from "../components/ProtectedRoute";
import { auth, db } from "@/firebase/config";

interface UserData {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    profileImage?: string;
}

interface DashboardStats {
    totalUsers: number;
    newUsersToday: number;
    totalBalances: number;
    pendingWithdrawals: number;
}

type AccountType = "bank" | "paypal" | "bitcoin" | "ethereum";

interface PaymentAccount {
    id: string;
    type: AccountType;
    label: string;
    details: Record<string, string>;
    active: boolean;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
    updatedBy?: string;
}

interface Field {
    key: string;
    label: string;
    placeholder?: string;
    optional?: boolean;
}

const ACCOUNT_TYPES: Record<
    AccountType,
    { name: string; icon: React.ElementType; tile: string; fields: Field[] }
> = {
    bank: {
        name: "Bank account",
        icon: Landmark,
        tile: "bg-blue-50 text-blue-600",
        fields: [
            { key: "bankName", label: "Bank name", placeholder: "e.g. Chase Bank" },
            { key: "accountName", label: "Account name", placeholder: "Name on the account" },
            { key: "accountNumber", label: "Account number / IBAN", placeholder: "Account number" },
            { key: "swift", label: "SWIFT / routing code", placeholder: "Optional", optional: true },
        ],
    },
    paypal: {
        name: "PayPal",
        icon: CreditCard,
        tile: "bg-indigo-50 text-indigo-600",
        fields: [
            { key: "email", label: "PayPal email", placeholder: "payments@company.com" },
            { key: "accountName", label: "Account name", placeholder: "Optional", optional: true },
        ],
    },
    bitcoin: {
        name: "Bitcoin (BTC)",
        icon: Bitcoin,
        tile: "bg-orange-50 text-orange-600",
        fields: [{ key: "address", label: "BTC address", placeholder: "bc1..." }],
    },
    ethereum: {
        name: "Ethereum (ETH)",
        icon: Gem,
        tile: "bg-purple-50 text-purple-600",
        fields: [{ key: "address", label: "ETH address", placeholder: "0x..." }],
    },
};

const TYPE_ORDER: AccountType[] = ["bank", "paypal", "bitcoin", "ethereum"];

const inputClass =
    "w-full px-4 py-3 border border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all";
const labelClass = "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5";

function validateAccount(type: AccountType, d: Record<string, string>): string {
    for (const f of ACCOUNT_TYPES[type].fields) {
        if (!f.optional && !d[f.key]?.trim()) return `Please enter ${f.label.toLowerCase()}.`;
    }
    if (type === "bitcoin" && !/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/.test(d.address.trim()))
        return "That doesn't look like a valid Bitcoin address.";
    if (type === "ethereum" && !/^0x[a-fA-F0-9]{40}$/.test(d.address.trim()))
        return "That doesn't look like a valid Ethereum address.";
    if (type === "paypal" && !/^\S+@\S+\.\S+$/.test(d.email.trim()))
        return "Please enter a valid PayPal email.";
    return "";
}

// ─── Add / Edit modal ──────────────────────────────────────────────────────────

function AccountModal({
    account,
    adminEmail,
    onClose,
}: {
    account: PaymentAccount | null;
    adminEmail: string;
    onClose: () => void;
}) {
    const isEdit = !!account;
    const [type, setType] = useState<AccountType>(account?.type ?? "bank");
    const [label, setLabel] = useState(account?.label ?? "");
    const [details, setDetails] = useState<Record<string, string>>(account?.details ?? {});
    const [active, setActive] = useState(account?.active ?? true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const cfg = ACCOUNT_TYPES[type];

    const save = async () => {
        const msg = validateAccount(type, details);
        if (msg) return setError(msg);

        const cleaned: Record<string, string> = {};
        cfg.fields.forEach((f) => {
            const v = details[f.key]?.trim();
            if (v) cleaned[f.key] = v;
        });

        setSaving(true);
        setError("");
        try {
            if (isEdit && account) {
                await updateDoc(doc(db, "paymentAccounts", account.id), {
                    label: label.trim(),
                    details: cleaned,
                    active,
                    updatedAt: serverTimestamp(),
                    updatedBy: adminEmail,
                });
            } else {
                await addDoc(collection(db, "paymentAccounts"), {
                    type,
                    label: label.trim(),
                    details: cleaned,
                    active,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    updatedBy: adminEmail,
                });
            }
            onClose();
        } catch (e) {
            console.error(e);
            setError("Couldn't save this account. Check your permissions and try again.");
            setSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center sm:p-4"
            onClick={() => !saving && onClose()}
        >
            <div
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
                className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between px-6 pt-6 pb-2">
                    <h2 className="text-lg font-bold text-gray-900">
                        {isEdit ? "Edit payment account" : "Add payment account"}
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={saving}
                        aria-label="Close"
                        className="w-9 h-9 rounded-full text-gray-500 hover:bg-gray-100 flex items-center justify-center"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="px-6 pb-6 pt-3 space-y-5">
                    {/* Type */}
                    {!isEdit ? (
                        <div>
                            <label className={labelClass}>Account type</label>
                            <div className="grid grid-cols-2 gap-2">
                                {TYPE_ORDER.map((t) => {
                                    const c = ACCOUNT_TYPES[t];
                                    const selected = t === type;
                                    return (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => { setType(t); setDetails({}); setError(""); }}
                                            className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-colors ${
                                                selected ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            <span className={`w-9 h-9 rounded-full flex items-center justify-center ${c.tile}`}>
                                                <c.icon size={16} />
                                            </span>
                                            <span className="text-sm font-semibold text-gray-900">{c.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                            <span className={`w-9 h-9 rounded-full flex items-center justify-center ${cfg.tile}`}>
                                <cfg.icon size={16} />
                            </span>
                            <span className="text-sm font-semibold text-gray-900">{cfg.name}</span>
                        </div>
                    )}

                    <div>
                        <label className={labelClass}>Nickname (optional)</label>
                        <input
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            placeholder="e.g. Main USD account"
                            className={inputClass}
                        />
                    </div>

                    {cfg.fields.map((f) => (
                        <div key={f.key}>
                            <label className={labelClass}>{f.label}</label>
                            <input
                                value={details[f.key] ?? ""}
                                onChange={(e) => { setDetails((p) => ({ ...p, [f.key]: e.target.value })); setError(""); }}
                                placeholder={f.placeholder}
                                autoComplete="off"
                                className={inputClass}
                            />
                        </div>
                    ))}

                    {/* Active toggle */}
                    <label className="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 cursor-pointer">
                        <span>
                            <span className="block text-sm font-semibold text-gray-900">Show to users</span>
                            <span className="block text-xs text-gray-500 mt-0.5">
                                When off, users can&apos;t see this account when they invest.
                            </span>
                        </span>
                        <input
                            type="checkbox"
                            checked={active}
                            onChange={(e) => setActive(e.target.checked)}
                            className="sr-only peer"
                        />
                        <span className="relative w-11 h-6 rounded-full bg-gray-200 peer-checked:bg-blue-600 transition-colors flex-shrink-0 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-5" />
                    </label>

                    {isEdit && (
                        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                            <TriangleAlert size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                            <p className="text-amber-800 text-xs leading-relaxed">
                                Changes go live immediately. Users who invest after you save will pay into the new
                                details, so double-check them.
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                            <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={saving}
                            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={save}
                            disabled={saving}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-60"
                        >
                            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : isEdit ? "Save changes" : "Add account"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Delete dialog (two-step, serious warning) ────────────────────────────────

function DeleteDialog({
    account,
    onEdit,
    onDeactivate,
    onClose,
}: {
    account: PaymentAccount;
    onEdit: () => void;
    onDeactivate: () => void;
    onClose: () => void;
}) {
    const [stage, setStage] = useState<1 | 2>(1);
    const [confirm, setConfirm] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");
    const cfg = ACCOUNT_TYPES[account.type];

    const forceDelete = async () => {
        setDeleting(true);
        setError("");
        try {
            await deleteDoc(doc(db, "paymentAccounts", account.id));
            onClose();
        } catch (e) {
            console.error(e);
            setError("Couldn't delete this account. Check your permissions and try again.");
            setDeleting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center sm:p-4"
            onClick={() => !deleting && onClose()}
        >
            <div
                role="alertdialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
                className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto p-6 space-y-5"
            >
                <div className="flex items-start gap-4">
                    <span className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                        <TriangleAlert size={22} />
                    </span>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            {stage === 1 ? "This is a dangerous action" : "Final confirmation"}
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {cfg.name}{account.label ? ` · ${account.label}` : ""}
                        </p>
                    </div>
                </div>

                {stage === 1 && (
                    <>
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
                            <p className="text-red-800 text-sm leading-relaxed">
                                <strong>This is the account shown to users when they want to invest from the website.</strong> deleting it means the account/address wont show up in the investement page anymore and this cannot be undone. 
                            </p>
                            <p className="text-red-800 text-sm leading-relaxed">
                                This cannot be undone.
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <p className="text-blue-900 text-sm font-semibold mb-1">Safer options</p>
                            <p className="text-blue-800 text-xs leading-relaxed">
                                If the details changed, <strong>edit</strong> this account instead. If you just want to
                                stop accepting payments here, <strong>hide it from users</strong>. Both keep your records intact.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <button
                                onClick={onEdit}
                                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-2"
                            >
                                <Pencil size={16} /> Edit instead (recommended)
                            </button>
                            {account.active && (
                                <button
                                    onClick={onDeactivate}
                                    className="w-full py-3 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 flex items-center justify-center gap-2"
                                >
                                    <Power size={16} /> Hide from users instead
                                </button>
                            )}
                            <button
                                onClick={() => setStage(2)}
                                className="w-full py-3 rounded-xl text-red-600 text-sm font-semibold hover:bg-red-50"
                            >
                                I understand the risk, continue to delete
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-2 text-gray-500 text-sm hover:text-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                )}

                {stage === 2 && (
                    <>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            To permanently delete this account, type{" "}
                            <span className="font-mono font-bold text-red-600">DELETE</span> below.
                        </p>
                        <input
                            value={confirm}
                            onChange={(e) => { setConfirm(e.target.value); setError(""); }}
                            placeholder="Type DELETE"
                            autoFocus
                            className={inputClass}
                        />
                        {error && <p className="text-red-600 text-sm">{error}</p>}
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                disabled={deleting}
                                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={forceDelete}
                                disabled={confirm !== "DELETE" || deleting}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {deleting ? <><Loader2 size={16} className="animate-spin" /> Deleting...</> : <><Trash2 size={16} /> Delete forever</>}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}


export default function DashboardPage() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0, newUsersToday: 0, totalBalances: 0, pendingWithdrawals: 0,
    });

    const [accounts, setAccounts] = useState<PaymentAccount[]>([]);
    const [accountsLoading, setAccountsLoading] = useState(true);
    const [modal, setModal] = useState<{ open: boolean; account: PaymentAccount | null }>({ open: false, account: null });
    const [deleteTarget, setDeleteTarget] = useState<PaymentAccount | null>(null);
    const [copiedKey, setCopiedKey] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const snap = await getDocs(query(collection(db, "users"), where("uid", "==", user.uid)));
                    if (!snap.empty) {
                        setUserData(snap.docs[0].data() as UserData);
                        await fetchDashboardStats();
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                router.push("/login");
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router]);

    // Live payment accounts (admins only)
    useEffect(() => {
        return onSnapshot(
            collection(db, "paymentAccounts"),
            (snap) => {
                setAccounts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as PaymentAccount)));
                setAccountsLoading(false);
            },
            () => setAccountsLoading(false)
        );
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const usersRef = collection(db, "users");
            const totalUsers = (await getCountFromServer(usersRef)).data().count;

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const newUsersToday = (
                await getCountFromServer(query(usersRef, where("createdAt", ">=", today)))
            ).data().count;

            let totalBalances = 0;
            const usersData = await getDocs(query(usersRef, where("balance", ">=", 0)));
            usersData.forEach((d) => { totalBalances += d.data().balance || 0; });

            const pendingWithdrawals = (
                await getCountFromServer(query(collection(db, "withdrawals"), where("status", "==", "pending")))
            ).data().count;

            setStats({ totalUsers, newUsersToday, totalBalances, pendingWithdrawals });
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
        }
    };

    const sortedAccounts = useMemo(
        () =>
            [...accounts].sort(
                (a, b) =>
                    TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type) ||
                    (a.createdAt?.toMillis() ?? 0) - (b.createdAt?.toMillis() ?? 0)
            ),
        [accounts]
    );

    const missingTypes = useMemo(
        () => TYPE_ORDER.filter((t) => !accounts.some((a) => a.type === t && a.active)),
        [accounts]
    );

    const toggleActive = async (a: PaymentAccount) => {
        try {
            await updateDoc(doc(db, "paymentAccounts", a.id), {
                active: !a.active,
                updatedAt: serverTimestamp(),
                updatedBy: userData?.email ?? "",
            });
        } catch (e) {
            console.error(e);
        }
    };

    const copy = (key: string, value: string) => {
        navigator.clipboard.writeText(value);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(""), 1800);
    };


    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

    if (loading) return <BitcoinLoadingScreen />;

    const statCards = [
        {
            title: "Total users",
            value: stats.totalUsers.toLocaleString(),
            note: stats.newUsersToday > 0 ? `+${stats.newUsersToday} today` : "No new users today",
            icon: Users,
            tile: "bg-blue-50 text-blue-600",
        },
        {
            title: "Total user balances",
            value: formatCurrency(stats.totalBalances),
            note: "Sum of all wallet balances",
            icon: DollarSign,
            tile: "bg-green-50 text-green-600",
        },
        {
            title: "Pending withdrawals",
            value: stats.pendingWithdrawals.toLocaleString(),
            note: stats.pendingWithdrawals > 0 ? "Waiting for review" : "All caught up",
            icon: AlertCircle,
            tile: "bg-orange-50 text-orange-600",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Stats */}
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {statCards.map((s) => (
                        <div key={s.title} className="bg-white border border-gray-200 rounded-2xl p-5">
                            <div className={`w-11 h-11 rounded-full flex items-center justify-center ${s.tile}`}>
                                <s.icon size={20} />
                            </div>
                            <p className="text-gray-500 text-sm mt-4">{s.title}</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{s.value}</p>
                            <p className="text-xs text-gray-400 mt-2">{s.note}</p>
                        </div>
                    ))}
                </section>

                {/* Quick actions */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { title: "Add new user", description: "Create a new user account", icon: UserPlus, path: "/panel/users/add", tile: "bg-blue-50 text-blue-600" },
                        { title: "Manage users", description: "View and edit user accounts", icon: Users, path: "/panel/users", tile: "bg-purple-50 text-purple-600" },
                    ].map((l) => (
                        <button
                            key={l.title}
                            onClick={() => router.push(l.path)}
                            className="group flex items-center gap-4 bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-5 text-left transition-colors"
                        >
                            <span className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${l.tile}`}>
                                <l.icon size={22} />
                            </span>
                            <span className="flex-1">
                                <span className="block font-semibold text-gray-900">{l.title}</span>
                                <span className="block text-sm text-gray-500">{l.description}</span>
                            </span>
                            <ArrowUpRight size={18} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </button>
                    ))}
                </section>

                { (
                    <section className="bg-white border border-gray-200 rounded-3xl overflow-hidden">
                        <div className="flex items-center justify-between gap-4 p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Payment accounts</h2>
                                <p className="text-gray-500 text-sm mt-1">
                                    The accounts users pay into when they invest.
                                </p>
                            </div>
                            <button
                                onClick={() => setModal({ open: true, account: null })}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors flex-shrink-0"
                            >
                                <Plus size={16} /> Add account
                            </button>
                        </div>

                        {/* Coverage warning */}
                        {!accountsLoading && missingTypes.length > 0 && accounts.length > 0 && (
                            <div className="mx-6 mt-5 flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                                <TriangleAlert size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                                <p className="text-amber-800 text-xs leading-relaxed">
                                    No active account for:{" "}
                                    <strong>{missingTypes.map((t) => ACCOUNT_TYPES[t].name).join(", ")}</strong>. Users
                                    can&apos;t pay with these methods until you add one.
                                </p>
                            </div>
                        )}

                        <div className="p-6">
                            {accountsLoading && (
                                <div className="space-y-3">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
                                    ))}
                                </div>
                            )}

                            {!accountsLoading && sortedAccounts.length === 0 && (
                                <div className="text-center py-10">
                                    <div className="w-14 h-14 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-4">
                                        <Landmark size={24} />
                                    </div>
                                    <p className="font-semibold text-gray-900">No payment accounts yet</p>
                                    <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
                                        Add a bank, PayPal or crypto account so users know where to send their investment.
                                    </p>
                                    <button
                                        onClick={() => setModal({ open: true, account: null })}
                                        className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
                                    >
                                        <Plus size={16} /> Add your first account
                                    </button>
                                </div>
                            )}

                            {!accountsLoading && sortedAccounts.length > 0 && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {sortedAccounts.map((a) => {
                                        const cfg = ACCOUNT_TYPES[a.type] ?? ACCOUNT_TYPES.bank;
                                        return (
                                            <div
                                                key={a.id}
                                                className={`border rounded-2xl p-5 ${a.active ? "border-gray-200" : "border-gray-200 bg-gray-50"}`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <span className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.tile}`}>
                                                            <cfg.icon size={20} />
                                                        </span>
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-gray-900 truncate">{a.label || cfg.name}</p>
                                                            <p className="text-xs text-gray-500">{cfg.name}</p>
                                                        </div>
                                                    </div>
                                                    <span
                                                        className={`px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                                                            a.active ? "bg-green-50 text-green-700" : "bg-gray-200 text-gray-600"
                                                        }`}
                                                    >
                                                        {a.active ? "Visible" : "Hidden"}
                                                    </span>
                                                </div>

                                                <div className="mt-4 space-y-2">
                                                    {cfg.fields
                                                        .filter((f) => a.details?.[f.key])
                                                        .map((f) => {
                                                            const k = `${a.id}-${f.key}`;
                                                            return (
                                                                <div key={f.key} className="flex items-center justify-between gap-3 text-sm">
                                                                    <span className="text-gray-500 flex-shrink-0">{f.label}</span>
                                                                    <span className="flex items-center gap-2 min-w-0">
                                                                        <span className="text-gray-900 font-mono text-xs truncate">{a.details[f.key]}</span>
                                                                        <button
                                                                            onClick={() => copy(k, a.details[f.key])}
                                                                            aria-label={`Copy ${f.label}`}
                                                                            className="text-gray-400 hover:text-blue-600 flex-shrink-0"
                                                                        >
                                                                            {copiedKey === k ? <CheckCircle size={14} className="text-green-600" /> : <Copy size={14} />}
                                                                        </button>
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                </div>

                                                <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-gray-100">
                                                    <p className="text-xs text-gray-400 truncate">
                                                        {a.updatedAt
                                                            ? `Updated ${a.updatedAt.toDate().toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}${a.updatedBy ? ` by ${a.updatedBy}` : ""}`
                                                            : ""}
                                                    </p>
                                                    <div className="flex items-center gap-1 flex-shrink-0">
                                                        <button
                                                            onClick={() => toggleActive(a)}
                                                            aria-label={a.active ? "Hide from users" : "Show to users"}
                                                            title={a.active ? "Hide from users" : "Show to users"}
                                                            className="w-9 h-9 rounded-full text-gray-500 hover:bg-gray-100 flex items-center justify-center"
                                                        >
                                                            <Power size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => setModal({ open: true, account: a })}
                                                            aria-label="Edit"
                                                            title="Edit"
                                                            className="w-9 h-9 rounded-full text-gray-500 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteTarget(a)}
                                                            aria-label="Delete"
                                                            title="Delete"
                                                            className="w-9 h-9 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-600 flex items-center justify-center"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </div>

            {modal.open && (
                <AccountModal
                    key={modal.account?.id ?? "new"}
                    account={modal.account}
                    adminEmail={userData?.email ?? ""}
                    onClose={() => setModal({ open: false, account: null })}
                />
            )}

            {deleteTarget && (
                <DeleteDialog
                    account={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onEdit={() => {
                        const a = deleteTarget;
                        setDeleteTarget(null);
                        setModal({ open: true, account: a });
                    }}
                    onDeactivate={async () => {
                        const a = deleteTarget;
                        setDeleteTarget(null);
                        await toggleActive(a);
                    }}
                />
            )}
        </div>
    );
}