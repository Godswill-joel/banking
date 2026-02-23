"use client";

import { useState, useEffect } from "react";
import {
  User, Mail, Phone, Calendar, MapPin, Globe,
  Shield, DollarSign, Lock, Eye, EyeOff,
  Save, Edit2, Check, AlertCircle, Loader
} from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useUserData, UserData } from "@/lib/hook/useUserData";
import { useFormatPrice } from "@/lib/hook/useFormatPrice";

const PortfolioDashboard = () => {
  const { user, userData, loading: userLoading, error } = useUserData();
  const { formatUSD } = useFormatPrice();

  const [isEditing, setIsEditing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [formData, setFormData] = useState<UserData | null>(null);

  useEffect(() => {
    if (userData) setFormData(userData);
  }, [userData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!formData) return;
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const saveToFirebase = async () => {
    if (!user || !formData) return;
    setLoading(true);
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          ...formData,
          balance: Number(formData.balance),
          bitcoinBalance: Number(formData.bitcoinBalance),
        },
        { merge: true }
      );
      setSaveStatus("success");
      setIsEditing(false);
      setTimeout(() => setSaveStatus(""), 3000);
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading || !formData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#080808]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-2 border-[#B4925B] border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-600 text-xs tracking-widest uppercase">Loading</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#080808] gap-3">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  const InputField = ({
    label,
    icon: Icon,
    name,
    type = "text",
    value,
    readOnly = false,
  }: {
    label: string;
    icon: React.ElementType;
    name: keyof UserData;
    type?: string;
    value: string | number | boolean | null | undefined;
    readOnly?: boolean;
  }) => {
    const isCheckbox = type === "checkbox";
    const isActive = isEditing && !readOnly;

    if (isCheckbox) {
      return (
        <div className="flex items-center justify-between py-3 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Icon className="w-4 h-4 text-[#B4925B]/50" />
            <span className="text-xs text-zinc-500 uppercase tracking-wider">{label}</span>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            Boolean(value)
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-zinc-800 text-zinc-500"
          }`}>
            {Boolean(value) ? "Verified" : "Unverified"}
          </span>
        </div>
      );
    }

    return (
      <div>
        <label className="block text-[10px] font-semibold text-[#B4925B]/60 mb-1.5 uppercase tracking-widest">
          {label}
        </label>
        <div className="relative">
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B4925B]/40" />
          <input
            type={type}
            name={name}
            value={value ?? ""}
            onChange={handleInputChange}
            disabled={!isActive}
            className={`w-full bg-white/[0.03] border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none transition-all duration-200
              ${isActive
                ? "border-[#B4925B]/40 focus:border-[#B4925B] focus:bg-white/[0.05] focus:ring-1 focus:ring-[#B4925B]/20"
                : "border-white/5 cursor-default text-zinc-400"
              }`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight"
              style={{ background: "linear-gradient(90deg, #B4925B, #e0c99a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Portfolio Dashboard
            </h1>
            <p className="text-zinc-500 text-sm mt-0.5">Manage your banking profile & investments</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {saveStatus === "success" && (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-400 text-sm">Saved</span>
              </div>
            )}
            {saveStatus === "error" && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="text-red-400 text-sm">Failed</span>
              </div>
            )}

            {isEditing ? (
              <button
                onClick={saveToFirebase}
                disabled={loading}
                className="flex items-center gap-2 bg-[#B4925B] hover:bg-[#C9A96E] active:scale-95 disabled:opacity-60 text-black font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200"
              >
                {loading
                  ? <Loader className="w-4 h-4 animate-spin" />
                  : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 border border-[#B4925B]/40 hover:border-[#B4925B] hover:bg-[#B4925B]/10 active:scale-95 text-[#B4925B] text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* ── Balance Card ── */}
        <div
          className="rounded-2xl sm:rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #C9A96E 0%, #B4925B 50%, #8B7355 100%)",
            boxShadow: "0 20px 60px -12px rgba(180,146,91,0.35)",
          }}
        >
          <div className="p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

              {/* Balance */}
              <div>
                <p className="text-black/60 text-xs font-semibold uppercase tracking-widest mb-2">Total Balance</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2
                    className="font-extrabold text-black leading-none tracking-tight"
                    style={{ fontSize: "clamp(1.8rem, 6vw, 3rem)" }}
                  >
                    {showBalance
                      ? selectedCurrency === "USD"
                        ? formatUSD(formData.balance)
                        : `${formData.bitcoinBalance} BTC`
                      : "••••••••"}
                  </h2>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-2 rounded-lg bg-black/10 hover:bg-black/20 active:scale-95 transition-all"
                    aria-label="Toggle visibility"
                  >
                    {showBalance
                      ? <EyeOff className="w-5 h-5 text-black" />
                      : <Eye className="w-5 h-5 text-black" />}
                  </button>
                </div>
              </div>

              {/* Currency switcher */}
              <div className="flex gap-2 self-start sm:self-auto">
                {["USD", "BTC"].map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setSelectedCurrency(curr)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 ${
                      selectedCurrency === curr
                        ? "bg-black text-[#B4925B] shadow-lg"
                        : "bg-black/15 text-black hover:bg-black/25"
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Profile Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">

          {/* Personal Info */}
          <div
            className="rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-4"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(180,146,91,0.12)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
              <div className="w-8 h-8 rounded-lg bg-[#B4925B]/15 flex items-center justify-center">
                <User className="w-4 h-4 text-[#B4925B]" />
              </div>
              <h3 className="text-base font-bold text-white">Personal & Account</h3>
            </div>

            <InputField label="Full Name"   icon={User}     name="fullName"      value={formData.fullName} />
            <InputField label="First Name"  icon={User}     name="firstName"     value={formData.firstName} />
            <InputField label="Last Name"   icon={User}     name="lastName"      value={formData.lastName} />
            <InputField label="Username"    icon={User}     name="username"      value={formData.username} />
            <InputField label="Email"       icon={Mail}     name="email"         value={formData.email}         readOnly />
            <InputField label="Email Verified" icon={Mail}  name="emailVerified" type="checkbox" value={formData.emailVerified} readOnly />
            <InputField label="Phone"       icon={Phone}    name="phone"         value={formData.phone} />
            <InputField label="Phone Verified" icon={Phone} name="phoneVerified" type="checkbox" value={formData.phoneVerified} readOnly />
            <InputField label="Date of Birth" icon={Calendar} name="dateOfBirth" value={formData.dateOfBirth} />
          </div>

          {/* Address & KYC */}
          <div
            className="rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-4"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(180,146,91,0.12)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
              <div className="w-8 h-8 rounded-lg bg-[#B4925B]/15 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-[#B4925B]" />
              </div>
              <h3 className="text-base font-bold text-white">Address & KYC</h3>
            </div>

            <InputField label="Address"        icon={MapPin}    name="address"       value={formData.address} />
            <InputField label="City"           icon={MapPin}    name="city"          value={formData.city} />
            <InputField label="Country"        icon={Globe}     name="country"       value={formData.country} />
            <InputField label="Zip Code"       icon={MapPin}    name="zipCode"       value={formData.zipCode} />
            <InputField label="Wallet Address" icon={DollarSign} name="walletAddress" value={formData.walletAddress} />
            <InputField label="KYC Verified"   icon={Shield}    name="kycVerified"   type="checkbox" value={formData.kycVerified} readOnly />
          </div>
        </div>

        {/* ── Security Notice ── */}
        <div
          className="rounded-2xl p-5 sm:p-6 flex items-start gap-4"
          style={{
            background: "rgba(180,146,91,0.06)",
            border: "1px solid rgba(180,146,91,0.15)",
          }}
        >
          <div className="w-8 h-8 rounded-lg bg-[#B4925B]/15 flex items-center justify-center shrink-0 mt-0.5">
            <Lock className="w-4 h-4 text-[#B4925B]" />
          </div>
          <div>
            <h4 className="font-semibold text-[#B4925B] text-sm mb-1">Data Protection Notice</h4>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Your profile data is securely stored in Firestore. Updates are permanent and auditable.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PortfolioDashboard;