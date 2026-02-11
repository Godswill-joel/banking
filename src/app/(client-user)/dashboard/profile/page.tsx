"use client";

import { useState} from 'react';
import {
  User, Mail, Phone, Calendar, MapPin, Globe, Shield,
  CreditCard, TrendingUp, DollarSign, Lock, Eye, EyeOff,
  Save, Edit2, Check, AlertCircle, Loader
} from 'lucide-react';


// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };

const PortfolioDashboard = () => {
  
  const [isEditing, setIsEditing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  type FormData = {
    // Personal Information
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    nationality: string;
    address: string;
  
    // Identity & Compliance
    idType: string;
    idNumber: string;
    verificationStatus: string;
  
    // Financial Overview
    totalBalance: number;
    investments: number;
    loanStatus: string;
  
    // Security
    accountStatus: string;
    lastLogin: string;
    twoFactorAuth: boolean;
  };

  const [formData, setFormData] = useState<FormData>({
    
    // Personal Information
    fullName: 'John Werey',
    email: 'werey@gmail.com',
    phone: '+234 XXX XXX XXXX',
    dateOfBirth: '1990-01-01',
    nationality: 'Nigeria',
    address: 'Port Harcourt, Rivers State, NG',

    // Identity & Compliance
    idType: 'National ID',
    idNumber: 'NIN-XXXXXXXXX',
    verificationStatus: 'Verified',

    // Financial Overview
    totalBalance: 350,
    investments: 12.5,
    loanStatus: 'Active - 2 Loans',

    // Security
    accountStatus: 'Active',
    lastLogin: new Date().toISOString(),
    twoFactorAuth: true
  });

  const [transactions] = useState([
    { id: 1, type: 'Deposit', amount: 500, date: '2026-01-05', status: 'Completed' },
    { id: 2, type: 'Investment', amount: -200, date: '2026-01-04', status: 'Completed' },
    { id: 3, type: 'Withdrawal', amount: -150, date: '2026-01-03', status: 'Completed' },
    { id: 4, type: 'Reward', amount: 25, date: '2026-01-02', status: 'Completed' }
  ]);

  // Simulated Firebase save function
  const saveToFirebase = async () => {
    setLoading(true);
    setSaveStatus('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In production, use:
      // const db = getFirestore();
      // await setDoc(doc(db, 'portfolios', userId), formData);

      setSaveStatus('success');
      setIsEditing(false);
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
  
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value
    }));
  };
  


  // Field configurations for mapping
  // const personalInfoFields = [
  //   { label: 'Full Name', icon: User, name: 'fullName', type: 'text' },
  //   { label: 'Email Address', icon: Mail, name: 'email', type: 'email' },
  //   { label: 'Phone Number', icon: Phone, name: 'phone', type: 'text' },
  //   { label: 'Date of Birth', icon: Calendar, name: 'dateOfBirth', type: 'date' },
  //   { label: 'Nationality', icon: Globe, name: 'nationality', type: 'text' },
  //   { label: 'Residential Address', icon: MapPin, name: 'address', type: 'text' }
  // ];

  // const identityFields = [
  //   { label: 'ID Number', icon: CreditCard, name: 'idNumber', type: 'text' }
  // ];
  type InputFieldProps = {
    label: string;
    icon: React.ElementType;
    name: keyof FormData;
    type?: React.HTMLInputTypeAttribute;
    disabled?: boolean;
    value: string | number;
  };
  const InputField = ({ label, icon: Icon, name, type = "text", disabled = false, value }: InputFieldProps) => (
    <div className="relative">
      <label className="block text-xs font-medium text-amber-400/70 mb-2 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500/50" />
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleInputChange}
          disabled={disabled || !isEditing}
          className={`w-full bg-black/40 border ${isEditing ? 'border-amber-500/50' : 'border-amber-900/30'
            } rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 ${!isEditing ? 'cursor-not-allowed opacity-70' : ''
            }`}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#B4925B] to-white bg-clip-text text-transparent">
              Portfolio Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Manage your banking profile & investments</p>
          </div>
          <div className="flex items-center gap-4">
            {saveStatus === 'success' && (
              <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-xl bg-black/40 border border-[#B4925B]/30 rounded-xl p-4 md:p-6 shadow-xl">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-green-400 text-sm">Saved successfully</span>
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 text-sm">Save failed</span>
              </div>
            )}
            {isEditing ? (
              <button
                onClick={saveToFirebase}
                disabled={loading}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/50 hover:bg-amber-500/20 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                <Edit2 className="w-5 h-5" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Financial Overview Card */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-[#B4925B] to-[#8B7355] rounded-2xl shadow-2xl overflow-hidden border border-[#B4925B]/300 rounded-3xl p-8 shadow-2xl shadow-amber-500/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500/20 p-3 rounded-xl">
                <DollarSign className="w-8 h-8 text-black" />
              </div>
              <div>
                <p className="text-black font-semibold text-lg uppercase tracking-wide font-medium">Total Balance</p>
                <div className="flex items-center gap-3 mt-1">
                  <h2 className="text-5xl md:text-6xl font-bold text-black">
                    {showBalance ? `$${formData.totalBalance}` : '****'}
                  </h2>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-amber-400/50 hover:text-[#8B7355] transition-colors"
                  >
                    {showBalance ? <EyeOff className="w-6 h-6 text-black" /> : <Eye className="w-6 h-6 text-black" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-3  ">
              {['USD', 'BTC', 'EUR'].map((curr) => (
                <button
                  key={curr}
                  onClick={() => setSelectedCurrency(curr)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${selectedCurrency === curr
                      ? 'bg-black text-[#B4925B] shadow-lg'
                      : 'bg-amber-500/10 text-black hover:bg-amber-500/20'
                    }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20">
              <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
              <p className="text-sm text-gray-400 mb-1">Investment Growth</p>
              <p className="text-2xl font-bold text-green-400">+{formData.investments}%</p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20">
              <CreditCard className="w-8 h-8 text-blue-400 mb-3" />
              <p className="text-sm text-gray-400 mb-1">Loan Status</p>
              <p className="text-2xl font-bold text-white">{formData.loanStatus}</p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20">
              <Shield className="w-8 h-8 mb-3 text-[#B4925B]" />
              <p className="text-sm text-gray-400 mb-1">Account Status</p>
              <p className="text-2xl font-bold text-green-400">{formData.accountStatus}</p>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-[#B4925B] hover:text-[#8B7355]">
          {/* Personal Information */}
          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-[#B4925B] hover:text-[#8B7355] mb-6 flex items-center gap-3">
              <User className="w-7 h-7" />
              Personal Information
            </h3>
            <div className="space-y-4 ">
              <InputField label="Full Name" icon={User} name="fullName" value={formData.fullName} />
              <InputField label="Email Address" icon={Mail} name="email" type="email" value={formData.email} />
              <InputField label="Phone Number" icon={Phone} name="phone" value={formData.phone} />
              <InputField label="Date of Birth" icon={Calendar} name="dateOfBirth" type="date" value={formData.dateOfBirth} />
              <InputField label="Nationality" icon={Globe} name="nationality" value={formData.nationality} />
              <InputField label="Residential Address" icon={MapPin} name="address" value={formData.address} />
            </div>
          </div>

          {/* Identity & Compliance */}
          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-[#B4925B] hover:text-[#8B7355] mb-6 flex items-center gap-3">
              <Shield className="w-7 h-7" />
              Identity & Compliance
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#B4925B] hover:text-[#8B7355] mb-2 uppercase tracking-wide">
                  Government ID Type
                </label>
                <select
                  name="idType"
                  value={formData.idType}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full bg-black/40 text-[#B4925B] border ${isEditing ? 'border-amber-500/50' : 'border-amber-900/30'
                    } rounded-xl px-4 py-4 text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 ${!isEditing ? 'cursor-not-allowed opacity-70' : ''
                    }`}
                >
                  <option value="National ID">National ID</option>
                  <option value="Passport">Passport</option>
                  <option value="Driver's License">Driver&apos;s License</option>
                </select>
              </div>
              <InputField label="ID Number"  icon={CreditCard} name="idNumber" value={formData.idNumber} />
              <div>
                <label className="block text-xs font-medium text-[#B4925B]  hover:text-[#8B7355] mb-2 uppercase tracking-wide">
                  Verification Status
                </label>
                <div className="bg-black/40 border border-green-500/50 rounded-xl px-4 py-4 flex items-center gap-3">
                  <Check className="w-6 h-6 text-green-400" />
                  <span className="text-green-400 font-semibold">{formData.verificationStatus}</span>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-xs font-medium text-[#B4925B] hover:text-[#8B7355] mb-3 uppercase tracking-wide">
                  Two-Factor Authentication
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    name="twoFactorAuth"
                    checked={formData.twoFactorAuth}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-6 h-6 rounded bg-black/40 border-amber-500/50 text-amber-500 focus:ring-amber-500/20"
                  />
                  <span className={`text-sm ${formData.twoFactorAuth ? 'text-green-400' : 'text-gray-400'}`}>
                    {formData.twoFactorAuth ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-8 shadow-2xl">
          <h3 className="text-2xl font-bold text-[#B4925B] hover:text-[#8B7355] mb-6 flex items-center gap-3">
            <TrendingUp className="w-7 h-7" />
            Recent Transactions
          </h3>
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-black/30 border border-amber-500/10 rounded-xl p-5 flex items-center justify-between hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.amount > 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                    <DollarSign className={`w-6 h-6 ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{tx.type}</p>
                    <p className="text-sm text-gray-400">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount)}
                  </p>
                  <p className="text-sm text-gray-400">{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-gradient-to-r from-amber-500/10 to-yellow-600/10 border border-amber-500/30 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <Lock className="w-6 h-6 text-[#B4925B] flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-[#B4925B]  mb-2">Data Protection Notice</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                All information saved to your portfolio is permanently stored and secured. You may update your details at any time, but records cannot be deleted to maintain compliance with banking regulations and audit requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDashboard;